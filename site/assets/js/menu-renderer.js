function renderCards(lang) {
        const en = lang === "en";
        const t = UI_TEXT[lang];
        const escapeHtml = (text) =>
          String(text).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
        const pick = (item, field) => (en && item[field + "En"] !== undefined ? item[field + "En"] : item[field]);
        const nameOf = (dish) => (en && dish.en ? dish.en : dish.nazwa);

        function icon(name, label, colorClass) {
          return `
                    <span class="inline-flex shrink-0" title="${label}">
                      <svg class="h-5 w-5 ${colorClass}" fill="none" stroke="currentColor" stroke-width="1.8" role="img" aria-label="${label}">
                        <use href="#icon-${name}"></use>
                      </svg>
                    </span>`;
        }

        function photo(dish) {
          const name = escapeHtml(nameOf(dish));
          return `
                    <span class="dish-photo">
                      <button type="button" class="dish-photo-button" aria-label="${t.photo}: ${name}">
                        <svg fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                          <use href="#icon-camera"></use>
                        </svg>
                      </button>
                      <span class="dish-photo-preview" aria-hidden="true">
                        <img src="${escapeHtml(dish.zdjecie)}" alt="${name}" loading="lazy" decoding="async" />
                      </span>
                    </span>`;
        }

        function description(dish) {
          const parts = [];
          const ingredients = pick(dish, "skladniki");
          if (ingredients && ingredients.length) {
            const text = ingredients.join(", ");
            parts.push(text.charAt(0).toUpperCase() + text.slice(1) + ".");
          }
          const notes = pick(dish, "uwagi");
          if (notes) parts.push(notes);
          return parts.length ? `<p class="mt-2 text-sm leading-6 text-[#A0A0A0]">${escapeHtml(parts.join(" "))}</p>` : "";
        }

        function dishHtml(dish) {
          if (dish.naglowek) {
            return `
              <h3 class="seasonal-section border-b border-[#333333] pb-2 pt-4 text-xs font-bold uppercase tracking-[0.24em] text-[#A0A0A0] md:col-span-2" data-subcategory="${escapeHtml(pick(dish, "naglowek"))}">${escapeHtml(pick(dish, "naglowek"))}</h3>`;
          }
          const hasIcons = dish.wege || dish.ostre;
          const name = escapeHtml(nameOf(dish));
          const course = pick(dish, "rodzaj");
          const title = hasIcons
            ? `<h3 class="flex flex-wrap items-center gap-2 text-lg font-bold text-pearl">
                    <span>${name}</span>${dish.wege ? icon("leaf", t.wegeLabel, "text-brass") : ""}${
                dish.ostre ? icon("chili", t.ostreLabel, "text-[#9E3D2A]") : ""
              }${dish.zdjecie ? photo(dish) : ""}
                  </h3>`
            : `<h3 class="text-lg font-bold text-pearl">
                    ${name}${dish.zdjecie ? photo(dish) : ""}
                  </h3>`;
          return `
              <article>
                ${course ? `<p class="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">${escapeHtml(course)}</p>` : ""}
                <div class="flex items-end gap-3">
                  ${title}
                  <span class="mb-1 flex-grow border-b border-dotted border-gray-600"></span>
                  <p class="shrink-0 text-lg font-bold text-copper">${escapeHtml(pick(dish, "cena"))}</p>
                </div>
                ${description(dish)}
              </article>`;
        }

        CARDS.forEach((card) => {
          document.getElementById(card.tabs).innerHTML = card.data
            .map(
              (category) => `
            <button
              class="${category.id === card.active ? tabClassActive : tabClassIdle}"
              type="button"
              data-target="${category.id}"
              role="tab"
              aria-selected="${category.id === card.active}"
              aria-controls="${card.prefix}${category.id}"
            >
              ${escapeHtml(pick(category, "kategoria"))}
            </button>`
            )
            .join("");

          document.getElementById(card.panels).innerHTML = card.data
            .map((category) => {
              const note = pick(category, "uwagi");
              return `
            <div id="${card.prefix}${category.id}" class="tab-panel ${category.id === card.active ? "grid" : "hidden"} ${category.id === "sezonowe" ? "seasonal-panel" : ""} grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2" data-panel="${category.id}" role="tabpanel">
              ${note ? `<p class="text-sm text-[#A0A0A0] md:col-span-2">${escapeHtml(note)}</p>` : ""}
              ${category.dania.map(dishHtml).join("")}
            </div>`;
            })
            .join("");
        });

        document.querySelectorAll("[data-i18n]").forEach((el) => {
          el.textContent = t[el.dataset.i18n];
        });
        document.querySelectorAll(".lang-btn").forEach((button) => {
          button.setAttribute("aria-pressed", String(button.dataset.lang === lang));
        });
      }

      // Tłumaczenie całej strony: tekst angielski w atrybucie data-en (innerHTML),
      // atrybuty w data-en-aria-label / data-en-alt / data-en-title.
      const PAGE_META = {
        pl: { title: document.title, description: document.querySelector('meta[name="description"]').content },
        en: { title: "“Český Film” | Restaurant & Pub in Łódź", description: "“Český Film” – a Czech restaurant and pub in the historic heart of Łódź." },
      };
      const I18N_ATTRS = ["aria-label", "alt", "title"];

      function setLang(lang) {
        const en = lang === "en";
        document.querySelectorAll("[data-en]").forEach((el) => {
          if (el.dataset.pl === undefined) el.dataset.pl = el.innerHTML;
          el.innerHTML = en ? el.dataset.en : el.dataset.pl;
        });
        I18N_ATTRS.forEach((name) => {
          document.querySelectorAll(`[data-en-${name}]`).forEach((el) => {
            const store = `data-pl-${name}`;
            if (!el.hasAttribute(store)) el.setAttribute(store, el.getAttribute(name));
            el.setAttribute(name, el.getAttribute(en ? `data-en-${name}` : store));
          });
        });
        document.querySelectorAll("[data-more]").forEach((button) => {
          const expanded = button.getAttribute("aria-expanded") === "true";
          button.textContent = expanded ? (en ? "Show less" : "Zwiń") : en ? "Read more" : "Czytaj więcej";
        });
        document.documentElement.lang = lang;
        document.title = PAGE_META[lang].title;
        document.querySelector('meta[name="description"]').content = PAGE_META[lang].description;
        renderCards(lang);
        try {
          localStorage.setItem("ceskyFilmLang", lang);
        } catch (error) {}
      }

      const urlLang = new URLSearchParams(location.search).get("lang");
      let savedLang = null;
      try {
        savedLang = localStorage.getItem("ceskyFilmLang");
      } catch (error) {}
      setLang(urlLang === "en" || urlLang === "pl" ? urlLang : savedLang === "en" ? "en" : "pl");
