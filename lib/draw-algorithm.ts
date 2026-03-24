import { SupabaseClient } from '@supabase/supabase-js'

export type SimulationResult = {
  winningNumbers: number[]
  totalPrizePool: number
  tierBreakdown: {
    matches5: { amountPerWinner: number; count: number; totalAssigned: number }
    matches4: { amountPerWinner: number; count: number; totalAssigned: number }
    matches3: { amountPerWinner: number; count: number; totalAssigned: number }
  }
  rollover: number
  winners: any[] // Array of winning user IDs and their tier
}

export async function runDrawLogic(supabaseAdmin: SupabaseClient, isSimulation: boolean = true): Promise<SimulationResult> {
  // 1. Fetch active subscribers
  const { data: subs } = await supabaseAdmin
    .from('subscriptions')
    .select('user_id')
    .eq('status', 'active')

  const activeCount = subs?.length || 0
  
  // Assume generic monthly plan costs $50
  const grossTotal = activeCount * 50
  
  // Deduct 20% total for charity/platform
  const totalPrizePool = grossTotal * 0.8

  // Check prev rollover
  const { data: latestDraw } = await supabaseAdmin
    .from('draws')
    .select('jackpot_rollover')
    .order('created_at', { ascending: false })
    .limit(1)

  const rollover = latestDraw && latestDraw.length > 0 ? Number(latestDraw[0].jackpot_rollover || 0) : 0
  const finalPool = totalPrizePool + rollover

  const tier5Total = finalPool * 0.40
  const tier4Total = finalPool * 0.35
  const tier3Total = finalPool * 0.25

  // 2. Generate 5 random numbers between 1 and 45
  const winningNumbers = new Set<number>()
  while(winningNumbers.size < 5) {
    winningNumbers.add(Math.floor(Math.random() * 45) + 1)
  }
  const winArray = Array.from(winningNumbers)

  // 3. Match users
  // Fetch latest 5 scores for all active users
  const userScoresMap: Record<string, number[]> = {}
  
  // In production with millions of rows, use a raw SQL CTE grouping or edge function via Database RPC.
  // We'll mimic fetching valid scores
  const { data: allActiveScores } = await supabaseAdmin
    .from('scores')
    .select('user_id, score')
    .order('played_date', { ascending: false })

  if (allActiveScores) {
    allActiveScores.forEach(s => {
      if (!userScoresMap[s.user_id]) userScoresMap[s.user_id] = []
      if (userScoresMap[s.user_id].length < 5) { // Only keep their latest 5
        userScoresMap[s.user_id].push(s.score)
      }
    })
  }

  // Calculate matches
  const tier5Winners: string[] = []
  const tier4Winners: string[] = []
  const tier3Winners: string[] = []

  Object.entries(userScoresMap).forEach(([userId, scores]) => {
    let matches = 0
    scores.forEach(s => {
      if (winningNumbers.has(s)) matches++
    })
    
    if (matches === 5) tier5Winners.push(userId)
    else if (matches === 4) tier4Winners.push(userId)
    else if (matches === 3) tier3Winners.push(userId)
  })

  // Calculate payouts
  let actualRollover = 0
  let t5Amt = 0
  if (tier5Winners.length > 0) {
    t5Amt = tier5Total / tier5Winners.length
  } else {
    actualRollover = tier5Total // Rollover if no jackpot winner
  }

  const t4Amt = tier4Winners.length > 0 ? tier4Total / tier4Winners.length : 0
  const t3Amt = tier3Winners.length > 0 ? tier3Total / tier3Winners.length : 0

  const allWinnersList = [
    ...tier5Winners.map(u => ({ id: u, tier: 5, amount: t5Amt })),
    ...tier4Winners.map(u => ({ id: u, tier: 4, amount: t4Amt })),
    ...tier3Winners.map(u => ({ id: u, tier: 3, amount: t3Amt })),
  ]

  // If publishing, save to DB
  if (!isSimulation) {
    const { data: drawData } = await supabaseAdmin.from('draws').insert([{
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      is_published: true,
      draw_type: 'random',
      winning_scores: winArray,
      total_prize_pool: finalPool,
      jackpot_rollover: actualRollover
    }]).select()

    const drawId = drawData?.[0]?.id

    if (drawId && allWinnersList.length > 0) {
      const inserts = allWinnersList.map(w => ({
        draw_id: drawId,
        user_id: w.id,
        matched_tier: w.tier,
        prize_amount: w.amount,
        status: 'pending' // pending manual verification
      }))
      await supabaseAdmin.from('draw_winners').insert(inserts)
    }
  }

  return {
    winningNumbers: winArray,
    totalPrizePool: finalPool,
    tierBreakdown: {
      matches5: { amountPerWinner: t5Amt, count: tier5Winners.length, totalAssigned: tier5Winners.length * t5Amt },
      matches4: { amountPerWinner: t4Amt, count: tier4Winners.length, totalAssigned: tier4Winners.length * t4Amt },
      matches3: { amountPerWinner: t3Amt, count: tier3Winners.length, totalAssigned: tier3Winners.length * t3Amt },
    },
    rollover: actualRollover,
    winners: allWinnersList
  }
}
