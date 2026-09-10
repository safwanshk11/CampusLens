/**
 * Film grain over the whole viewport. Fixed (never inside a scrolling layer) so
 * the noise tile is rasterised once and composited, not repainted on scroll.
 */
export function Grain() {
  return <div aria-hidden className="grain pointer-events-none fixed inset-0 z-grain" />;
}
