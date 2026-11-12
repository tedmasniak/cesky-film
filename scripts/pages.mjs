// Applies CMS content (content/cesky-film.json) to the hand-made pages in site/.
//
// site/ stays the template. Elements marked data-cms="<field id>" get the field
// text, contact data and opening hours are rewritten, and the food and drinks
// cards are prerendered with the site's own renderer, so the menu is in the HTML
// without JavaScript. Unchanged fields keep their original markup (e.g. <strong>).
import vm from "node:vm";

/** Contact values as written in site/. A test checks that site/ still contains them. */
export const SITE_CONTACT = {
  phone: "+48 881 403 888",
  managerPhone: "+48 537 471 950",
  email: "restauracja@ceskyfilm.pl",
  bookingUrl: "https://zjedz.my/cesky-film",
  facebook: "https://www.facebook.com/czeskyfilm/",
  instagram: "https://www.instagram.com/ceskyfilm/",
  mapsUrl: "https://www.google.com/maps?q=%C4%8Cesk%C3%BD%20Film%20%C5%81%C3%B3d%C5%BA%20Tymienieckiego",
};
export const SITE_HERO_IMAGE = "./images/lofty.jpg";
const SITE_URL = "https://ceskyfilm.pl";
const DAYS_EN = { mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday", sun: "Sunday" };

export const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const reEscape = (s) => s.replace(/[.*+?^$()|[\]\\{}]/g, "\\$&");

const decode = (html) =>
  html
    .replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");

/** Compares HTML with CMS plain text, ignoring markup and whitespace. */
export const sameText = (html, text) => {
  const norm = (s) => s.replace(/\s+/g, " ").replace(/ ([,.])/g, "$1").trim();
  return norm(decode(html)) === norm(String(text ?? ""));
};

const telHref = (phone) => "tel:" + phone.replace(/[^\d+]/g, "");
const replaceAll = (html, from, to) => (from === to ? html : html.split(from).join(to));
const heroField = (document) => document.pages.find((p) => p.id === "hero")?.fields.find((f) => f.id === "hero-image");

/** Replaces the text of every data-cms="<id>" element and its data-en twin. */
export function applyFields(html, document, lang) {
  const fields = new Map();
  for (const page of document.pages) for (const field of page.fields) fields.set(field.id, field);
  return html.replace(/<(\w+)\b([^>]*\sdata-cms="([\w-]+)"[^>]*)>([\s\S]*?)<\/\1>/g, (whole, tag, attrs, id, inner) => {
    const field = fields.get(id);
    if (!field) return whole;
    const text = lang === "en" ? field.valueEn : field.value;
    const body = sameText(inner, text) ? inner : escapeHtml(text);
    attrs = attrs.replace(/\sdata-en="([^"]*)"/, (attr, current) =>
      sameText(decode(current), field.valueEn) ? attr : ' data-en="' + escapeHtml(escapeHtml(field.valueEn)) + '"',
    );
    return "<" + tag + attrs + ">" + body + "</" + tag + ">";
  });
}

/** Groups consecutive days with the same hours. */
export function groupHours(hours) {
  const groups = [];
  for (const day of hours) {
    const last = groups.at(-1);
    const same = last && last.closed === day.closed && (day.closed || (last.open === day.open && last.close === day.close));
    if (same) last.days.push(day);
    else groups.push({ days: [day], open: day.open, close: day.close, closed: day.closed });
  }
  return groups;
}

function hoursHtml(hours, lang) {
  const label = (g, en) => {
    const name = (d) => (en ? DAYS_EN[d.id] || d.label : d.label);
    const first = g.days[0], last = g.days.at(-1);
    return first === last ? name(first) : name(first) + " – " + name(last);
  };
  const rows = groupHours(hours).map((g) => {
    const value = g.closed ? (lang === "en" ? "Closed" : "Nieczynne") : g.open + " – " + g.close;
    const ddEn = g.closed && lang !== "en" ? ' data-en="Closed"' : "";
    return (
      '                  <dt data-en="' + escapeHtml(escapeHtml(label(g, true))) + '">' + escapeHtml(label(g, lang === "en")) + "</dt>\n" +
      '                  <dd class="font-medium text-brass"' + ddEn + ">" + escapeHtml(value) + "</dd>"
    );
  });
  return "\n" + rows.join("\n") + "\n                ";
}

function applyJsonLd(html, contact, heroUrl) {
  return html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/, (whole, open, json, close) => {
    const data = JSON.parse(json);
    data.telephone = contact.phone;
    data.email = contact.email;
    data.image = heroUrl;
    data.sameAs = [contact.facebook, contact.instagram].filter(Boolean);
    const lines = contact.address.split("\n").map((l) => l.trim());
    const street = lines.find((l) => /^(ul\.|al\.|pl\.)/i.test(l));
    const city = lines.map((l) => /^(\d{2}-\d{3})\s+(.+)$/.exec(l)).find(Boolean);
    if (street) data.address.streetAddress = street;
    if (city) [data.address.postalCode, data.address.addressLocality] = [city[1], city[2]];
    data.openingHoursSpecification = groupHours(contact.hours)
      .filter((g) => !g.closed)
      .map((g) => {
        const days = g.days.map((d) => DAYS_EN[d.id]);
        return { "@type": "OpeningHoursSpecification", dayOfWeek: days.length === 1 ? days[0] : days, opens: g.open, closes: g.close };
      });
    return open + "\n      " + JSON.stringify(data, null, 2).replace(/\n/g, "\n      ") + "\n    " + close;
  });
}

