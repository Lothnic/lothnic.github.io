export function createFooterRevealReader(): () => number {
  const hasReveal = Boolean(document.querySelector(".hw-scroll"));

  return () => {
    const raw = document.documentElement.style.getPropertyValue("--hw-footer-opacity");
    const fallback = hasReveal ? 0 : 1;
    if (!raw) return fallback;
    const value = Number.parseFloat(raw);
    return Number.isFinite(value) ? value : fallback;
  };
}
