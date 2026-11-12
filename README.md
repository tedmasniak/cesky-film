# Český Film

Statyczna strona restauracji i pubu „Český Film” w Łodzi, przy ul. Ks. Biskupa Wincentego Tymienieckiego 25a.

- Repozytorium: https://github.com/tedmasniak/cesky-film (prywatne).
- Panel treści i backend: https://github.com/tedmasniak/client-cms.
- Hosting docelowy: MyDevil. Pipeline i podpięcie konta: [mydevil-deployment.md](mydevil-deployment.md).

## Struktura

```text
content/cesky-film.json   # treść edytowana w panelu CMS (menu, teksty, kontakt, godziny, SEO)
images/                   # zdjęcia z panelu
site/                     # szablon strony: HTML, CSS, JS, fonty, grafiki
├── index.html            # wersja polska
├── en/index.html         # wersja angielska pod /en/
└── assets/js/
    ├── menu-data.js      # dane karty; w dist/ generowane z content/
    ├── menu-renderer.js  # renderowanie kart (w buildzie i w przeglądarce)
    ├── navigation.js     # język, navbar, zakładki, menu mobilne
    └── film-strip.js     # klisze ze zdjęciami
scripts/build.mjs         # build: site/ + content/ + images/ → dist/
scripts/pages.mjs         # wpisywanie treści z CMS do HTML i prerender menu
scripts/deploy.sh         # wysyłka dist/ na MyDevil
.github/workflows/deploy.yml
tests/                    # testy buildu
test/mydevil-sim/         # atrapa MyDevil (Docker) i test e2e deployu
```

## Treść i build

Treść zmienia się w panelu, nie w `site/`. Panel commituje `content/cesky-film.json` i `images/`; push na `main` buduje i wdraża stronę.

Build wpisuje do HTML-a wszystkie pola z panelu. Elementy w `site/` powiązane z polem CMS mają atrybut `data-cms="<id pola>"`; kontakt i godziny są podmieniane po wartościach. Karta dań i napojów jest renderowana do HTML-a, więc jest widoczna dla wyszukiwarek bez JS.

Przy zmianach w `site/`:

- nie usuwać `data-cms` ani kontenerów `#menuTabs`, `#menuPanels`, `#drinkTabs`, `#drinkPanels`;
- teksty tłumaczone mają `data-en` (oraz `data-en-aria-label`, `data-en-alt`, `data-en-title`);
- nowe pole edytowalne wymaga zmiany w schemacie panelu (client-cms) i `data-cms` w obu wersjach językowych; test „every CMS text field has a marked element” to pilnuje.

```sh
npm test          # testy buildu
npm run build     # dist/
npm run preview   # build + http://127.0.0.1:8000/
```

Podgląd tylko przez serwer HTTP, nie z `file://`.

## SEO i adresy

`index.html` i `en/index.html` mają własne canonical, Open Graph/Twitter Cards, JSON-LD `Restaurant` (telefon, adres i godziny z CMS) oraz wzajemne `hreflang`. Polska wersja pod `/`, angielska pod `/en/`. `robots.txt` wskazuje `sitemap.xml`.

## Podgląd na ted-hosting

Na prośbę można wrzucić stronę na `https://ted-hosting.web.app/cesky-film/` przez `shared/tools/firebase-publish.sh dist cesky-film` (po `npm run build`; publikować `dist/`, nie `site/`). Nie edytować kopii w `workspace/hosting/ted-hosting/public/`.
