# Český Film

Strona restauracji i pubu Český Film w Łodzi (ul. Tymienieckiego 25a).

Statyczna strona bez kroku budowania: zmiany wprowadza się bezpośrednio
w `site/index.html`. Tailwind działa z lokalnego Play CDN
(`site/assets/js/tailwind.js`).

## Struktura

```
site/
  index.html
  favicon.jpg
  assets/
    css/fonts.css
    fonts/       Playfair Display, Cormorant Garamond, Montserrat
    img/         zdjęcia dań i wnętrza
    js/tailwind.js
```

## Podgląd lokalny

```
python3 -m http.server -d site 8000
```

## Deploy

Źródłem prawdy jest to repo. Hosting kopiuje folder `site/`:

```
"${TED_DIRECTORY}/shared/tools/firebase-publish.sh" site cesky-film
```

Adres: https://ted-hosting.web.app/cesky-film/
