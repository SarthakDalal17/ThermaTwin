const TT = {
  systems: [
    {
      id: "solar",
      name: "SolarPack X1",
      application: "Energy Storage",
      modules: 6,
      cellsPerModule: 24,
      voltage: "403.2 V",
      status: "Normal",
    },
    {
      id: "ev",
      name: "EV Prototype X1",
      application: "Electric Vehicle",
      modules: 8,
      cellsPerModule: 24,
      voltage: "421.6 V",
      status: "Warning",
    },
  ],
  metrics: [
    ["SOC", "78.4", "%", "cyan"],
    ["Pack Voltage", "421.6", "V", ""],
    ["Current", "126", "A", ""],
    ["Power", "53.2", "kW", ""],
    ["Max Temperature", "34.8", "°C", "amber"],
    ["Min Temperature", "30.9", "°C", ""],
    ["ΔT", "3.9", "°C", "green"],
  ],
  nav: [
    ["overview", "Overview", "⌂"],
    ["systems", "Systems", "▣"],
    ["twin", "Digital Twin", "◈"],
    ["cells", "Cells", "▤"],
    ["thermal", "Thermal", "◌"],
    ["alerts", "Alerts", "!"],
    ["reports", "Reports", "▧"],
  ],
  alerts: [
    [
      "Temperature Warning",
      "WARNING",
      "ACTIVE",
      "Module 04 exceeded the configured advisory limit.",
      "2 min ago",
    ],
    [
      "Cell Imbalance",
      "WARNING",
      "ACTIVE",
      "Voltage deviation detected across Module 06.",
      "18 min ago",
    ],
    [
      "Cooling Fault",
      "CRITICAL",
      "RESOLVED",
      "Coolant flow briefly fell below target.",
      "Yesterday",
    ],
    ["Sensor Fault", "INFO", "RESOLVED", "Module 02 sensor signal restored.", "Sep 18"],
  ],
  config: {
    name: "SolarPack X1",
    application: "Energy Storage",
    chemistry: "Lithium-ion",
    modules: 6,
    cellsPerModule: 24,
    electrical: "6S × 24P",
    nominalVoltage: 403.2,
    warning: 38,
    critical: 45,
    targetDelta: 5,
    cooling: "Liquid Cooling",
    flow: 8.4,
  },
};
function cellsFor(system = TT.systems[1]) {
  let a = [];
  for (let m = 1; m <= system.modules; m++)
    for (let c = 1; c <= system.cellsPerModule; c++) {
      let t = 30.4 + ((m * 7 + c * 3) % 43) / 10,
        status = t > 34.4 ? "Warning" : "Healthy";
      a.push({
        cell: `M${String(m).padStart(2, "0")}-C${String(c).padStart(2, "0")}`,
        module: `Module ${String(m).padStart(2, "0")}`,
        moduleNumber: m,
        voltage: (3.62 + ((m + c) % 12) / 100).toFixed(3),
        temp: t.toFixed(1),
        status,
      });
    }
  return a;
}
function moduleReading(system, module) {
  let moduleCells = cellsFor(system).filter((cell) => cell.moduleNumber === module),
    temps = moduleCells.map((cell) => +cell.temp),
    volts = moduleCells.map((cell) => +cell.voltage),
    max = Math.max(...temps),
    min = Math.min(...temps),
    state = max > 34.4 ? "Warning" : "Normal";
  return {
    temperature: (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1),
    max: max.toFixed(1),
    delta: (max - min).toFixed(1),
    voltage: volts.reduce((a, b) => a + b, 0).toFixed(2),
    health: (99.4 - module * 0.13).toFixed(1),
    state,
    cells: moduleCells,
  };
}
