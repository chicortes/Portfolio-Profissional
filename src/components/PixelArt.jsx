// PixelArt: desenha pixel art em SVG. Cada linha de "rows" é uma string e
// cada caractere, uma cor da paleta ("." = vazio).
export default function PixelArt({ rows, palette, px = 3, label }) {
  const rects = [];
  rows.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      if (palette[ch]) rects.push(<rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" fill={palette[ch]} />);
    })
  );
  const a11y = label ? { role: "img", "aria-label": label } : { "aria-hidden": true };
  return (
    <svg viewBox={`0 0 ${rows[0].length} ${rows.length}`} width={rows[0].length * px} height={rows.length * px} shapeRendering="crispEdges" {...a11y}>
      {rects}
    </svg>
  );
}
