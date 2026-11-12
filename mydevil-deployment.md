# Deployment na MyDevil

Strona jest statyczna. Build robi GitHub Actions, na MyDevil trafiają gotowe pliki przez SSH. Na hostingu nie jest potrzebny Node, PHP ani baza.

## Jak to działa

1. Panel CMS (repo `tedmasniak/client-cms`) zapisuje treść do `content/cesky-film.json` i zdjęcia do `images/`, jednym commitem na `main`. Commit robi GitHub App `ted-client-cms`.
2. Push na `main` uruchamia `.github/workflows/deploy.yml`: `npm test`, potem `node scripts/build.mjs`.
3. Build bierze `site/` jako szablon i wypluwa `dist/`:
   - teksty sekcji, kontakt, godziny, SEO i zdjęcie hero z JSON-a wpisuje w `index.html` i `en/index.html` (elementy oznaczone `data-cms="<id pola>"`, logika w `scripts/pages.mjs`);
   - kartę dań i napojów renderuje do HTML-a tym samym rendererem co przeglądarka, więc menu jest w źródle strony bez JS (SEO); JS dalej obsługuje zakładki;
   - generuje `assets/js/menu-data.js`, kopiuje `images/` do `assets/img/`, zapisuje `build.json` z SHA commita.
4. `scripts/deploy.sh` wysyła `dist/` rsynciem do `/usr/home/LOGIN/domains/DOMENA/public_html`:
   - sprawdza klucz hosta (`StrictHostKeyChecking=yes`), loguje się tylko kluczem;
   - `--delete-after --delay-updates`: nowe pliki podmieniane na końcu, stare usuwane;
   - zastąpione pliki trafiają do `domains/DOMENA/deploy-backups/<czas>/` (5 ostatnich);
   - nie rusza `.well-known/` i `errors/`;
   - na końcu `devil www options DOMENA cache purge`.
5. Workflow pobiera `SITE_URL/build.json` i failuje, jeśli strona nie serwuje właśnie wdrożonego commita.

Panel pokazuje status tego workflow (`GET /api/deploy`); do tego GitHub App ma uprawnienie **Actions: read**.

Bez konfiguracji (poniżej) workflow tylko testuje i buduje, deploy pomija z komunikatem `Deploy skipped`.

## Podpięcie konta MyDevil

Na koncie:

1. Dodać stronę `ceskyfilm.pl` w DevilWEB (typ PHP lub statyczna). Katalog `domains/ceskyfilm.pl/` musi istnieć, skrypt go nie zakłada.
2. Zrobić kopię obecnego WordPressa z `public_html/` (pierwszy deploy usunie z niego wszystko, czego nie ma w `dist/`).
3. Wygenerować klucz tylko do deployu: `ssh-keygen -t ed25519 -N '' -f mydevil-deploy`, publiczny dopisać do `~/.ssh/authorized_keys`.
4. Pobrać klucz hosta: `ssh-keyscan -t ed25519 sXX.mydevil.net` i porównać fingerprint z https://pomoc.mydevil.net/Fingerprint/ .

W GitHubie: Settings → Environments → `mydevil`. Repo jest publiczne, więc logi Actions też: host, login i ścieżka są sekretami, żeby GitHub je maskował.

| Nazwa | Typ | Wartość |
|---|---|---|
| `MYDEVIL_HOST` | secret | serwer SSH konta, np. `s67.mydevil.net` |
| `MYDEVIL_LOGIN` | secret | login konta |
| `MYDEVIL_DOMAIN` | variable | `ceskyfilm.pl` |
| `SITE_URL` | variable | `https://ceskyfilm.pl` |
| `MYDEVIL_SSH_KEY` | secret | prywatny klucz z pkt 3 |
| `MYDEVIL_KNOWN_HOSTS` | secret | linia z pkt 4 |
| `MYDEVIL_PATH` | secret, opcjonalnie | inny katalog niż `public_html` |
| `MYDEVIL_METHOD` | variable, opcjonalnie | `sftp`, jeśli na koncie nie ma rsync |
| `MYDEVIL_PURGE_CACHE` | variable, opcjonalnie | `0` wyłącza czyszczenie cache |

Pierwsze uruchomienie najlepiej ręcznie: Actions → deploy → Run workflow z `dry_run` (pokaże listę zmian, nic nie wyśle), potem bez.

Rollback: pliki sprzed deployu leżą w `deploy-backups/<czas>/` — skopiować je z powrotem do `public_html/`. Albo revert commita w repo, co uruchomi deploy poprzedniej wersji.

Deploy ręcznie z własnej maszyny:

```sh
npm test && node scripts/build.mjs
DEPLOY_HOST=s67.mydevil.net DEPLOY_LOGIN=<login> DEPLOY_DOMAIN=ceskyfilm.pl \
DEPLOY_KEY_FILE=./mydevil-deploy DEPLOY_KNOWN_HOSTS=./known_hosts \
DEPLOY_PURGE_CACHE=1 bash scripts/deploy.sh      # DEPLOY_DRY_RUN=1 = tylko podgląd
```

## Skąd te założenia

- Ścieżka `/usr/home/LOGIN/domains/DOMENA/public_html`, SSH/SFTP na porcie 22, klucze w `~/.ssh/authorized_keys`, `devil www options … cache purge`: dokumentacja https://pomoc.mydevil.net (Strona_WWW, SFTP, Logowanie, Fingerprint).
- `ceskyfilm.pl` stoi dziś na `web67.mydevil.net`; `s67.mydevil.net` odpowiada OpenSSH na FreeBSD, przyjmuje klucze, fingerprint zgodny z dokumentacją (sprawdzone z zewnątrz 2026-11-11). Właściwy host i login potwierdzi administrator konta.
- rsync + `devil` podejrzane w https://github.com/piotrczarnecki01/mydevil-deploy (gałąź `develop`). Celowo nie skopiowaliśmy stamtąd `StrictHostKeyChecking=no`.

## Testy na atrapie MyDevil

`test/mydevil-sim/` to kontener Docker: Debian, OpenSSH tylko z kluczem, NGINX serwujący `/usr/home/ceskyfilm/domains/ceskyfilm.pl/public_html`, atrapa `devil` zapisująca wywołania do logu.

```sh
test/mydevil-sim/run-e2e.sh          # scripts/deploy.sh bezpośrednio
test/mydevil-sim/run-e2e.sh --act    # prawdziwy deploy.yml przez nektos/act
```

Sprawdza: odrzucenie złego klucza hosta i logowania bez klucza, pliki w docroot, odpowiedź HTTP, zachowanie `.well-known`, wywołanie purge cache, potem zmianę w `content/cesky-film.json` (jak commit z panelu) i drugi deploy: zmiana widoczna przez HTTP, także w statycznym `index.html`, usunięte stare pliki, backup poprzedniej wersji. Oba tryby przechodzą (ostatnio 2026-11-12).

Czego atrapa nie sprawdza: FreeBSD zamiast Debiana, prawdziwy `devil` i jego cache, rsync po stronie MyDevil (fallback `sftp` nie był testowany), 2FA na koncie (zablokowałoby klucz w CI), uprawnienia katalogów, HTTPS. To trzeba zweryfikować przy pierwszym deployu na prawdziwe konto.
