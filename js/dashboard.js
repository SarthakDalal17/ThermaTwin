function chart(label, color = "var(--cyan)") {
  let pts = "0,72 24,62 48,67 72,42 96,50 120,30 144,36 168,18 192,26 216,12 240,22 264,7 288,14";
  return `<section class="panel chart"><div class="panel-head"><div><span class="eyebrow">LIVE DATA</span><h3>${label}</h3></div><span class="live-dot">LIVE</span></div><svg viewBox="0 0 288 90" preserveAspectRatio="none"><defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop stop-color="${color}" stop-opacity=".23"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs><path d="M${pts} L288,90 L0,90Z" fill="url(#g)"/><polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" vector-effect="non-scaling-stroke"/></svg><div class="axis"><span>10:10</span><span>10:20</span><span>10:30</span><span>Now</span></div></section>`;
}
function metricCards(system) {
  let offset = system?.id === "solar" ? -8.4 : 0,
    values = TT.metrics.map((metric) => [...metric]);
  values[1][1] = (421.6 + offset).toFixed(1);
  values[2][1] = system?.id === "solar" ? "84" : "126";
  values[3][1] = system?.id === "solar" ? "34.1" : "53.2";
  let temps = cellsFor(system).map((cell) => +cell.temp);
  values[4][1] = Math.max(...temps).toFixed(1);
  values[5][1] = Math.min(...temps).toFixed(1);
  values[6][1] = (Math.max(...temps) - Math.min(...temps)).toFixed(1);
  return `<div class="metrics">${values.map((m) => `<article class="metric ${m[3]}"><span>${m[0]}</span><strong>${m[1]}<small>${m[2]}</small></strong><i></i></article>`).join("")}</div>`;
}
