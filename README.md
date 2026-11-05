# Český Film

Statyczna strona restauracji i pubu „Český Film” w Łodzi, przy ul. Ks. Biskupa Wincentego Tymienieckiego 25a.

## Zasady projektu

- `site/` jest jedynym źródłem publikowanej strony.
- Nie ma procesu buildowania ani frameworka aplikacyjnego.
- Nie edytuj kopii w `workspace/hosting/ted-hosting/public/`; jest generowana podczas publikacji.
- Przed publikacją sprawdź stronę lokalnie na desktopie i telefonie.
- Zmiany wizualne powinny być świadome: refaktor plików nie powinien zmieniać wyglądu.

## Struktura

```text
site/
├── index.html                 # struktura strony, treść sekcji i SEO
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

`index.html` zawiera canonical, podstawowe Open Graph/Twitter Cards oraz JSON-LD typu `Restaurant`. `robots.txt` wskazuje `sitemap.xml`. Aktualny przełącznik PL/EN działa na tej samej stronie; nie dodawaj `hreflang`, dopóki wersje językowe nie otrzymają osobnych, stabilnych adresów.

Przed publikacją należy potwierdzić z właścicielem aktualne godziny otwarcia i dane kontaktowe. Godziny w JSON-LD muszą być zgodne z widoczną treścią strony i wizytówką Google.

## Publikacja

Publikacja jest osobną, świadomą czynnością i nie odbywa się automatycznie. Źródłem prawdy jest repozytorium; hosting kopiuje folder `site/`:

```bash
"${TED_DIRECTORY}/shared/tools/firebase-publish.sh" site cesky-film
```

Adres docelowy: `https://ted-hosting.web.app/cesky-film/`.
