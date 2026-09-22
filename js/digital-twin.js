function moduleGrid(system = TT.systems[1], selected = 1, compact = false) {
  return `<div class="module-grid ${compact ? "compact" : ""}">${Array.from(
    { length: system.modules },
    (_, i) => {
      let n = i + 1,
        reading = moduleReading(system, n),
        state = reading.state === "Warning" ? "warning" : "normal";
      return `<button class="module ${state} ${n === selected ? "selected" : ""}" data-module="${n}"><span>MODULE ${String(n).padStart(2, "0")}</span><b>${reading.temperature}°C</b><em>${system.cellsPerModule} CELLS</em></button>`;
    },
  ).join("")}</div>`;
}
function systemSelect(id) {
  return `<label class="system-select"><span>System</span><select id="${id}">${TT.systems.map((s) => `<option value="${s.id}" ${s.id === activeSystemId ? "selected" : ""}>${s.name}</option>`).join("")}</select></label>`;
}
function cellTiles(cells, type) {
  return cells
    .map((cell) => {
      let value = type === "temperature" ? cell.temp : cell.voltage,
        warning =
          type === "temperature" ? +cell.temp > 34.4 : Math.abs(+cell.voltage - 3.675) > 0.04;
      return `<div class="cell-tile ${warning ? "hot" : ""}" title="${cell.cell}: ${value}${type === "temperature" ? "°C" : " V"}"><span>${cell.cell.split("-")[1]}</span><b>${value}${type === "temperature" ? "°" : ""}</b></div>`;
    })
    .join("");
}
function twinView() {
  let s = activeSystem(),
    reading = moduleReading(s, selectedModule),
    voltages = reading.cells.map((c) => +c.voltage),
    spread = (Math.max(...voltages) - Math.min(...voltages)).toFixed(3);
  return `<div class="page-head"><div><span class="eyebrow">SYSTEM / ${s.name.toUpperCase()}</span><h1>Digital Twin</h1><p>Live architecture and thermal state representation.</p></div>${systemSelect("twinSystem")}</div><div class="twin-layout"><section class="panel pack"><div class="panel-head"><div><span class="eyebrow">PACK ARCHITECTURE</span><h3>${s.modules} Modules · ${s.modules * s.cellsPerModule} Cells</h3></div><span class="badge green">● CONNECTED</span></div>${moduleGrid(s, selectedModule)}<div class="legend"><span class="normal">● Normal</span><span class="warning">● Warning / elevated</span><span class="critical">● Critical</span></div></section><aside class="panel detail"><span class="eyebrow">MODULE ${String(selectedModule).padStart(2, "0")} / ${reading.state.toUpperCase()}</span><h2>${reading.temperature}°C</h2><p>${reading.state === "Warning" ? "Advisory temperature condition" : "Normal operating range"}</p><div class="detail-stats"><span>Module voltage <b>${reading.voltage} V</b></span><span>Cell ΔT <b>${reading.delta}°C</b></span><span>Voltage spread <b>${spread} V</b></span><span>Health <b>${reading.health}%</b></span></div><h3>Cell thermal map <small>°C</small></h3><div class="cell-map detailed-map">${cellTiles(reading.cells, "temperature")}</div><h3>Cell voltage map <small>V</small></h3><div class="cell-map detailed-map voltage-map">${cellTiles(reading.cells, "voltage")}</div></aside></div>`;
}
