# Testy publikacji MyDevil

Stan 2026-11-10: repo zawiera stronę i źródło treści CMS. Nie ma jeszcze ukończonego pipeline'u Astro ani deploymentu na MyDevil. Zapis w panelu tworzy commit, nie publikuje strony.

## Bez konta MyDevil

Możemy przygotować i zweryfikować generowanie kompletnego HTML PL/EN, obecność cen/opisów bez wykonywania JS, lokalne linki i obrazy, workflow GitHub Actions, paczkę publicznych plików oraz wysyłkę i rollback na własnym testowym serwerze SSH/SFTP. Test na własnym serwerze sprawdza mechanizm transferu, nie konfigurację konkretnego dostawcy.

## Wymaga konta lub dostępu testowego MyDevil

Połączenie z ich hostem, fingerprint SSH, ograniczenia konta, katalog domeny, uprawnienia, obsługa symlinków/atomowego przełączenia, cache, HTTPS, domena i rzeczywista odpowiedź HTTP. Nie deklarujemy zgodności 100% bez wykonania końcowego wdrożenia testowego.

MyDevil dokumentuje SSH/SFTP oraz NGiNX. Build Astro może działać w GitHub Actions, więc Node nie musi działać na hostingu strony.

## Konto testowe i koszty

Publiczny regulamin w sekcji Hosting pkt 14 dopuszcza testowy dostęp z czasem określanym indywidualnie przez dostawcę. Nie jest to obietnica bezpłatnego triala ani automatycznego przydzielenia konta. Warto zapytać pomoc@mydevil.net o dostęp testowy SSH/SFTP. Nie zamówiono ani nie opłacono hostingu.

Źródła:

- https://pomoc.mydevil.net/SFTP/
- https://pomoc.mydevil.net/Strona_WWW/
- https://www.mydevil.net/nasza-oferta/
- https://www.mydevil.net/dokumenty/regulamin-korzystania-z-uslug-mydevil-net/
