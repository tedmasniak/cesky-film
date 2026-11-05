// Zdjęcia w kliszach między sekcjami; każda klisza ma inną kolejność
      (() => {
        const KLATKI_ZDJECIA = [1, 2, 3, 4, 5, 6, 7].map((n) => `${window.SITE_ASSET_ROOT || "./assets"}/img/klisza-0${n}.jpg`);
        const KOLEJNOSCI = [
          [0, 1, 2, 3, 4, 5, 6],
          [3, 6, 1, 5, 0, 2, 4],
          [5, 2, 6, 0, 3, 4, 1],
          [1, 4, 0, 6, 2, 3, 5],
          [6, 3, 5, 1, 4, 0, 2],
          [2, 0, 4, 5, 1, 6, 3],
          [4, 5, 3, 2, 6, 1, 0],
        ];
        const LICZBA_KLATEK = 40; // 40 × 120 px = 4800 px szerokości
        document.querySelectorAll(".film-divider").forEach((divider, d) => {
          const kolejnosc = KOLEJNOSCI[d % KOLEJNOSCI.length];
          for (let i = 0; i < LICZBA_KLATEK; i++) {
            const frame = document.createElement("span");
            frame.className = "film-frame";
            frame.style.left = `calc(${i * 120 + 5} * var(--u))`;
            frame.style.backgroundImage = `url("${KLATKI_ZDJECIA[kolejnosc[i % kolejnosc.length]]}")`;
            divider.appendChild(frame);
          }
        });
      })();
