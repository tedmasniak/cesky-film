import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import vm from "node:vm";
import { siteItem, siteMenu, sitePath, menuDataSource, categoryId } from "../scripts/build.mjs";

const root = new URL("../", import.meta.url).pathname;
const content = JSON.parse(readFileSync(path.join(root, "content/cesky-film.json"), "utf8"));

function loadMenu(file) {
  const source = readFileSync(file, "utf8");
  const ctx = {};
  vm.runInNewContext(source.slice(0, source.indexOf("const UI_TEXT")) + ";this.MENU=MENU;this.NAPOJE=NAPOJE;", ctx);
  return ctx;
}

test("image paths map from CMS images/ to site assets/img/ and reject anything else", () => {
  assert.equal(sitePath("./images/zdjecie-01.jpg"), "./assets/img/zdjecie-01.jpg");
  assert.equal(sitePath(""), "");
  assert.throws(() => sitePath("../etc/passwd"));
  assert.throws(() => sitePath("data:image/png;base64,AAAA"));
});

test("seasonal category keeps the id the site CSS depends on", () => {
  assert.equal(categoryId("food-menu-sezonowe", "food"), "sezonowe");
  assert.equal(categoryId("drink-wódki", "drinks"), "wodki");
});

test("items map to the site renderer format; hidden items are left out", () => {
  const dish = siteItem({
    kind: "item", name: "Zupa", nameEn: "Soup", originalName: "", description: "a, b",
    descriptionEn: "", notes: "", notesEn: "", course: "", courseEn: "", price: "20 zł",
    priceEn: "", vegetarian: true, spicy: false, image: "./images/x.jpg", visible: true,
  });
  assert.deepEqual(dish, { nazwa: "Zupa", en: "Soup", skladniki: ["a, b"], cena: "20 zł", wege: true, zdjecie: "./assets/img/x.jpg" });
  const doc = structuredClone(content);
  doc.menus.food.categories[0].items[0].visible = false;
  assert.equal(siteMenu(doc, "food")[0].dania.length, content.menus.food.categories[0].items.length - 1);
});

test("generated menu-data.js runs and contains the CMS content", () => {
  const template = readFileSync(path.join(root, "site/assets/js/menu-data.js"), "utf8");
  const doc = structuredClone(content);
  doc.menus.food.categories[0].items[0].name = "Test z panelu";
  const out = path.join(mkdtempSync(path.join(tmpdir(), "menu-")), "menu-data.js");
  require_write(out, menuDataSource(doc, template));
  const { MENU, NAPOJE } = loadMenu(out);
  assert.equal(MENU[0].dania[0].nazwa, "Test z panelu");
  assert.equal(MENU.length, content.menus.food.categories.length);
  assert.equal(NAPOJE.length, content.menus.drinks.categories.length);
  assert.match(readFileSync(out, "utf8"), /const UI_TEXT/);
});

test("full build produces a complete static site", () => {
  const out = mkdtempSync(path.join(tmpdir(), "site-"));
  execFileSync(process.execPath, [path.join(root, "scripts/build.mjs"), "--out", out], { env: { ...process.env, BUILD_COMMIT: "abc" } });
  for (const file of ["index.html", "en/index.html", "robots.txt", "sitemap.xml", "assets/js/menu-data.js", "assets/css/site.css", "build.json"])
    assert.ok(existsSync(path.join(out, file)), file);
  assert.equal(JSON.parse(readFileSync(path.join(out, "build.json"), "utf8")).commit, "abc");
  for (const media of content.media)
    if (media.path.startsWith("./images/"))
      assert.ok(existsSync(path.join(out, sitePath(media.path))), media.path);
});

import { writeFileSync as require_write } from "node:fs";
