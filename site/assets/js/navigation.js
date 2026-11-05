const navbar = document.getElementById("navbar");
      const menuButton = document.getElementById("menuButton");
      const mobileMenu = document.getElementById("mobileMenu");
      const mobileLinks = mobileMenu.querySelectorAll("a");

      function updateNavbar() {
        navbar.classList.toggle("nav-scrolled", window.scrollY > 24);
      }

      // Telefon i tablet: navbar chowa się po 3 s bez przewijania, wraca przy przewinięciu
      const mobileNav = window.matchMedia("(max-width: 1023px)");
      let navIdleTimer;

      function showNavbar() {
        navbar.classList.remove("nav-hidden");
        clearTimeout(navIdleTimer);
        navIdleTimer = setTimeout(() => {
          const menuOpen = !mobileMenu.classList.contains("hidden");
          if (mobileNav.matches && window.scrollY > 24 && !menuOpen) {
            navbar.classList.add("nav-hidden");
          }
        }, 3000);
      }

      window.addEventListener("scroll", showNavbar, { passive: true });
      mobileNav.addEventListener("change", showNavbar);
      showNavbar();

      function closeMobileMenu() {
        mobileMenu.classList.add("hidden");
        menuButton.setAttribute("aria-expanded", "false");
      }

      function activateTab(tab) {
        const target = tab.dataset.target;
        const card = CARDS.find((item) => item.tabs === tab.parentElement.id);
        const tabPanels = document.getElementById(card.panels).querySelectorAll(".tab-panel");
        card.active = target;

        tab.parentElement.querySelectorAll(".menu-tab").forEach((button) => {
          button.classList.remove("border-copper", "text-brass");
          button.classList.add("border-transparent", "text-[#A0A0A0]");
          button.setAttribute("aria-selected", "false");
        });

        tab.classList.add("border-copper", "text-brass");
        tab.classList.remove("border-transparent", "text-[#A0A0A0]");
        tab.setAttribute("aria-selected", "true");

        tabPanels.forEach((panel) => {
          const isActive = panel.dataset.panel === target;
          panel.classList.toggle("hidden", !isActive);
          panel.classList.toggle("grid", isActive);

          if (isActive) {
            panel.style.animation = "none";
            panel.offsetHeight;
            panel.style.animation = "";
          }
        });
      }

      function closeDishPhotos() {
        document.querySelectorAll(".dish-photo").forEach((photo) => {
          photo.classList.remove("is-open");
          photo.querySelector(".dish-photo-button").blur();
        });
      }

      function scrollToSectionSmooth(id) {
        const target = document.getElementById(id);
        if (!target) return;

        const start = window.scrollY;
        const end = target.getBoundingClientRect().top + start;
        const distance = end - start;
        const duration = 950;
        const startTime = performance.now();

        function animate(now) {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);

          window.scrollTo(0, start + distance * eased);

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        }

        requestAnimationFrame(animate);
      }

      document.querySelectorAll("[data-more]").forEach((button) => {
        button.addEventListener("click", () => {
          const section = button.closest(".m-collapsible");
          const expanded = section.classList.toggle("is-expanded");
          button.setAttribute("aria-expanded", String(expanded));
          const en = document.documentElement.lang === "en";
          button.textContent = expanded ? (en ? "Show less" : "Zwiń") : en ? "Read more" : "Czytaj więcej";
          if (!expanded) section.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });

      window.addEventListener("scroll", updateNavbar, { passive: true });
      window.addEventListener("load", updateNavbar);

      menuButton.addEventListener("click", () => {
        const isOpen = !mobileMenu.classList.contains("hidden");
        mobileMenu.classList.toggle("hidden");
        showNavbar();
        menuButton.setAttribute("aria-expanded", String(!isOpen));
      });

      mobileLinks.forEach((link) => {
        link.addEventListener("click", closeMobileMenu);
      });

      // Zakładki i zdjęcia dań są generowane na nowo przy zmianie języka,
      // dlatego kliknięcia obsługuje jeden nasłuchiwacz na dokumencie.
      document.addEventListener("click", (event) => {
        const tab = event.target.closest(".menu-tab");
        if (tab) activateTab(tab);

        const langButton = event.target.closest(".lang-btn");
        if (langButton) {
          switchLanguage(langButton.dataset.lang);
        }

        const photoButton = event.target.closest(".dish-photo-button");
        if (photoButton) {
          const photo = photoButton.closest(".dish-photo");
          const isOpen = photo.classList.contains("is-open");
          closeDishPhotos();
          photo.classList.toggle("is-open", !isOpen);
          return;
        }

        closeDishPhotos();
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          closeDishPhotos();
        }
      });
