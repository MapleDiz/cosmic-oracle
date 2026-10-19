const fs = require("node:fs");
const vm = require("node:vm");
const assert = require("node:assert/strict");

function makeElement(id) {
  const el = {
    id, value: "", textContent: "", hidden: false, max: "",
    dataset: {}, attributes: {}, children: [], listeners: {}, className: "",
    style: { setProperty() {} },
    classList: {
      values: new Set(),
      add(...names) { names.forEach((n) => this.values.add(n)); },
      remove(...names) { names.forEach((n) => this.values.delete(n)); },
      toggle(name, force) {
        if (force === undefined) force = !this.values.has(name);
        if (force) this.values.add(name); else this.values.delete(name);
        return force;
      },
      contains(name) { return this.values.has(name); }
    },
    addEventListener(name, fn) { this.listeners[name] = fn; },
    setAttribute(name, value) { this.attributes[name] = String(value); },
    replaceChildren(...nodes) { this.children = nodes; },
    focus() {}
  };
  return el;
}

const ids = new Map();
const get = (id) => {
  if (!ids.has(id)) ids.set(id, makeElement(id));
  return ids.get(id);
};
const zodiacKeys = ["aries","taurus","gemini","cancer","leo","virgo","libra","scorpio","sagittarius","capricorn","aquarius","pisces"];
const zodiacButtons = zodiacKeys.map((key) => { const el = makeElement("zodiac-"+key); el.dataset.zodiac = key; return el; });
const tabs = ["day","week","month","year"].map((period) => { const el=makeElement("tab-"+period); el.dataset.period=period; return el; });
const adSlots = [makeElement("ad1"),makeElement("ad2")];
const documentListeners = {};
const document = {
  addEventListener(name, fn) { documentListeners[name] = fn; },
  getElementById: get,
  createElement: (tag) => makeElement(tag),
  querySelectorAll(selector) {
    if (selector === ".zodiac-option") return zodiacButtons;
    if (selector === ".forecast-tab") return tabs;
    if (selector === ".ad-slot") return adSlots;
    return [];
  }
};
const storage = new Map();
const context = {
  console, document, Date, Math, JSON, Object, String, Number, Promise,
  localStorage: { getItem: (k) => storage.has(k) ? storage.get(k) : null, setItem: (k,v) => storage.set(k,v) },
  matchMedia: () => ({ matches: false }),
  setTimeout: (fn) => { fn(); return 1; },
  clearTimeout: () => {},
  requestAnimationFrame: (fn) => { fn(); return 1; },
  cancelAnimationFrame: () => {},
  innerWidth: 1000, innerHeight: 800
};
context.window = context;
context.scrollTo = () => {};
vm.createContext(context);

const astronomySource = fs.readFileSync("assets/astronomy.browser.min.js", "utf8");
vm.runInContext(astronomySource, context);
assert.ok(context.Astronomy, "Astronomy Engine must load into the browser global");
assert.equal(typeof context.Astronomy.SunPosition, "function");
const appSource = fs.readFileSync("script.js", "utf8");
new vm.Script(appSource, { filename: "script.js" });
vm.runInContext(appSource, context, { filename: "script.js" });
assert.equal(typeof documentListeners.DOMContentLoaded, "function", "app registers DOM ready callback");
documentListeners.DOMContentLoaded();

get("userName").value = "Тест";
get("birthDate").value = "1990-04-15";
zodiacButtons.find((el) => el.dataset.zodiac === "aries").listeners.click();
(async () => {
  await get("profileForm").listeners.submit({ preventDefault() {} });
  assert.equal(get("resultScreen").hidden, false, "results screen should render");
  assert.match(get("transitSummary").textContent, /Астрономический расчёт выполнен локально/, "real ephemeris should be used, not fallback");
  assert.equal(get("planetChips").children.length, 7, "seven planetary position chips should render");

  const forecasts = {};
  for (let i=0;i<tabs.length;i++) {
    tabs[i].listeners.click();
    forecasts[tabs[i].dataset.period] = get("forecastText").textContent;
    assert.ok(forecasts[tabs[i].dataset.period].length > 100, "forecast text should be substantial for "+tabs[i].dataset.period);
    assert.ok(get("loveValue").textContent.length > 30, "relationship guidance should render");
    assert.ok(get("workValue").textContent.length > 30, "work guidance should render");
    assert.ok(get("moneyValue").textContent.length > 30, "money guidance should render");
    assert.ok(get("wellbeingValue").textContent.length > 30, "wellbeing guidance should render");
  }
  assert.equal(new Set(Object.values(forecasts)).size, 4, "day/week/month/year forecasts must not repeat verbatim");
  const before = get("forecastText").textContent;
  get("newForecast").listeners.click();
  const after = get("forecastText").textContent;
  assert.notEqual(after, before, "alternate forecast button must actually change the reading");
  console.log("PASS: ephemeris loaded; four periods render distinct forecast text; four life domains render; alternate variant changes the reading.");
})().catch((error) => { console.error(error); process.exitCode = 1; });
