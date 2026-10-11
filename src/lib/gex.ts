/** Legacy synthetic GEX module — retained empty so no broken imports. Use TradingView. */
export type AssetClass = "index" | "futures" | "forex" | "commodity";

export function generateGex() {
  return {
    summary: "Synthetic GEX removed. Use live charts.",
    levels: [] as { strike: number; gex: number; type: string; strength: string }[],
  };
}
