"use client";

// Named export (preferred)
export const CenterTextPlugin = {
  id: "centerText",
  afterDraw(chart: any) {
    const { ctx, chartArea: { width, height } } = chart;
    const meta = chart.getDatasetMeta(0);
    if (!meta || !meta.total) return;
    const total = meta.total;
    const ds = chart.data.datasets[0];
    const done = Array.isArray(ds.data) ? Number(ds.data[0]) : 0;
    const pct = total ? Math.round((done / total) * 100) : 0;
    ctx.save();
    ctx.font = `700 ${Math.min(width, height) / 6}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#111827";
    ctx.fillText(`${pct}%`, width / 2, height / 2);
    ctx.restore();
  }
};

export default CenterTextPlugin;

