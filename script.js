(() => {
"use strict";

const $ = (id) => document.getElementById(id);
const zodiac = [
  {key:"aries", name:"Овен", symbol:"♈", element:"Огонь", core:"тебе легче двигаться, когда есть ясная цель", strength:"инициатива", challenge:"не торопить ответ"},
  {key:"taurus", name:"Телец", symbol:"♉", element:"Земля", core:"устойчивость приходит через простые, повторяемые действия", strength:"надёжность", challenge:"не цепляться за привычное"},
  {key:"gemini", name:"Близнецы", symbol:"♊", element:"Воздух", core:"любопытство помогает увидеть больше одного решения", strength:"гибкость мышления", challenge:"не распылять внимание"},
  {key:"cancer", name:"Рак", symbol:"♋", element:"Вода", core:"чувство безопасности помогает тебе раскрыться", strength:"чуткость", challenge:"не принимать всё слишком близко"},
  {key:"leo", name:"Лев", symbol:"♌", element:"Огонь", core:"твой свет заметнее, когда ты действуешь от сердца", strength:"творческая смелость", challenge:"оставлять место чужому мнению"},
  {key:"virgo", name:"Дева", symbol:"♍", element:"Земля", core:"ясность появляется, когда ты превращаешь детали в систему", strength:"внимательность", challenge:"не требовать идеала"},
  {key:"libra", name:"Весы", symbol:"♎", element:"Воздух", core:"равновесие рождается из честного диалога, а не из уступок любой ценой", strength:"дипломатичность", challenge:"не откладывать собственный выбор"},
  {key:"scorpio", name:"Скорпион", symbol:"♏", element:"Вода", core:"глубина и честность помогают отделить главное от внешнего шума", strength:"проницательность", challenge:"не пытаться контролировать всё"},
  {key:"sagittarius", name:"Стрелец", symbol:"♐", element:"Огонь", core:"смысл и перспектива возвращают тебе энергию движения", strength:"оптимизм", challenge:"доводить начатое до конца"},
  {key:"capricorn", name:"Козерог", symbol:"♑", element:"Земля", core:"долгосрочный результат строится из последовательных шагов", strength:"выдержка", challenge:"не превращать ответственность в перегрузку"},
  {key:"aquarius", name:"Водолей", symbol:"♒", element:"Воздух", core:"нестандартный взгляд помогает увидеть выход за пределами привычного", strength:"оригинальность", challenge:"сохранять связь с реальностью"},
  {key:"pisces", name:"Рыбы", symbol:"♓", element:"Вода", core:"воображение становится опорой, когда ты соединяешь его с границами", strength:"сочувствие", challenge:"не путать интуицию с тревогой"}
];
const signsByKey = Object.fromEntries(zodiac.map((s) => [s.key, s]));
const signIndex = (key) => zodiac.findIndex((s) => s.key === key);
const labels = {day:"ПРОГНОЗ НА ДЕНЬ", week:"ПРОГНОЗ НА НЕДЕЛЮ", month:"ПРОГНОЗ НА МЕСЯЦ", year:"ПРОГНОЗ НА ГОД"};
const symbols = {Sun:"☉",Moon:"☾",Mercury:"☿",Venus:"♀",Mars:"♂",Jupiter:"♃",Saturn:"♄",Uranus:"♅",Neptune:"♆",Pluto:"♇"};
const planetNames = {Sun:"Солнце",Moon:"Луна",Mercury:"Меркурий",Venus:"Венера",Mars:"Марс",Jupiter:"Юпитер",Saturn:"Сатурн",Uranus:"Уран",Neptune:"Нептун",Pluto:"Плутон"};
const planetTopics = {
  Sun:"личные цели, самоощущение и видимость",
  Moon:"эмоциональный ритм, привычки и потребность в отдыхе",
  Mercury:"разговоры, обучение, документы и способы принимать решения",
  Venus:"отношения, симпатии, удовольствие и личные ценности",
  Mars:"инициатива, энергия, границы и способ действовать",
  Jupiter:"рост, возможности, обучение и расширение горизонтов",
  Saturn:"обязательства, дисциплина, сроки и прочность планов",
  Uranus:"перемены, самостоятельность и поиск новых решений",
  Neptune:"воображение, идеалы и умение различать надежду и факт",
  Pluto:"глубинные изменения, контроль и освобождение от старых сценариев"
};
const elements = {
  "Огонь":{tone:"смелый импульс",love:"говори прямо, но оставляй пространство для ответа",work:"сделай первый шаг и проверь идею действием",money:"перед покупкой отдели азарт от реальной потребности",balance:"помоги энергии выйти через движение и короткие задачи"},
  "Земля":{tone:"практичный подход",love:"покажи заботу конкретным поступком",work:"разбей большую задачу на измеримые этапы",money:"сверь цифры и укрепи финансовую опору",balance:"вернись к режиму, телу и простым ритуалам"},
  "Воздух":{tone:"обмен идеями",love:"уточни смысл слов вместо того, чтобы додумывать",work:"запиши идеи и выбери одну для проверки",money:"сравни варианты и условия прежде, чем решать",balance:"разгрузи голову прогулкой или сменой занятия"},
  "Вода":{tone:"чуткость и наблюдение",love:"назови чувство спокойно, не ожидая чтения мыслей",work:"учти человеческий фактор и не игнорируй детали",money:"принимай решения после паузы, а не на эмоциях",balance:"оставь время на тишину и восстановление"}
};
const houses = [
  {topic:"личной инициативы",love:"покажи себя без игры в угадайку и не бери всю ответственность за контакт на себя",work:"обозначь главную цель и сделай шаг, который зависит только от тебя",money:"оцени собственные приоритеты и не покупай одобрение",balance:"начни с базовых потребностей и не требуй от себя идеального темпа"},
  {topic:"личных ресурсов и денег",love:"обсуждай ожидания и вклад прямо, не превращая заботу в бухгалтерию",work:"оцени стоимость своего времени и не обесценивай результат",money:"пересмотри регулярные расходы и выбери одну полезную финансовую привычку",balance:"поддержи себя сном, едой и предсказуемым распорядком"},
  {topic:"общения и обучения",love:"вопрос, заданный с интересом, полезнее предположений",work:"уточни задачу, договорённость или документ до того, как двигаться дальше",money:"сравни условия, комиссии и мелкий шрифт",balance:"короткая прогулка или заметки помогут упорядочить мысли"},
  {topic:"дома и внутренней опоры",love:"домашний уют и честный разговор создадут больше близости, чем эффектный жест",work:"позаботься о рабочем пространстве и не бери на себя чужой хаос",money:"проверь расходы на дом и оставь небольшой запас на непредвиденное",balance:"снизь внешний шум и вернись к тому, что даёт чувство устойчивости"},
  {topic:"радости, романтики и творчества",love:"оставь место лёгкости и взаимной инициативе",work:"предложи нестандартное решение и покажи черновик вместо ожидания идеала",money:"планируй развлечения заранее, чтобы удовольствие не оборачивалось сожалением",balance:"выбери занятие, которое возвращает интерес, а не требует результата"},
  {topic:"рутины и повседневных привычек",love:"маленькая регулярная забота важнее редких громких обещаний",work:"убери одно узкое место в процессе и обозначь реалистичный срок",money:"проверь регулярные платежи и автоматические списания",balance:"сократи перегрузку и выстрой режим, который реально выдержать"},
  {topic:"партнёрств и договорённостей",love:"ищи взаимность: твои желания и желания другого человека одинаково важны",work:"закрепи договорённости письменно и заранее проясни зоны ответственности",money:"перед общими тратами согласуй правила и пределы",balance:"попроси поддержку там, где она действительно нужна"},
  {topic:"доверия и общих ресурсов",love:"говори о сложном бережно, не испытывая другого догадками",work:"проясни обязательства, зависимости и условия совместной работы",money:"внимательно раздели личные и общие деньги, долги и риски",balance:"не пытайся контролировать то, на что у тебя нет влияния"},
  {topic:"обучения и расширения горизонтов",love:"совместный интерес или новый опыт добавит отношениям воздуха",work:"изучи подход, который может повысить квалификацию или открыть другой путь",money:"проверяй обещания быстрой выгоды и изучай условия до оплаты",balance:"смена обстановки или новая тема поможет выйти из привычного круга"},
  {topic:"карьеры и долгосрочных целей",love:"не позволяй делам полностью вытеснить личное внимание",work:"выбери критерий успеха и покажи конкретный результат",money:"свяжи финансовый шаг с долгосрочным планом, а не с импульсом",balance:"распредели нагрузку и не измеряй ценность только продуктивностью"},
  {topic:"друзей и будущих планов",love:"общие интересы и дружеская открытость укрепят контакт",work:"поговори с людьми из смежной сферы и поделись задумкой",money:"полезный совет стоит проверить независимо, прежде чем ему следовать",balance:"не сравнивай свой путь с чужой витриной достижений"},
  {topic:"отдыха и завершения старого",love:"пауза может прояснить чувства, если не превращать молчание в наказание",work:"заверши фоновые задачи и оставь время на восстановление",money:"не принимай решение из усталости; вернись к цифрам позже",balance:"позволь себе отдых без необходимости его заслуживать"}
];
const phaseNames = ["новолуние","растущий серп","первая четверть","растущая Луна","полнолуние","убывающая Луна","последняя четверть","убывающий серп"];
const phaseTexts = [
  "время символически обозначить намерение и не требовать мгновенного результата",
  "идею полезно поддержать небольшими регулярными действиями",
  "период, чтобы выбрать приоритет и проверить его первым шагом",
  "подходящее время заметить прогресс и скорректировать темп",
  "повод увидеть, что созрело, и честно оценить результат",
  "проверь, что уже работает, и освободи место от лишнего",
  "полезно пересмотреть план и отказаться от того, что перестало служить цели",
  "лучше завершать, упрощать и беречь силы перед новым циклом"
];
const periodTitles = {
  day:["Ритм сегодняшнего дня","Точка ясности","Маленький поворот","День осознанного выбора","Новый ракурс","Твоя опора сегодня","Тихий сигнал","Проверка приоритетов","Энергия момента","Пространство для шага","День внимательности","Импульс к обновлению"],
  week:["Главная тема недели","Неделя последовательных шагов","Разговор, который многое прояснит","Неделя практических решений","Баланс между планом и гибкостью","Вектор ближайших дней","Неделя пересмотра приоритетов","Новые связи и идеи","Неделя укрепления опоры","Время проверить направление","Неделя осознанных границ","Постепенное движение вперёд"],
  month:["Ключевой сюжет месяца","Месяц роста и настройки","На что стоит направить силы","Месяц полезных пересмотров","Новый слой возможностей","Месяц прочного фундамента","Фокус на важных связях","Месяц личной ясности","Поворот к долгосрочной цели","Месяц разумного расширения","Время укрепить позиции","Месяц освобождения места"],
  year:["Большая тема года","Год последовательного роста","Курс на устойчивые результаты","Год новых ориентиров","Твоя долгосрочная опора","Год пересборки приоритетов","Вектор развития","Год опыта и мастерства","Долгий путь к ясности","Год новых связей и идей","Год осознанных перемен","Время укрепить фундамент"]
};
const periodOpeners = {
  day:["Сегодня полезно начать не с скорости, а с понимания, что действительно важно.","Фокус дня — увидеть разницу между срочным и значимым.","Попробуй действовать чуть осознаннее привычного: даже небольшой выбор задаёт тон.","День лучше раскрывается через один ясный шаг, чем через десять обещаний себе.","Наблюдай за деталями и проверяй впечатления фактами.","Сегодня можно освободить место для нового, сначала завершив один старый вопрос.","Собери внимание вокруг того, на что реально можешь повлиять.","Сделай пространство для спокойного решения: пауза тоже может быть действием."],
  week:["На этой неделе важнее выбранный курс, чем идеальное расписание.","Ближайшие дни подходят для практической проверки одной значимой идеи.","Неделя просит сочетать открытость с ясными личными границами.","Выигрышная стратегия — меньше распыления, больше последовательности.","Смотри на события в динамике: не всякая задержка означает отказ.","На этой неделе полезно закрепить договорённости и проверить ожидания.","Оставь место незапланированному, но не отдавай ему все свои ресурсы.","Неделя может стать продуктивнее, если измерять прогресс действиями, а не тревогой."],
  month:["В течение месяца смотри не только на отдельные события, но и на повторяющиеся закономерности.","Месячный фокус — укрепить то, что поддержит тебя дольше одного дня.","Выбери направление, которое можно проверить небольшими шагами в течение ближайших недель.","Этот период полезно использовать для настройки привычек, договорённостей и планов.","Месяц — достаточно длинный горизонт, чтобы заметить прогресс, но не забыть о гибкости.","Начни с ревизии: что стоит продолжить, что изменить, а что отпустить.","Для устойчивого результата раздели большой замысел на этапы и обозначь реалистичные сроки.","В ближайшие недели качество выбора важнее количества открытых задач."],
  year:["Годовой прогноз лучше воспринимать как карту тем для размышления, а не как фиксированный сценарий.","Большие изменения складываются из решений, которые ты повторяешь регулярно.","На длинной дистанции особенно важны прочная основа, гибкость и способность учиться.","Смотри на год как на пространство для выбора курса, а не как на список неизбежных событий.","Твоя долгосрочная стратегия должна учитывать и амбиции, и восстановление.","Год может стать полезным поводом пересмотреть цели и оставить только действительно значимые.","Планируй этапами и разрешай себе менять тактику, когда появляются новые факты.","На большой дистанции последовательность часто полезнее редких рывков."]
};
const aspectData = [
  {angle:0,name:"соединение",orb:5,meaning:"тема усиливается и просит сознательного направления энергии",advice:"сформулируй намерение и выбери один конкретный шаг"},
  {angle:60,name:"секстиль",orb:4,meaning:"возможность может раскрыться через инициативу и сотрудничество",advice:"заметь открывшуюся возможность и проверь её небольшим действием"},
  {angle:90,name:"квадрат",orb:5,meaning:"напряжение подсвечивает место, где нужна корректировка или граница",advice:"не отвечай импульсивно: разложи задачу на части и действуй по очереди"},
  {angle:120,name:"трин",orb:5,meaning:"символически поддерживает естественный ход дел и использование уже освоенных навыков",advice:"опирайся на то, что у тебя уже получается, и развивай это"},
  {angle:180,name:"оппозиция",orb:5,meaning:"просит соединить две разные потребности и найти более честный баланс",advice:"проверь обе стороны ситуации и не своди её к выбору из двух крайностей"}
];
const bodyOrbit = ["Moon","Mercury","Venus","Mars","Jupiter","Saturn","Uranus","Neptune","Pluto"];
const focusByPeriod = {
  day:["Moon","Mercury","Venus","Mars"],
  week:["Mercury","Venus","Mars","Jupiter"],
  month:["Venus","Mars","Jupiter","Saturn","Mercury"],
  year:["Jupiter","Saturn","Uranus","Neptune","Pluto"]
};
const colors = ["Аметист","Сапфир","Лунный серебристый","Индиго","Лавандовый","Бирюзовый","Звёздный белый","Ночной синий","Розовый кварц","Изумрудный"];
const keywords = ["Возможность","Равновесие","Смелость","Ясность","Доверие","Обновление","Рост","Гармония","Открытие","Терпение","Взаимность","Фокус"];
const advice = ["Доверься себе, но проверь факты","Не спеши с выводами","Сделай первый шаг","Оставь место отдыху","Уточни детали","Спроси, если не уверен","Отмечай реальный прогресс","Выбирай осознанно","Сохрани любопытство","Береги личные границы","Сверься с долгосрочной целью","Упрости следующий шаг"];

let selected = "";
let profile = null;
let active = "day";
let scanTimeout;
const variations = {day:0,week:0,month:0,year:0};

function hash(value) {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) { h ^= value.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function pick(array, seed, salt) { return array[(seed + (salt || 0)) % array.length]; }
function normAngle(a) { return ((a % 360) + 360) % 360; }
function signedAngle(a) { return ((a + 540) % 360) - 180; }
function getSunSign(longitude) { return zodiac[Math.floor(normAngle(longitude) / 30)]; }
function signIndexForLongitude(longitude) { return Math.floor(normAngle(longitude) / 30); }

function periodDate(period) {
  const d = new Date();
  d.setHours(12,0,0,0);
  if (period === "week") d.setDate(d.getDate() + 3);
  if (period === "month") d.setDate(d.getDate() + 15);
  if (period === "year") d.setDate(d.getDate() + 183);
  return d;
}
function periodStamp(period, date) {
  if (period === "day") return date.getFullYear()+"-"+String(date.getMonth()+1).padStart(2,"0")+"-"+String(date.getDate()).padStart(2,"0");
  if (period === "month") return date.getFullYear()+"-"+String(date.getMonth()+1).padStart(2,"0");
  if (period === "year") return String(date.getFullYear());
  const utc = new Date(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate()));
  utc.setUTCDate(utc.getUTCDate()+4-(utc.getUTCDay()||7));
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(),0,1));
  const week = Math.ceil((((utc-yearStart)/86400000)+1)/7);
  return utc.getUTCFullYear()+"-W"+String(week).padStart(2,"0");
}
function formatDate(date) { return date.toLocaleDateString("ru-RU",{day:"numeric",month:"long",year:"numeric"}); }

