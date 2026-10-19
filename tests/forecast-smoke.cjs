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
  console, document, Date, Math, JSON, Object, String, Number, Promise, URL,
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

  get("openCompatibility").listeners.click();
  assert.equal(get("compatibilitySection").hidden,false,"compatibility section opens");
  get("compatNameA").value = "Анна";
  get("compatGenderA").value = "female";
  get("compatBirthA").value = "1992-03-25";
  get("compatNameB").value = "Александр";
  get("compatGenderB").value = "male";
  get("compatBirthB").value = "1990-09-07";
  get("compatibilityForm").listeners.submit({preventDefault() {}});
  assert.equal(get("compatibilityResult").hidden,false,"compatibility output appears after submit");
  const scoreA = get("compatOverallScore").textContent;
  const dims = ["compatNamesScore","compatZodiacScore","compatLoveScore","compatFamilyScore","compatWorkScore","compatHomeScore"];
  for (const id of dims) assert.match(get(id).textContent,/^\d+\/100$/,"compatibility score renders for "+id);
  for (const id of ["compatNamesText","compatZodiacText","compatLoveText","compatFamilyText","compatWorkText","compatHomeText","compatStrengths","compatChallenges","compatContributionA","compatContributionB"]) {
    assert.ok(get(id).textContent.length > 20,"compatibility interpretation renders for "+id);
  }
  const originalSummary = get("compatSignPair").textContent;
  const initialNameExplanation = get("compatNamesText").textContent;
  get("compatNameB").value = "Мария";
  get("compatBirthB").value = "1988-02-12";
  get("compatibilityForm").listeners.submit({preventDefault() {}});
  assert.notEqual(get("compatSignPair").textContent,originalSummary,"changing a partner updates the compatibility result");
  assert.notEqual(get("compatNamesText").textContent,initialNameExplanation,"name analysis responds to a different name");
  assert.ok(get("compatOverallScore").textContent.endsWith("/100"),"overall compatibility index is labelled as a symbolic score");
  const scoreIds = [...dims];
  const scoresBeforeSwap = scoreIds.map((id) => get(id).textContent);
  const a = {name:get("compatNameA").value, birth:get("compatBirthA").value, gender:get("compatGenderA").value};
  const b = {name:get("compatNameB").value, birth:get("compatBirthB").value, gender:get("compatGenderB").value};
  get("compatNameA").value = b.name;
  get("compatBirthA").value = b.birth;
  get("compatGenderA").value = b.gender;
  get("compatNameB").value = a.name;
  get("compatBirthB").value = a.birth;
  get("compatGenderB").value = a.gender;
  get("compatibilityForm").listeners.submit({preventDefault() {}});
  assert.deepEqual(scoreIds.map((id) => get(id).textContent),scoresBeforeSwap,"pair compatibility scores are symmetric when participant order is swapped");
  assert.ok(get("compatSignPair").textContent.includes("женщина"),"participant gender is shown as a label");

  console.log("PASS: ephemeris loads; forecast periods and alternate readings vary; basic compatibility is symmetric and updates for a different partner.");
})().catch((error) => { console.error(error); process.exitCode = 1; });
