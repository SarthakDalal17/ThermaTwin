let route = location.hash.slice(1) || "home",
  wizardStep = 1,
  activeSystemId = "ev",
  selectedModule = 1;
function activeSystem() {
  return TT.systems.find((system) => system.id === activeSystemId) || TT.systems[0];
}
function switchSystem(id) {
  activeSystemId = id;
  selectedModule = 1;
  render();
}
function home() {
  return `<main class="landing"><header class="landing-nav"><a class="brand" data-route="home">THERMA<span>TWIN</span></a><div class="landing-links"><a href="#capabilities">Platform</a><a href="#applications">Applications</a><a href="#contact">Contact</a></div><button class="button login-button" data-route="login">Log in <span>→</span></button></header><section class="hero"><div class="hero-copy"><span class="eyebrow">THERMAL DIGITAL TWIN PLATFORM</span><h1>Engineering confidence<br>for every <em>battery system.</em></h1><p>ThermaTwin adapts to your battery architecture—giving engineering teams a clear, connected view of thermal performance from pack to cell.</p><div class="hero-actions"><button class="button primary" data-route="register">Request workspace access</button><button class="text-button" data-route="login">Sign in to workspace →</button></div><div class="trust"><span>BUILT FOR</span><b>EV engineering</b><b>Energy storage</b><b>Battery research</b></div></div><div class="hero-visual"><div class="visual-label top">PACK / 08 MODULES</div><div class="pack-render">${Array.from({ length: 8 }, (_, i) => `<i class="${i === 3 ? "warm" : ""}"><b>${String(i + 1).padStart(2, "0")}</b><span></span><span></span><span></span><span></span></i>`).join("")}</div><div class="signal s1"><small>THERMAL STATE</small><b>34.8°C</b><em>● NORMAL</em></div><div class="signal s2"><small>PACK VOLTAGE</small><b>421.6 V</b></div><div class="visual-label bottom">LIVE ARCHITECTURE MODEL</div></div></section><section class="landing-strip" id="capabilities"><div><span class="eyebrow">ONE CONFIGURABLE PLATFORM</span><h2>Designed around your system.</h2></div><p>Define your architecture, monitor thermal behavior, and understand each cell’s operating context without adapting to a pre-set dashboard.</p><a data-route="login">Explore the platform →</a></section></main>`;
}
function systems() {
  return `<div class="page-head"><div><span class="eyebrow">WORKSPACE</span><h1>My Battery Systems</h1><p>Monitor and manage your configured battery systems.</p></div><button class="button primary" data-route="create">+ Create Battery System</button></div><div class="toolbar"><div class="search">⌕ <input id="systemSearch" placeholder="Search systems"></div><select class="filter-select" id="systemFilter"><option value="all">All applications</option><option>Electric Vehicle</option><option>Energy Storage</option></select><select class="filter-select" id="systemSort"><option value="recent">Sort: Recent</option><option value="name">Sort: Name</option><option value="cells">Sort: Cell count</option></select></div><div class="system-list" id="systemList">${systemCards(TT.systems)}</div>`;
}
function systemCards(items) {
  return (
    items
      .map(
        (s) =>
          `<article class="system-card"><div class="system-mark">▦</div><div class="system-info"><span class="eyebrow">${s.application}</span><h2>${s.name}</h2><p>${s.modules} Modules <i></i> ${s.modules * s.cellsPerModule} Cells <i></i> ${s.voltage}</p></div><span class="badge ${s.status === "Normal" ? "green" : "amber"}">● ${s.status.toUpperCase()}</span><button class="arrow" data-system-open="${s.id}">→</button></article>`,
      )
      .join("") || '<p class="empty-state">No battery systems match these filters.</p>'
  );
}
function dashboard() {
  let s = activeSystem();
  return `<div class="page-head dashboard-title"><div><span class="eyebrow">LIVE SYSTEM OVERVIEW</span><h1>Good morning, Sarthak.</h1><p>${s.name} is operating within expected conditions.</p></div><div class="page-tools">${systemSelect("dashboardSystem")}<div class="updated">● LIVE <small>Updated just now</small></div></div></div>${metricCards(s)}<div class="dash-grid">${chart("Temperature trend")} ${chart("Voltage / current trend", "var(--amber)")}<section class="panel twin-preview"><div class="panel-head"><div><span class="eyebrow">DIGITAL TWIN</span><h3>Pack overview</h3></div><a data-route="twin">Open twin →</a></div>${moduleGrid(s, selectedModule, true)}</section><section class="panel cooling-status"><span class="eyebrow">COOLING STATUS</span><h3>Liquid cooling operating normally</h3><p>Coolant flow is stable at <b>8.4 L/min</b>. Pack ΔT remains below its configured target.</p><a data-route="thermal">View thermal analytics →</a></section><section class="panel alerts-mini"><div class="panel-head"><h3>Active alerts</h3><a data-route="alerts">View all →</a></div><p><b class="dot amber"></b> Temperature Warning <span>Module 04</span></p><p><b class="dot amber"></b> Cell Imbalance <span>Module 06</span></p></section></div>`;
}
function cells() {
  let s = activeSystem(),
    rows = cellsFor(s);
  return `<div class="page-head"><div><span class="eyebrow">CELL-LEVEL TELEMETRY</span><h1>Cell Monitoring</h1><p>Voltage and thermal state across ${rows.length} cells.</p></div>${systemSelect("cellsSystem")}</div><div class="summary">${[
    ["Total Cells", rows.length],
    ["Healthy", rows.filter((x) => x.status === "Healthy").length],
    ["Warning", rows.filter((x) => x.status === "Warning").length],
    ["Critical", "0"],
  ]
    .map((x) => `<div><span>${x[0]}</span><b>${x[1]}</b></div>`)
    .join(
      "",
    )}</div><div class="toolbar"><div class="search">⌕ <input id="cellSearch" placeholder="Search cell"></div><select class="filter-select" id="cellModule"><option value="all">Module: All</option>${Array.from({ length: s.modules }, (_, i) => `<option value="${i + 1}">Module ${String(i + 1).padStart(2, "0")}</option>`).join("")}</select><select class="filter-select" id="cellStatus"><option value="all">Status: All</option><option>Healthy</option><option>Warning</option></select></div><section class="panel table-wrap"><table><thead><tr><th>Cell</th><th>Module</th><th>Voltage</th><th>Temperature</th><th>Status</th></tr></thead><tbody id="cellRows">${cellRows(rows)}</tbody></table></section>`;
}
function cellRows(rows) {
  return rows
    .map(
      (x) =>
        `<tr><td>${x.cell}</td><td>${x.module}</td><td>${x.voltage} V</td><td>${x.temp}°C</td><td><span class="badge ${x.status === "Healthy" ? "green" : "amber"}">● ${x.status.toUpperCase()}</span></td></tr>`,
    )
    .join("");
}
function thermal() {
  let s = activeSystem(),
    temps = cellsFor(s).map((x) => +x.temp),
    max = Math.max(...temps),
    min = Math.min(...temps),
    avg = temps.reduce((a, b) => a + b, 0) / temps.length;
  return `<div class="page-head"><div><span class="eyebrow">THERMAL PERFORMANCE / ${s.name.toUpperCase()}</span><h1>Thermal Analytics</h1><p>Operational trends and cooling performance.</p></div>${systemSelect("thermalSystem")}</div><div class="metrics thermal-metrics">${[
    ["Maximum Temperature", max.toFixed(1) + "°C"],
    ["Minimum Temperature", min.toFixed(1) + "°C"],
    ["Average Temperature", avg.toFixed(1) + "°C"],
    ["Temperature Δ", (max - min).toFixed(1) + "°C"],
  ]
    .map((x) => `<article class="metric"><span>${x[0]}</span><strong>${x[1]}</strong></article>`)
    .join(
      "",
    )}</div><div class="dash-grid">${chart("Temperature trend")}<section class="panel distribution"><span class="eyebrow">TEMPERATURE DISTRIBUTION</span><h3>Cell population</h3><div class="bars">${[24, 48, 76, 100, 69, 35, 18].map((x) => `<i style="height:${x}%"></i>`).join("")}</div><p>30°C <span>35°C</span></p></section><section class="panel cooling"><span class="eyebrow">COOLING PERFORMANCE</span><h3>Liquid Cooling <span class="badge green">NORMAL</span></h3><div class="detail-stats"><span>Coolant inlet <b>27.1°C</b></span><span>Coolant outlet <b>30.4°C</b></span><span>Flow rate <b>8.4 L/min</b></span><span>Target ΔT <b>&lt; 5°C</b></span></div></section></div>`;
}
function alerts() {
  return `<div class="page-head"><div><span class="eyebrow">SYSTEM EVENTS</span><h1>Alerts</h1><p>Review active conditions and resolved system events.</p></div></div><div class="toolbar"><select class="filter-select" id="alertSeverity"><option value="all">Severity: All</option><option>INFO</option><option>WARNING</option><option>CRITICAL</option></select><select class="filter-select" id="alertStatus"><option value="all">Status: All</option><option>ACTIVE</option><option>RESOLVED</option></select><select class="filter-select" id="alertType"><option value="all">Type: All</option>${[...new Set(TT.alerts.map((a) => a[0]))].map((t) => `<option>${t}</option>`).join("")}</select></div><section class="panel alert-list" id="alertList">${alertRows(TT.alerts)}</section>`;
}
function alertRows(rows) {
  return (
    rows
      .map(
        (a) =>
          `<article><b class="alert-symbol ${a[1].toLowerCase()}">!</b><div><h3>${a[0]} <span class="badge ${a[1] === "CRITICAL" ? "red" : a[1] === "WARNING" ? "amber" : "cyan"}">${a[1]}</span></h3><p>${a[3]}</p></div><div class="event-meta"><span class="${a[2].toLowerCase()}">${a[2]}</span><small>${a[4]}</small></div></article>`,
      )
      .join("") || '<p class="empty-state">No events match these filters.</p>'
  );
}
function reports() {
  let s = activeSystem(),
    rows = cellsFor(s);
  return `<div class="page-head"><div><span class="eyebrow">DATA EXPORT / ${s.name.toUpperCase()}</span><h1>Reports</h1><p>Prepare exports from system telemetry, thermal performance, battery health, and events.</p></div><div class="page-tools">${systemSelect("reportsSystem")}<button class="button primary" id="exportReport">⇩ Export telemetry CSV</button></div></div><section class="panel report-data"><div><span class="eyebrow">CONNECTED DATA MODEL</span><h2>Reading-ready report workspace</h2><p>Exports use the same per-cell data fields that can be supplied by the backend: timestamp, system, module, cell, voltage, temperature, status, and alert events.</p></div><span class="badge green">● ${rows.length} CURRENT CELL READINGS</span></section><div class="report-grid">${[
    [
      "Thermal Performance",
      "Maximum, minimum and average temperature with pack ΔT and coolant conditions.",
      "◌",
    ],
    [
      "Battery Health",
      "Cell voltage spread, status distribution and module-level health summary.",
      "♥",
    ],
    [
      "Temperature Trends",
      "Time-series telemetry structure ready for imported backend readings.",
      "⌁",
    ],
    ["Alert Summary", "Active and resolved warning, critical, cooling and sensor events.", "!"],
  ]
    .map(
      (x) =>
        `<article class="panel report"><i>${x[2]}</i><h2>${x[0]}</h2><p>${x[1]}</p><a class="report-link" data-report="${x[0]}">Preview report →</a></article>`,
    )
    .join("")}</div>`;
}
function settings() {
  return `<div class="page-head"><div><span class="eyebrow">ACCOUNT</span><h1>Account Settings</h1><p>Manage your ThermaTwin account details.</p></div></div><section class="panel settings"><h2>Profile</h2><div class="profile-edit"><b>SD</b><div><strong>Sarthak Dalal</strong><span>Engineering workspace</span></div></div><div class="form-grid">${field("Full Name", "name", "text", "Sarthak Dalal")}${field("Work Email", "workEmail", "email", "sarthak@workspace.com")}</div><h2>Workspace</h2><div class="detail-stats"><span>Role <b>Engineering</b></span><span>Workspace status <b class="normal-text">Active</b></span></div><button class="button primary" id="saveAccount">Save changes</button></section>`;
}
function render() {
  let bare = ["home", "login", "register"].includes(route),
    content =
      route === "home"
        ? home()
        : route === "login" || route === "register"
          ? auth(route)
          : route === "systems"
            ? systems()
            : route === "create"
              ? wizard(wizardStep)
              : route === "overview"
                ? dashboard()
                : route === "twin"
                  ? twinView()
                  : route === "cells"
                    ? cells()
                    : route === "thermal"
                      ? thermal()
                      : route === "alerts"
                        ? alerts()
                        : route === "reports"
                          ? reports()
                          : settings();
  document.querySelector("#app").innerHTML = bare ? content : shell(content, route);
  bind();
}
function bind() {
  document.querySelectorAll("[data-route]").forEach(
    (e) =>
      (e.onclick = () => {
        route = e.dataset.route;
        location.hash = route;
        render();
      }),
  );
  let form = document.querySelector("#authForm");
  if (form)
    form.onsubmit = (e) => {
      e.preventDefault();
      route = "overview";
      location.hash = route;
      render();
    };
  document
    .querySelector(".menu")
    ?.addEventListener("click", () => document.querySelector(".sidebar").classList.toggle("open"));
  document.querySelectorAll("[data-wizard]").forEach(
    (e) =>
      (e.onclick = () => {
        syncConfig();
        if (e.dataset.wizard === "next") {
          if (wizardStep === 4) {
            route = "twin";
            location.hash = route;
          } else wizardStep++;
        } else wizardStep--;
        render();
      }),
  );
  ["modules", "cells"].forEach((id) =>
    document.querySelector("#" + id)?.addEventListener("input", () => {
      let m = +document.querySelector("#modules").value || 0,
        c = +document.querySelector("#cells").value || 0;
      document.querySelector("#totalCells").textContent = m * c;
      document.querySelector("#multiply").textContent = `${m} × ${c}`;
    }),
  );
  document.querySelectorAll(".module").forEach(
    (e) =>
      (e.onclick = () => {
        selectedModule = +e.dataset.module;
        render();
      }),
  );
  document
    .querySelectorAll("#twinSystem,#dashboardSystem,#cellsSystem,#thermalSystem,#reportsSystem")
    .forEach((e) => (e.onchange = () => switchSystem(e.value)));
  document.querySelectorAll("[data-system-open]").forEach(
    (e) =>
      (e.onclick = () => {
        activeSystemId = e.dataset.systemOpen;
        route = "overview";
        location.hash = route;
        render();
      }),
  );
  bindSystemFilters();
  bindCellFilters();
  bindAlertFilters();
  document.querySelector("#exportReport")?.addEventListener("click", exportTelemetry);
  document.querySelectorAll(".report-link").forEach(
    (e) =>
      (e.onclick = () => {
        e.textContent = "Report preview ready";
        e.classList.add("ready");
      }),
  );
  document.querySelector("#saveAccount")?.addEventListener("click", (e) => {
    e.target.textContent = "Changes saved";
    e.target.classList.add("saved");
  });
}
function bindSystemFilters() {
  let search = document.querySelector("#systemSearch"),
    filter = document.querySelector("#systemFilter"),
    sort = document.querySelector("#systemSort"),
    list = document.querySelector("#systemList");
  if (!list) return;
  let update = () => {
    let items = TT.systems.filter(
      (s) =>
        (filter.value === "all" || s.application === filter.value) &&
        s.name.toLowerCase().includes(search.value.toLowerCase()),
    );
    if (sort.value === "name") items.sort((a, b) => a.name.localeCompare(b.name));
    if (sort.value === "cells")
      items.sort((a, b) => b.modules * b.cellsPerModule - a.modules * a.cellsPerModule);
    list.innerHTML = systemCards(items);
    document.querySelectorAll("[data-system-open]").forEach(
      (e) =>
        (e.onclick = () => {
          activeSystemId = e.dataset.systemOpen;
          route = "overview";
          location.hash = route;
          render();
        }),
    );
  };
  search.oninput = update;
  filter.onchange = update;
  sort.onchange = update;
}
function bindAlertFilters() {
  let severity = document.querySelector("#alertSeverity"),
    status = document.querySelector("#alertStatus"),
    type = document.querySelector("#alertType"),
    list = document.querySelector("#alertList");
  if (!list) return;
  let update = () =>
    (list.innerHTML = alertRows(
      TT.alerts.filter(
        (a) =>
          (severity.value === "all" || a[1] === severity.value) &&
          (status.value === "all" || a[2] === status.value) &&
          (type.value === "all" || a[0] === type.value),
      ),
    ));
  severity.onchange = update;
  status.onchange = update;
  type.onchange = update;
}
function bindCellFilters() {
  let search = document.querySelector("#cellSearch"),
    module = document.querySelector("#cellModule"),
    status = document.querySelector("#cellStatus"),
    body = document.querySelector("#cellRows");
  if (!body) return;
  let update = () => {
    let rows = cellsFor(activeSystem()).filter(
      (cell) =>
        (module.value === "all" || cell.moduleNumber === +module.value) &&
        (status.value === "all" || cell.status === status.value) &&
        cell.cell.toLowerCase().includes(search.value.toLowerCase()),
    );
    body.innerHTML = cellRows(rows);
  };
  search.oninput = update;
  module.onchange = update;
  status.onchange = update;
}
function exportTelemetry() {
  let s = activeSystem(),
    header = "timestamp,system,module,cell,voltage_v,temperature_c,status\n",
    timestamp = new Date().toISOString(),
    data = cellsFor(s)
      .map((c) => `${timestamp},${s.name},${c.module},${c.cell},${c.voltage},${c.temp},${c.status}`)
      .join("\n"),
    blob = new Blob([header + data], { type: "text/csv" }),
    url = URL.createObjectURL(blob),
    a = document.createElement("a");
  a.href = url;
  a.download = `${s.id}-telemetry.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
function syncConfig() {
  let map = {
    sysName: "name",
    application: "application",
    chemistry: "chemistry",
    modules: "modules",
    cells: "cellsPerModule",
    electrical: "electrical",
    voltage: "nominalVoltage",
    warning: "warning",
    critical: "critical",
    target: "targetDelta",
    cooling: "cooling",
    flow: "flow",
  };
  Object.entries(map).forEach(([id, key]) => {
    let el = document.querySelector("#" + id);
    if (el) TT.config[key] = el.type === "number" ? +el.value : el.value;
  });
  let configured = {
    ...TT.systems[1],
    name: TT.config.name,
    modules: TT.config.modules,
    cellsPerModule: TT.config.cellsPerModule,
    voltage: TT.config.nominalVoltage + " V",
  };
  TT.systems[1] = configured;
}
window.addEventListener("hashchange", () => {
  route = location.hash.slice(1) || "home";
  render();
});
render();