function zodiacFromDate(value) {
  if (!value) return "";
  const d = new Date(value + "T12:00:00Z"), m = d.getUTCMonth()+1, day = d.getUTCDate();
  if ((m===3&&day>=21)||(m===4&&day<=19)) return "aries";
  if ((m===4&&day>=20)||(m===5&&day<=20)) return "taurus";
  if ((m===5&&day>=21)||(m===6&&day<=20)) return "gemini";
  if ((m===6&&day>=21)||(m===7&&day<=22)) return "cancer";
  if ((m===7&&day>=23)||(m===8&&day<=22)) return "leo";
  if ((m===8&&day>=23)||(m===9&&day<=22)) return "virgo";
  if ((m===9&&day>=23)||(m===10&&day<=22)) return "libra";
  if ((m===10&&day>=23)||(m===11&&day<=21)) return "scorpio";
  if ((m===11&&day>=22)||(m===12&&day<=21)) return "sagittarius";
  if ((m===12&&day>=22)||(m===1&&day<=19)) return "capricorn";
  if ((m===1&&day>=20)||(m===2&&day<=18)) return "aquarius";
  return "pisces";
}
function displayBirthDate(value) { return new Date(value+"T12:00:00").toLocaleDateString("ru-RU",{day:"numeric",month:"long",year:"numeric"}); }
function toast(message) {
  const el = $("toast");
  el.textContent = message;
  el.classList.add("visible");
  setTimeout(() => el.classList.remove("visible"), 3000);
}
function chooseSign(key) {
  if (!signsByKey[key]) return;
  selected = key;
  document.querySelectorAll(".zodiac-option").forEach((button) => {
    const isSelected = button.dataset.zodiac === key;
    button.classList.toggle("selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });
}
function scanner() {
  const overlay = $("scannerOverlay");
  overlay.classList.add("active");
  overlay.setAttribute("aria-hidden","false");
  return new Promise((resolve) => {
    clearTimeout(scanTimeout);
    scanTimeout = setTimeout(() => {
      overlay.classList.remove("active");
      overlay.setAttribute("aria-hidden","true");
      resolve();
    }, 900);
  });
}
function saveProfile() {
  try { localStorage.setItem("cosmicOracleProfile",JSON.stringify(profile)); } catch (error) { /* private browsing may block storage */ }
}

function longitudeOf(body, date) {
  const A = window.Astronomy;
  if (!A) return null;
  if (body === "Sun") {
    const p = A.SunPosition(date);
    return normAngle(p.elon);
  }
  if (body === "Moon") {
    const p = A.EclipticGeoMoon(date);
    return normAngle(p.lon);
  }
  const vector = A.GeoVector(A.Body[body], date, true);
  return normAngle(A.Ecliptic(vector).elon);
}
function getSky(date) {
  const sky = {};
  try {
    if (!window.Astronomy) throw new Error("Astronomy Engine not loaded");
    const nowDate = new Date(date.getTime());
    for (const body of ["Sun",...bodyOrbit]) {
      const longitude = longitudeOf(body,nowDate);
      const sign = getSunSign(longitude);
      sky[body] = {longitude,sign:sign.key,signName:sign.name,signIndex:signIndexForLongitude(longitude),element:sign.element};
    }
    sky.Moon.phase = normAngle(window.Astronomy.MoonPhase(nowDate));
    sky.Moon.phaseIndex = Math.floor((sky.Moon.phase+22.5)/45)%8;
    sky.Moon.phaseName = phaseNames[sky.Moon.phaseIndex];
    sky.Moon.phaseText = phaseTexts[sky.Moon.phaseIndex];
    for (const body of ["Mercury","Venus","Mars","Jupiter","Saturn","Uranus","Neptune","Pluto"]) {
      const days = ["Jupiter","Saturn","Uranus","Neptune","Pluto"].includes(body) ? 5 : 2;
      const later = new Date(nowDate.getTime()+days*86400000);
      const delta = signedAngle(longitudeOf(body,later)-sky[body].longitude);
      sky[body].retrograde = delta < -0.025;
    }
    sky.calculated = true;
    return sky;
  } catch (error) {
    return fallbackSky(date);
  }
}
function fallbackSky(date) {
  const dayNumber = Math.floor(date.getTime()/86400000);
  const fallback = {};
  const speeds = {Sun:0.9856,Moon:13.176,Mercury:4.1,Venus:1.6,Mars:0.52,Jupiter:0.083,Saturn:0.034,Uranus:0.012,Neptune:0.006,Pluto:0.004};
  const epochs = {Sun:280.46,Moon:218.3,Mercury:252.3,Venus:181.9,Mars:355.4,Jupiter:34.4,Saturn:50.1,Uranus:314.1,Neptune:304.3,Pluto:238.9};
  for (const body of ["Sun",...bodyOrbit]) {
    const longitude = normAngle(epochs[body]+speeds[body]*(dayNumber-10957));
    const sign = getSunSign(longitude);
    fallback[body] = {longitude,sign:sign.key,signName:sign.name,signIndex:signIndexForLongitude(longitude),element:sign.element,retrograde:false};
  }
  fallback.Moon.phase = normAngle((dayNumber*12.19075)%360);
  fallback.Moon.phaseIndex = Math.floor((fallback.Moon.phase+22.5)/45)%8;
  fallback.Moon.phaseName = phaseNames[fallback.Moon.phaseIndex];
  fallback.Moon.phaseText = phaseTexts[fallback.Moon.phaseIndex];
  fallback.calculated = false;
  return fallback;
}
function natalSunLongitude() {
  const birth = new Date(profile.birthDate+"T12:00:00Z");
  let longitude = null;
  try { longitude = longitudeOf("Sun",birth); } catch (error) { longitude = null; }
  const expected = signIndex(profile.zodiac);
  if (longitude === null || signIndexForLongitude(longitude) !== expected) longitude = expected*30+15;
  return longitude;
}
function aspectsToNatalSun(sky) {
  const natal = natalSunLongitude();
  const found = [];
  for (const body of bodyOrbit) {
    const difference = Math.abs(signedAngle(sky[body].longitude-natal));
    let nearest = null;
    for (const aspect of aspectData) {
      const orb = Math.abs(difference-aspect.angle);
      const allowed = aspect.angle === 60 ? 4 : (body === "Moon" ? 3.5 : aspect.orb);
      if (orb <= allowed && (!nearest || orb < nearest.orb)) nearest = {...aspect,orb};
    }
    if (nearest) found.push({body,...nearest});
  }
  return found.sort((a,b) => a.orb-b.orb);
}
function solarHouse(natalSignKey, transitSignIndex) {
  return ((transitSignIndex-signIndex(natalSignKey)+12)%12)+1;
}
function primaryAspectFor(body, aspects) { return aspects.find((a) => a.body === body) || null; }

function render(period) {
  if (!profile) return;
  active = period;
  const date = periodDate(period);
  const stamp = periodStamp(period,date);
  const variation = variations[period] || 0;
  const seed = hash(profile.name.toLocaleLowerCase("ru-RU")+"|"+profile.birthDate+"|"+profile.zodiac+"|"+period+"|"+stamp+"|"+variation);
  const sky = getSky(date);
  const natalIdx = signIndex(profile.zodiac);
  const focusPlanet = pick(focusByPeriod[period],seed,variation*7);
  const focus = sky[focusPlanet];
  const houseNo = solarHouse(profile.zodiac,focus.signIndex);
  const house = houses[houseNo-1];
  const primaryAspect = primaryAspectFor(focusPlanet,aspectsToNatalSun(sky));
  const signProfile = signsByKey[profile.zodiac];
  const planetLabel = planetNames[focusPlanet];
  const elementText = elements[focus.element];
  const opener = pick(periodOpeners[period],seed,variation*3);
  const title = pick(periodTitles[period],seed,variation*5);

  let text = opener+" "+signProfile.name+": "+signProfile.core+". ";
  text += planetLabel+" в знаке "+focus.signName+" символически выделяет "+planetTopics[focusPlanet]+". ";
  text += "В упрощённой солнечной карте это связано с темой "+house.topic+": "+house.work+". ";
  text += "Лунный фон — "+sky.Moon.phaseName+"; "+sky.Moon.phaseText+". ";
  if (primaryAspect) text += "Аспект "+planetLabel+" — "+primaryAspect.name+" к Солнцу вашей даты рождения: "+primaryAspect.meaning+".";
  else text += "Главная настройка периода — "+elementText.tone+": "+elementText.work+".";

  $("forecastPeriodLabel").textContent = labels[period];
  $("forecastSymbol").textContent = signProfile.symbol;
  $("forecastTitle").textContent = title;
  $("forecastText").textContent = text;
  const energy = ["Спокойная","Собранная","Подвижная","Чувствительная","Активная","Устойчивая","Переменчивая","Вдохновлённая"];
  $("energyValue").textContent = pick(energy,seed,variation*11);
  $("luckyNumber").textContent = String((seed+variation*7)%99+1);
  $("luckyColor").textContent = pick(colors,seed>>>3,variation*13);
  $("keywordValue").textContent = pick(keywords,seed>>>5,variation*17);
  $("adviceValue").textContent = primaryAspect ? primaryAspect.advice : pick(advice,seed>>>9,variation*19);

  const lovePlanet = sky.Venus;
  const workPlanet = (period === "year") ? sky.Saturn : (period === "month" ? sky.Jupiter : sky.Mercury);
  const moneyPlanet = sky.Jupiter;
  const moodPlanet = sky.Moon;
  const domains = [
    {id:"loveValue",name:"Венера",body:lovePlanet,field:"love"},
    {id:"workValue",name:planetNames[period === "year" ? "Saturn" : (period === "month" ? "Jupiter" : "Mercury")],body:workPlanet,field:"work"},
    {id:"moneyValue",name:"Юпитер",body:moneyPlanet,field:"money"},
    {id:"wellbeingValue",name:"Луна",body:moodPlanet,field:"balance"}
  ];
  for (const d of domains) {
    const houseNum = solarHouse(profile.zodiac,d.body.signIndex);
    const houseText = houses[houseNum-1][d.field];
    const elementAdvice = elements[d.body.element][d.field];
    const aspect = primaryAspectFor(d.field==="love"?"Venus":d.field==="work"?(period==="year"?"Saturn":period==="month"?"Jupiter":"Mercury"):d.field==="money"?"Jupiter":"Moon",aspectsToNatalSun(sky));
    const retro = d.body.retrograde ? " Поскольку в расчётную дату "+d.name+" ретрограден, перепроверь договорённости и оставь время на повторную проверку деталей." : "";
    $(d.id).textContent = planetNames[d.field==="love"?"Venus":d.field==="work"?(period==="year"?"Saturn":period==="month"?"Jupiter":"Mercury"):d.field==="money"?"Jupiter":"Moon"]+" в "+d.body.signName+" связывает сферу с темой "+houses[houseNum-1].topic+". "+houseText+". "+elementAdvice+"."+(aspect?" "+aspect.advice+".":"")+retro;
  }

  $("transitDate").textContent = formatDate(date);
  const bestAspects = aspectsToNatalSun(sky).slice(0,2);
  let skySummary = "Луна в "+sky.Moon.signName+", "+sky.Moon.phaseName+". В солнечной астрологической традиции это задаёт символический эмоциональный фон; трактовка не является проверяемым прогнозом событий.";
  if (bestAspects.length) {
    skySummary += " Ближайший аспект к солнечной точке рождения: "+bestAspects.map((a)=>planetNames[a.body]+" — "+a.name+" (орб "+a.orb.toFixed(1)+"°)").join("; ")+".";
  } else {
    skySummary += " Точного мажорного аспекта к солнечной точке рождения в принятых орбисах сейчас нет.";
  }
  $("transitSummary").textContent = skySummary;
  const chipBodies = ["Sun","Moon","Mercury","Venus","Mars","Jupiter","Saturn"];
  $("planetChips").replaceChildren(...chipBodies.map((body) => {
    const item = sky[body];
    const chip = document.createElement("span");
    chip.className = "planet-chip";
    chip.textContent = symbols[body]+" "+planetNames[body]+" · "+item.signName+(item.retrograde?" ℞":"");
    return chip;
  }));
  document.querySelectorAll(".forecast-tab").forEach((button) => {
    const isActive = button.dataset.period === period;
    button.classList.toggle("active",isActive);
    button.setAttribute("aria-selected",String(isActive));
  });
}
function showResult() {
  $("entryScreen").hidden = true;
  document.querySelectorAll(".ad-slot").forEach((slot) => slot.hidden = true);
  $("hero").hidden = true;
  $("resultScreen").hidden = false;
  $("resultName").textContent = profile.name;
  $("resultBirthInfo").textContent = displayBirthDate(profile.birthDate)+" · "+signsByKey[profile.zodiac].name;
  $("resultZodiacSymbol").textContent = signsByKey[profile.zodiac].symbol;
  render(active);
  window.scrollTo({top:0,behavior:"smooth"});
}
async function submit(event) {
  event.preventDefault();
  const name = $("userName").value.trim();
  const birthDate = $("birthDate").value;
  if (!name) { toast("Напиши своё имя, чтобы продолжить."); $("userName").focus(); return; }
  if (!birthDate) { toast("Укажи дату рождения."); $("birthDate").focus(); return; }
  if (new Date(birthDate+"T12:00:00Z") > new Date()) { toast("Проверь дату рождения."); return; }
  if (!selected) chooseSign(zodiacFromDate(birthDate));
  profile = {name,birthDate,zodiac:selected};
  for (const key of Object.keys(variations)) variations[key] = 0;
  saveProfile();
  await scanner();
  showResult();
}
function reset() {
  $("resultScreen").hidden = true;
  $("entryScreen").hidden = false;
  $("hero").hidden = false;
  document.querySelectorAll(".ad-slot").forEach((slot) => slot.hidden = false);
  window.scrollTo({top:0,behavior:"smooth"});
}
function setupParallax() {
  const art = $("cosmicArt");
  if (!art || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const fine = matchMedia("(pointer:fine)").matches;
  let tx=0,ty=0,x=0,y=0,raf=0;
  function draw() {
    x+=(tx-x)*.075; y+=(ty-y)*.075;
    const mobile=!fine, motion=Math.min(1,Math.hypot(x,y)/34);
    art.style.setProperty("--depth-blur",(motion*(mobile?.55:1.25)).toFixed(2)+"px");
    art.style.setProperty("--depth-brightness",(1+motion*(mobile?.05:.11)).toFixed(3));
    art.style.setProperty("--bg-x",(x*.45).toFixed(2)+"px"); art.style.setProperty("--bg-y",(y*.45).toFixed(2)+"px");
    art.style.setProperty("--nebula-x",(x*(mobile?.8:1.25)).toFixed(2)+"px"); art.style.setProperty("--nebula-y",(y*(mobile?.8:1.25)).toFixed(2)+"px");
    art.style.setProperty("--stars-x",(x*(mobile?1.25:1.8)).toFixed(2)+"px"); art.style.setProperty("--stars-y",(y*(mobile?1.25:1.8)).toFixed(2)+"px");
    art.style.setProperty("--orb-x",(x*(mobile?1.55:3.1)).toFixed(2)+"px"); art.style.setProperty("--orb-y",(y*(mobile?1.55:3.1)).toFixed(2)+"px");
    if (Math.abs(tx-x)>.04||Math.abs(ty-y)>.04) raf=requestAnimationFrame(draw); else raf=0;
  }
  function kick() { if(!raf) raf=requestAnimationFrame(draw); }
  if (fine) {
    window.addEventListener("pointermove",(event)=>{tx=(event.clientX/innerWidth-.5)*30;ty=(event.clientY/innerHeight-.5)*24;kick();},{passive:true});
    window.addEventListener("blur",()=>{tx=0;ty=0;kick();});
  }
  if ("DeviceOrientationEvent" in window) {
    const orient=(event)=>{const beta=Number(event.beta)||0,gamma=Number(event.gamma)||0;tx=Math.abs(gamma)<1.5?0:Math.max(-24,Math.min(24,gamma))*.72;ty=Math.abs(beta-45)<1.5?0:Math.max(-24,Math.min(24,beta-45))*.5;kick();};
    document.addEventListener("touchstart",async()=>{try{if(typeof DeviceOrientationEvent.requestPermission==="function"&&(await DeviceOrientationEvent.requestPermission())!=="granted")return;window.addEventListener("deviceorientation",orient,true);}catch(error){}},{once:true,passive:true});
  }
}
function setupTilt() {
  if (!matchMedia("(pointer:fine)").matches) return;
  document.querySelectorAll(".tilt-card").forEach((card)=> {
    card.addEventListener("pointermove",(event)=>{const rect=card.getBoundingClientRect(),px=(event.clientX-rect.left)/rect.width,py=(event.clientY-rect.top)/rect.height;card.style.transform="perspective(1000px) rotateX("+((.5-py)*2.2)+"deg) rotateY("+((px-.5)*2.5)+"deg) translateY(-1px)";},{passive:true});
    card.addEventListener("pointerleave",()=>{card.style.transform="";});
  });
}
function init() {
  document.querySelectorAll(".zodiac-option").forEach((button)=>button.addEventListener("click",()=>chooseSign(button.dataset.zodiac)));
  $("birthDate").max = new Date().toISOString().slice(0,10);
  $("birthDate").addEventListener("change",(event)=>chooseSign(zodiacFromDate(event.target.value)));
  $("profileForm").addEventListener("submit",submit);
  document.querySelectorAll(".forecast-tab").forEach((button)=>button.addEventListener("click",()=>render(button.dataset.period)));
  $("editProfile").addEventListener("click",()=>{reset();if(profile){$("userName").value=profile.name;$("birthDate").value=profile.birthDate;chooseSign(profile.zodiac);}});
  $("newForecast").addEventListener("click",()=>{variations[active]=(variations[active]+1)%97;render(active);});
  setupParallax(); setupTilt();
  try {
    const saved = JSON.parse(localStorage.getItem("cosmicOracleProfile")||"null");
    if (saved&&saved.name&&saved.birthDate&&signsByKey[saved.zodiac]) {
      profile=saved; $("userName").value=saved.name; $("birthDate").value=saved.birthDate; chooseSign(saved.zodiac);
    }
  } catch (error) { /* corrupt local data is ignored */ }
}
document.addEventListener("DOMContentLoaded",init);
})();