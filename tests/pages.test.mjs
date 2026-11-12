import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { renderPage, applyFields, applyContact, groupHours, SITE_CONTACT } from "../scripts/pages.mjs";
import { menuDataSource } from "../scripts/build.mjs";

const root = new URL("../", import.meta.url).pathname;
const read = (file) => readFileSync(path.join(root, file), "utf8");
const content = JSON.parse(read("content/cesky-film.json"));
const pages = { pl: read("site/index.html"), en: read("site/en/index.html") };
const scriptsFor = (doc) => ({
  menuDataJs: menuDataSource(doc, read("site/assets/js/menu-data.js")),
  rendererJs: read("site/assets/js/menu-renderer.js"),
});
const withoutScripts = (html) => html.replace(/<script[\s\S]*?<\/script>/g, "");
const field = (doc, id) => doc.pages.flatMap((p) => p.fields).find((f) => f.id === id);

test("every CMS text field has a marked element on both pages", () => {
  const ids = content.pages.filter((p) => p.id !== "seo").flatMap((p) => p.fields).filter((f) => f.type !== "image").map((f) => f.id);
  for (const [lang, html] of Object.entries(pages))
    for (const id of ids) assert.ok(html.includes('data-cms="' + id + '"'), lang + " " + id);
});

test("site/ still contains the contact values the build replaces", () => {
  for (const value of Object.values(SITE_CONTACT)) assert.ok(pages.pl.includes(value), value);
  for (const key of Object.keys(SITE_CONTACT)) assert.equal(content.contact[key], SITE_CONTACT[key], key);
});

test("unchanged content leaves the hand-made markup untouched", () => {
  for (const [lang, html] of Object.entries(pages))
    assert.equal(applyContact(applyFields(html, content, lang), content.contact, lang), html, lang);
});

test("edited texts, contact and hours reach both pages", () => {
  const doc = structuredClone(content);
  Object.assign(field(doc, "about-0"), { value: "O RESTAURACJI", valueEn: "ABOUT THE RESTAURANT" });
  field(doc, "voucher-1").value = "Nowy tekst <b>vouchera</b>";
  doc.contact.phone = "+48 600 100 200";
  doc.contact.hours[6] = { ...doc.contact.hours[6], closed: true };
  const pl = renderPage(pages.pl, doc, "pl", scriptsFor(doc));
  const en = renderPage(pages.en, doc, "en", scriptsFor(doc));
  assert.match(pl, />O RESTAURACJI</);
  assert.match(pl, /data-en="ABOUT THE RESTAURANT"/);
  assert.match(en, />ABOUT THE RESTAURANT</);
  assert.match(pl, /Nowy tekst &lt;b&gt;vouchera&lt;\/b&gt;/);
  assert.ok(pl.includes('href="tel:+48600100200"') && !pl.includes("881 403 888"));
  assert.match(pl, /<dt[^>]*>Niedziela<\/dt>\s*<dd[^>]*>Nieczynne<\/dd>/);
  assert.match(en, /<dt[^>]*>Sunday<\/dt>\s*<dd[^>]*>Closed<\/dd>/);
  assert.ok(!/"Sunday"/.test(pl.match(/application\/ld\+json">([\s\S]*?)<\/script>/)[1]));
});

test("menu is in the HTML without JavaScript, in the page language", () => {
  const doc = structuredClone(content);
  const dish = doc.menus.food.categories[1].items.find((i) => i.kind === "item");
  Object.assign(dish, { name: "Zupa z panelu", nameEn: "Soup from the panel", price: "99 zł" });
  const pl = withoutScripts(renderPage(pages.pl, doc, "pl", scriptsFor(doc)));
  const en = withoutScripts(renderPage(pages.en, doc, "en", scriptsFor(doc)));
  assert.match(pl, /Zupa z panelu/);
  assert.match(pl, /99 zł/);
  assert.match(en, /Soup from the panel/);
  const items = (scope) => doc.menus[scope].categories.flatMap((c) => c.items).filter((i) => i.kind === "item" && i.visible !== false).length;
  assert.equal(pl.match(/<article>/g).length, items("food") + items("drinks"));
  assert.match(pl, /id="menuTabs"[^>]*>\s*<button/);
  assert.match(en, /src="\.\.\/assets\/img\//);
});

test("hours are grouped like the hand-made page", () => {
  assert.deepEqual(groupHours(content.contact.hours).map((g) => g.days.length), [4, 2, 1]);
});
