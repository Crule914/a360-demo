// @ts-nocheck
// Enhanced portfolio data to ensure all clients have proper portfolio structure
export const generatePortfolioData = (householdAssets: number, keyMetrics: any) => {
  const ytdReturn = keyMetrics?.yearToDateReturn || keyMetrics?.portfolioReturn || 0;
  const benchmarkReturn = 8.5; // Standard market benchmark
  
  // Generate realistic allocation based on client profile
  const baseAllocation = {
    stocks: 60,
    bonds: 25,
    alternatives: 10,
    cash: 5
  };
  
  // Adjust allocation based on performance - higher performers tend to have more stocks
  const stocksAdjustment = Math.min(Math.max(ytdReturn * 2, -15), 15);
  const adjustedAllocation = {
    stocks: Math.max(30, Math.min(80, baseAllocation.stocks + stocksAdjustment)),
    bonds: Math.max(10, Math.min(40, baseAllocation.bonds - stocksAdjustment * 0.5)),
    alternatives: baseAllocation.alternatives,
    cash: Math.max(0, Math.min(15, baseAllocation.cash - stocksAdjustment * 0.3))
  };
  
  // Normalize to 100% with one decimal place
  const total = Object.values(adjustedAllocation).reduce((sum, val) => sum + val, 0);
  const keys = Object.keys(adjustedAllocation) as Array<keyof typeof adjustedAllocation>;
  
  // Round each percentage to one decimal and track the total
  let roundedTotal = 0;
  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      // Make the last item absorb any rounding differences to ensure 100% total
      adjustedAllocation[key] = Math.round((100 - roundedTotal) * 10) / 10;
    } else {
      adjustedAllocation[key] = Math.round(((adjustedAllocation[key] / total) * 100) * 10) / 10;
      roundedTotal += adjustedAllocation[key];
    }
  });
  
  // Generate top holdings based on asset size
  const generateHoldings = (totalValue: number) => {
    const holdings = [
      { symbol: 'AAPL', name: 'Apple Inc.', percentage: 8.5 },
      { symbol: 'MSFT', name: 'Microsoft Corp.', percentage: 7.2 },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', percentage: 6.8 },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', percentage: 5.9 },
      { symbol: 'NVDA', name: 'NVIDIA Corp.', percentage: 4.7 },
      { symbol: 'TSLA', name: 'Tesla Inc.', percentage: 3.8 },
      { symbol: 'META', name: 'Meta Platforms Inc.', percentage: 3.2 },
      { symbol: 'BRK.B', name: 'Berkshire Hathaway', percentage: 2.9 },
      { symbol: 'SCHF', name: 'Schwab International Equity ETF', percentage: 15.2 },
      { symbol: 'SCHZ', name: 'Schwab US Aggregate Bond ETF', percentage: 12.1 }
    ];
    
    return holdings.slice(0, 5).map(holding => ({
      ...holding,
      value: (totalValue * holding.percentage / 100)
    }));
  };
  
  return {
    totalValue: householdAssets,
    ytdReturn,
    benchmarkReturn,
    allocation: adjustedAllocation,
    topHoldings: generateHoldings(householdAssets),
    riskProfile: ytdReturn > 12 ? 'aggressive' : ytdReturn > 8 ? 'moderate' : 'conservative',
    lastRebalance: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(), // Random date within last 90 days
    nextReviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() // 90 days from now
  };
};

export const ensurePortfolioData = (client: any) => {
  if (!client.portfolioData && client.householdAssets && client.keyMetrics) {
    client.portfolioData = generatePortfolioData(client.householdAssets, client.keyMetrics);
  }
  return client;
};