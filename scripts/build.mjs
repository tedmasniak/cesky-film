#!/usr/bin/env node
// Builds the publishable website into dist/.
//
//   node scripts/build.mjs [--out dist]
//
// 1. copies site/ (hand-made HTML, CSS, JS, fonts, images) unchanged;
// 2. regenerates the MENU and NAPOJE data in assets/js/menu-data.js from
//    content/cesky-film.json (the file the CMS edits); the rendering code and the
//    page design stay exactly as written in site/;
// 3. copies CMS images (images/) to assets/img/ so new uploads are published.
//
// No dependencies; Node.js 20+.
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const args = process.argv.slice(2);
const outIndex = args.indexOf("--out");
const outDir = path.resolve(root, outIndex >= 0 ? args[outIndex + 1] : "dist");
const contentFile = path.join(root, "content", "cesky-film.json");
const MENU_FILE = path.join("assets", "js", "menu-data.js");
const DATA_END = "const UI_TEXT";

/** ./images/x.jpg (CMS path) -> ./assets/img/x.jpg (site path). */
export function sitePath(image) {
  if (!image) return "";
  const match = /^\.\/images\/([A-Za-z0-9][\w-]{0,127}\.(?:jpe?g|png|webp|svg))$/i.exec(image);
  if (!match) throw new Error(`Unsupported image reference: ${image}`);
  return `./assets/img/${match[1]}`;
}

/** Category id used by the site renderer (CSS uses "sezonowe" for the seasonal tab). */
export function categoryId(id, scope) {
  const bare = String(id).replace(scope === "food" ? /^food-/ : /^drink-/, "");
  if (scope === "food" && /sezonowe/.test(bare)) return "sezonowe";
  const ascii = bare
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l")
    .replace(/[^a-zA-Z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  return ascii || "kategoria";
}

const optional = (target, key, value) => {
  if (value !== undefined && value !== null && value !== "" && value !== false)
    target[key] = value;
};

export function siteItem(item) {
  if (item.kind === "heading") {
    const heading = { naglowek: item.name };
    optional(heading, "naglowekEn", item.nameEn);
    return heading;
  }
  const dish = { nazwa: item.name };
  optional(dish, "en", item.nameEn);
  optional(dish, "nazwaCz", item.originalName);
  optional(dish, "rodzaj", item.course);
  optional(dish, "rodzajEn", item.courseEn);
  dish.skladniki = item.description ? [item.description] : [];
  if (item.descriptionEn) dish.skladnikiEn = [item.descriptionEn];
  optional(dish, "uwagi", item.notes);
  optional(dish, "uwagiEn", item.notesEn);
  dish.cena = item.price;
  optional(dish, "cenaEn", item.priceEn);
  optional(dish, "wege", item.vegetarian === true);
  optional(dish, "ostre", item.spicy === true);
  optional(dish, "zdjecie", sitePath(item.image));
  return dish;
}

export function siteMenu(document, scope) {
  const categories = document?.menus?.[scope]?.categories;
  if (!Array.isArray(categories)) throw new Error(`Missing menus.${scope}`);
  const used = new Set();
  return categories.map((category) => {
    let id = categoryId(category.id, scope);
    while (used.has(id)) id += "-2";
    used.add(id);
    const out = { id, kategoria: category.name };
    optional(out, "kategoriaEn", category.nameEn);
    optional(out, "uwagi", category.notes);
    optional(out, "uwagiEn", category.notesEn);
    out.dania = category.items.filter((item) => item.visible !== false).map(siteItem);
    return out;
  });
}

export function menuDataSource(document, template) {
  const end = template.indexOf(DATA_END);
  if (end < 0) throw new Error(`${MENU_FILE}: marker "${DATA_END}" not found`);
  const json = (value) => JSON.stringify(value, null, 2).replace(/\n/g, "\n      ");
  return (
    "      // WYGENEROWANE przez scripts/build.mjs z content/cesky-film.json — nie edytuj w dist/.\n" +
    `      const MENU = ${json(siteMenu(document, "food"))};\n\n` +
    `      const NAPOJE = ${json(siteMenu(document, "drinks"))};\n\n      ` +
    template.slice(end)
  );
}

async function main() {
  const document = JSON.parse(await readFile(contentFile, "utf8"));
  if (document.version !== 1) throw new Error("Unsupported content version");
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });
  await cp(path.join(root, "site"), outDir, { recursive: true });
  const imagesDir = path.join(root, "images");
  if (existsSync(imagesDir))
    for (const name of await readdir(imagesDir))
      await cp(path.join(imagesDir, name), path.join(outDir, "assets", "img", name));
  const template = await readFile(path.join(root, "site", MENU_FILE), "utf8");
  await writeFile(path.join(outDir, MENU_FILE), menuDataSource(document, template));
  // Every image the generated menu references must be published.
  for (const scope of ["food", "drinks"])
    for (const category of siteMenu(document, scope))
      for (const dish of category.dania)
        if (dish.zdjecie && !existsSync(path.join(outDir, dish.zdjecie)))
          throw new Error(`Missing image ${dish.zdjecie} for "${dish.nazwa}"`);
  await writeFile(
    path.join(outDir, "build.json"),
    JSON.stringify(
      {
        commit: process.env.BUILD_COMMIT || process.env.GITHUB_SHA || "local",
        builtAt: new Date().toISOString(),
      },
      null,
      2,
    ) + "\n",
  );
  console.log(`Built ${path.relative(root, outDir) || "."}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]))
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
