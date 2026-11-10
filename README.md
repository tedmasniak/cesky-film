# Český Film

Statyczna strona restauracji i pubu „Český Film” w Łodzi, przy ul. Ks. Biskupa Wincentego Tymienieckiego 25a.

## Zasady projektu

- Repozytorium: https://github.com/tedmasniak/cesky-film (prywatne).
- `site/` jest aktualną ręcznie przygotowaną stroną; jej wygląd nie został zmieniony podczas migracji repo.
- `content/cesky-film.json` i `images/` są źródłem treści i zdjęć zapisywanych przez CMS.
- Obecnie zapis CMS NIE regeneruje `site/`. Podłączenie generatora HTML (Astro) i publikacji na przycisk to następny etap.
- Panel i backend są oddzielnie: https://github.com/tedmasniak/client-cms.
- Repo połączono z dawnym `cesky-film-content` bez usuwania historii commitów bota i historii strony.
- Nie ma procesu buildowania ani frameworka aplikacyjnego.
- Nie edytuj kopii w `workspace/hosting/ted-hosting/public/`; jest generowana podczas publikacji.
- Przed publikacją sprawdź stronę lokalnie na desktopie i telefonie.
- Zmiany wizualne powinny być świadome: refaktor plików nie powinien zmieniać wyglądu.

## Struktura

```text
site/
├── index.html                 # polska strona, treść sekcji i SEO
├── en/index.html              # angielska wersja pod /en/
├── robots.txt
├── sitemap.xml
├── favicon.jpg
└── assets/
    ├── css/
    │   ├── fonts.css          # lokalne deklaracje fontów
    │   └── site.css           # własne style strony
    ├── fonts/                 # pliki fontów
    ├── img/                   # zdjęcia, logo i grafiki
    └── js/
        ├── tailwind.js        # lokalny Tailwind Play CDN
        ├── menu-data.js       # dane karty dań i napojów
        ├── menu-renderer.js   # renderowanie zakładek i pozycji karty
        ├── navigation.js      # język, navbar, menu mobilne i zdjęcia dań
        └── film-strip.js      # klisze ze zdjęciami między sekcjami
```

## Edycja treści

### Menu i napoje

Dane karty znajdują się w `site/assets/js/menu-data.js`. Nie trzeba zmieniać funkcji renderujących. Każda kategoria ma `id`, polskie `kategoria`, opcjonalne `kategoriaEn` oraz tablicę `dania`. Pozycja może zawierać między innymi:

- `nazwa` i `en` — nazwa po polsku i angielsku;
- `skladniki` i `skladnikiEn` — składniki;
- `cena`;
- `uwagi` i `uwagiEn`;
- `wege`, `ostre`;
- `zdjecie` — względna ścieżka do zdjęcia w `assets/img/`.

### Teksty strony

Treść sekcji znajduje się w `site/index.html`. Dla tekstów tłumaczonych należy zachować `data-en`. Atrybuty dostępności i opisy obrazów mają odpowiedniki `data-en-aria-label`, `data-en-alt` i `data-en-title`.

## Podgląd lokalny

W katalogu repozytorium uruchom:

```bash
python3 -m http.server -d site 8000
```

Następnie otwórz `http://127.0.0.1:8000/`. Strona używa lokalnych plików JavaScript i fontów, więc do poprawnego testu należy korzystać z serwera HTTP, a nie otwierać `index.html` bezpośrednio z dysku.

## SEO i adresy

`index.html` i `en/index.html` zawierają własne canonical, podstawowe Open Graph/Twitter Cards, JSON-LD typu `Restaurant` oraz wzajemne `hreflang`. Polska wersja jest pod `/`, angielska pod `/en/`; przełącznik języka prowadzi między tymi adresami. `robots.txt` wskazuje `sitemap.xml`, która zawiera oba adresy.

Przed publikacją należy potwierdzić z właścicielem aktualne godziny otwarcia i dane kontaktowe. Godziny w JSON-LD muszą być zgodne z widoczną treścią strony i wizytówką Google.

## Publikacja

Publikacja jest osobną, świadomą czynnością i nie odbywa się automatycznie. Źródłem prawdy jest repozytorium; hosting kopiuje folder `site/`:

```bash
"${TED_DIRECTORY}/shared/tools/firebase-publish.sh" site cesky-film
```

Adres docelowy: `https://ted-hosting.web.app/cesky-film/`.