export function applyContact(html, contact, lang) {
  const base = SITE_CONTACT;
  html = replaceAll(html, telHref(base.phone), telHref(contact.phone));
  html = replaceAll(html, telHref(base.managerPhone), telHref(contact.managerPhone));
  html = replaceAll(html, base.phone, escapeHtml(contact.phone));
  html = replaceAll(html, base.managerPhone, escapeHtml(contact.managerPhone));
  for (const key of ["email", "bookingUrl", "facebook", "instagram", "mapsUrl"]) html = replaceAll(html, base[key], escapeHtml(contact[key]));
  html = html.replace(/(<address\b[^>]*data-cms="contact\.address"[^>]*>)[\s\S]*?(<\/address>)/, (w, a, b) => a + escapeHtml(contact.address) + b);
  html = html.replace(/(<dl\b[^>]*data-cms="contact\.hours"[^>]*>)[\s\S]*?(<\/dl>)/, (w, a, b) => a + hoursHtml(contact.hours, lang) + b);
  return html;
}

/** SEO texts are stored as "og:title: ..."; they belong to the Polish page. */
function applySeo(html, document) {
  const seo = document.pages.find((p) => p.id === "seo");
  if (!seo) return html;
  const targets = { "seo-0": 'name="description"', "seo-1": 'property="og:title"', "seo-2": 'property="og:description"', "seo-3": 'name="twitter:title"', "seo-4": 'name="twitter:description"' };
  for (const field of seo.fields) {
    const selector = targets[field.id];
    const text = field.value.replace(/^[a-z:]+:\s*/i, "");
    if (!selector || !text) continue;
    html = html.replace(new RegExp("(<meta\\s+" + reEscape(selector) + '\\s+content=")[^"]*(")'), (w, a, b) => a + escapeHtml(text) + b);
  }
  return html;
}

function applyHero(html, document, root) {
  const field = heroField(document);
  if (!field || field.value === SITE_HERO_IMAGE) return html;
  const name = field.value.replace(/^\.\/images\//, "");
  const style =
    "background-image: linear-gradient(180deg, rgba(16, 12, 9, 0.66) 0%, rgba(16, 12, 9, 0.5) 45%, rgba(16, 12, 9, 0.8) 100%), url('" +
    root + "/assets/img/" + name + "')";
  html = html.replace('<div class="hero-photo"', '<div class="hero-photo" style="' + escapeHtml(style) + '"');
  return replaceAll(html, SITE_URL + "/assets/img/lofty.jpg", SITE_URL + "/assets/img/" + escapeHtml(name));
}

/** Runs the site's own menu renderer against a minimal DOM and returns the card HTML by element id. */
export function prerenderMenus(menuDataJs, rendererJs, lang) {
  const nodes = {};
  const document = {
    title: "",
    documentElement: {},
    getElementById: (id) => (nodes[id] ??= { innerHTML: "" }),
    querySelector: () => ({ content: "" }),
    querySelectorAll: () => [],
  };
  const path = lang === "en" ? "/en/" : "/";
  const context = {
    window: { SITE_ROOT: lang === "en" ? ".." : "." },
    document,
    location: { search: "", pathname: path, href: path },
    localStorage: { getItem: () => null, setItem() {} },
    URLSearchParams,
  };
  vm.runInNewContext(menuDataJs + "\n" + rendererJs, context, { timeout: 2000 });
  return Object.fromEntries(Object.entries(nodes).map(([id, n]) => [id, n.innerHTML]));
}

function insertMenus(html, cards) {
  for (const [id, inner] of Object.entries(cards)) {
    const re = new RegExp('(<div\\s+id="' + id + '"[^>]*>)\\s*(</div>)');
    if (!re.test(html)) throw new Error("Menu container #" + id + " not found");
    html = html.replace(re, (w, a, b) => a + inner + b);
  }
  return html;
}

/** Renders one page: "pl" for site/index.html, "en" for site/en/index.html. */
export function renderPage(template, document, lang, { menuDataJs, rendererJs }) {
  const root = lang === "en" ? ".." : ".";
  let html = applyFields(template, document, lang);
  html = applyContact(html, document.contact, lang);
  if (lang === "pl") html = applySeo(html, document);
  html = applyHero(html, document, root);
  const hero = (heroField(document)?.value || SITE_HERO_IMAGE).replace(/^\.\/images\//, "");
  html = applyJsonLd(html, document.contact, SITE_URL + "/assets/img/" + hero);
  return insertMenus(html, prerenderMenus(menuDataJs, rendererJs, lang));
}
