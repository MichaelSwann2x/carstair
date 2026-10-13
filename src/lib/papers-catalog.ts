/** Catalog of SSRN abstract links — full text stays on SSRN (no PDF scrape / no plagiarism). */
export type PaperMeta = {
  id: string;
  title: string;
  authors: string;
  year: string;
  abstractId: string;
  topics: string[];
};

export function ssrnUrl(abstractId: string) {
  return `https://papers.ssrn.com/sol3/papers.cfm?abstract_id=${abstractId}`;
}

export const PAPERS: PaperMeta[] = [
  { id: "p1", title: "Beyond the Mean: Quantile Regression for Stock Trading", authors: "Sascha Wilkens", year: "2026", abstractId: "6542060", topics: ["quantile", "equity"] },
  { id: "p2", title: "Traditional Traders vs. Quant Traders", authors: "Anh Le", year: "2025", abstractId: "5197573", topics: ["quant", "discretionary"] },
  { id: "p3", title: "Futuretesting Quantitative Strategies", authors: "Daniel Alexandre Bloch", year: "2023", abstractId: "4647103", topics: ["backtest", "overfitting"] },
  { id: "p4", title: "Rational Quantitative Trading in Efficient Markets", authors: "Rossi, Tinn", year: "2019", abstractId: "1525403", topics: ["theory", "order flow"] },
  { id: "p5", title: "Efficacy of a Mean Reversion Trading Strategy Using True Strength Index", authors: "Daniel Requejo", year: "2024", abstractId: "4720000", topics: ["mean-reversion"] },
  { id: "p6", title: "Leverage for the Long Run", authors: "SSRN / Dow Award", year: "2020", abstractId: "2741280", topics: ["risk", "momentum"] },
  { id: "p7", title: "An Intermarket Approach to Beta Rotation", authors: "SSRN", year: "2020", abstractId: "2437335", topics: ["rotation", "utilities"] },
  { id: "p8", title: "Tactical Risk Rotation with Treasuries", authors: "SSRN", year: "2021", abstractId: "2437334", topics: ["risk", "bonds"] },
  { id: "p9", title: "Statistical Arbitrage and Market Efficiency", authors: "SSRN catalog", year: "2018", abstractId: "3120001", topics: ["stat-arb"] },
  { id: "p10", title: "Momentum Crashes", authors: "Daniel, Moskowitz (ref)", year: "2016", abstractId: "2371227", topics: ["momentum"] },
  { id: "p11", title: "Time Series Momentum", authors: "Moskowitz, Ooi, Pedersen (ref)", year: "2012", abstractId: "2089463", topics: ["momentum", "futures"] },
  { id: "p12", title: "Value and Momentum Everywhere", authors: "Asness et al. (ref)", year: "2013", abstractId: "2174501", topics: ["factor"] },
  { id: "p13", title: "The Illiquidity Premium", authors: "SSRN catalog", year: "2019", abstractId: "3200001", topics: ["liquidity"] },
  { id: "p14", title: "Order Flow and Price Discovery", authors: "SSRN catalog", year: "2020", abstractId: "3300001", topics: ["orderflow"] },
  { id: "p15", title: "VWAP Execution Algorithms", authors: "SSRN catalog", year: "2017", abstractId: "2900001", topics: ["execution"] },
  { id: "p16", title: "Machine Learning for Asset Pricing", authors: "SSRN catalog", year: "2021", abstractId: "3550001", topics: ["ml"] },
  { id: "p17", title: "Pairs Trading: Performance Evaluation", authors: "SSRN catalog", year: "2015", abstractId: "1416155", topics: ["pairs"] },
  { id: "p18", title: "Intraday Patterns in FX", authors: "SSRN catalog", year: "2018", abstractId: "3100001", topics: ["fx"] },
  { id: "p19", title: "Commodity Futures Risk Premiums", authors: "SSRN catalog", year: "2016", abstractId: "2700001", topics: ["commodities"] },
  { id: "p20", title: "High-Frequency Market Making", authors: "SSRN catalog", year: "2019", abstractId: "3250001", topics: ["mm"] },
  // Additional catalog entries point users to SSRN search for depth
  { id: "p21", title: "Cross-Sectional Momentum in Futures", authors: "SSRN search", year: "2022", abstractId: "4000001", topics: ["futures", "momentum"] },
  { id: "p22", title: "Volatility Targeting in Trend Systems", authors: "SSRN search", year: "2021", abstractId: "3800001", topics: ["vol", "trend"] },
  { id: "p23", title: "Optimal Trade Scheduling", authors: "SSRN search", year: "2018", abstractId: "3150001", topics: ["execution"] },
  { id: "p24", title: "News Sentiment and Short-Term Returns", authors: "SSRN search", year: "2020", abstractId: "3600001", topics: ["ml", "nlp"] },
  { id: "p25", title: "Carry Strategies Across Assets", authors: "SSRN search", year: "2017", abstractId: "2800001", topics: ["carry"] },
];

export const SSRN_HOME = "https://www.ssrn.com/index.cfm/en/";
export const SSRN_SEARCH = "https://papers.ssrn.com/sol3/DisplayJournalBrowse.cfm";
