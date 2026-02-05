"use client";
import * as React from "react";

export function useAutoGrowGridStack<T extends HTMLElement>(
  contentRef: React.RefObject<T>
) {
  React.useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const wrapper = el.closest(".grid-stack-item-content") as HTMLElement | null;
    if (wrapper) wrapper.style.overflow = "visible";

    const itemEl = el.closest(".grid-stack-item") as HTMLElement | null;

    const gridEl = el.closest(".grid-stack") as any;
    const grid = gridEl?.gridstack;
    if (!grid || !itemEl) return;

    let paused = false;

    const updateHeight = () => {
      if (paused) return;
      const contentH = el.offsetHeight;

      const cellH =
        (typeof grid.opts.cellHeight === "number"
          ? grid.opts.cellHeight
          : parseInt(String(grid?.opts?.cellHeight || 110), 10)) || 110;

      const m = grid.opts.margin;
      const vMargin = Array.isArray(m) ? Number(m[0] ?? 0) : Number(m ?? 0);

      const rows = Math.max(1, Math.ceil((contentH + vMargin) / (cellH + vMargin)));
      grid.update(itemEl, { h: rows });
    };

    const onStart = (_e: any, el2: HTMLElement) => { if (el2 === itemEl) paused = true; };
    const onStop  = (_e: any, el2: HTMLElement) => {
      if (el2 === itemEl) { paused = false; requestAnimationFrame(updateHeight); }
    };

    grid.on("resizestart", onStart);
    grid.on("resizestop",  onStop);
    grid.on("dragstart",   onStart);
    grid.on("dragstop",    onStop);

    const ro = new ResizeObserver(updateHeight);
    ro.observe(el);
    updateHeight();

    return () => {
      ro.disconnect();
      grid.off("resizestart", onStart);
      grid.off("resizestop",  onStop);
      grid.off("dragstart",   onStart);
      grid.off("dragstop",    onStop);
    };
  }, [contentRef]);
}
