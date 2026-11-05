// KARTA DAŃ — edytuj tutaj. Zakładki i pozycje w sekcji #menu-glowne
      // generują się z tej listy (kolejność na stronie = kolejność w liście).
      // Pola dania:
      //   nazwa       — nazwa wyświetlana na stronie (PL)
      //   en          — nazwa w wersji angielskiej (przełącznik PL / EN)
      //   nazwaCz     — oryginalna nazwa z czeskiej karty (na stronie nie jest pokazywana)
      //   skladniki   — lista składników, na stronie łączona przecinkami
      //   skladnikiEn — lista składników po angielsku
      //   cena        — tekst ceny, np. "26 zł", "66 / 124 zł", "od 49 zł"
      //   uwagi       — opcjonalnie, tekst po składnikach (np. czas oczekiwania); uwagiEn po angielsku
      //   rodzaj      — opcjonalnie, mały napis nad nazwą (np. "Zupa"); rodzajEn po angielsku
      //   wege        — opcjonalnie true: ikona liścia
      //   ostre       — opcjonalnie true: ikona papryczki
      //   zdjecie     — opcjonalnie ścieżka do zdjęcia: przycisk z podglądem
      const MENU = [
        {
          id: "sezonowe",
          kategoria: "Menu sezonowe",
          kategoriaEn: "Seasonal menu",
          dania: [
            { rodzaj: "Aperitif", rodzajEn: "Aperitif", nazwa: "Jeleń biegający po rozmarynie", en: "Deer running through rosemary", skladniki: ["Jägermeister", "sok pomarańczowy", "syrop rozmarynowy", "sok z cytryny", "rozmaryn"], skladnikiEn: ["Jägermeister", "orange juice", "rosemary syrup", "lemon juice", "rosemary"], cena: "32 zł" },
            { rodzaj: "Przystawka", rodzajEn: "Starter", nazwa: "Tartaletka z borowikami i porto", en: "Tartlet with porcini mushrooms and port", skladniki: [], cena: "32 zł" },
            { rodzaj: "Zupa", rodzajEn: "Soup", nazwa: "Zalewajka łódzka", en: "Łódź-style sour rye soup (zalewajka)", skladniki: ["podgrzybki", "kiełbasa", "ziemniaki", "chleb żytni na naturalnym zakwasie"], skladnikiEn: ["bay bolete mushrooms", "sausage", "potatoes", "sourdough rye bread"], cena: "31 zł" },
            { rodzaj: "Danie główne", rodzajEn: "Main course", nazwa: "Kotlet mielony z jelenia i dzika", en: "Venison and wild boar patty", skladniki: ["demi glace z zielonym pieprzem", "konfitura z czerwonej cebuli", "purée ziemniaczane", "chips z dyni"], skladnikiEn: ["demi-glace with green pepper", "red onion jam", "mashed potatoes", "pumpkin chips"], cena: "59 zł" },
            { rodzaj: "Deser", rodzajEn: "Dessert", nazwa: "Fondant czekoladowy", en: "Chocolate fondant", skladniki: ["owoce leśne", "rozmaryn"], skladnikiEn: ["forest berries", "rosemary"], cena: "29 zł" },
          ],
        },
        {
          id: "przekaski",
          kategoria: "Przekąski i przystawki",
          kategoriaEn: "Snacks and starters",
          dania: [
            { nazwa: "Mięsa i wędliny z dziczyzny (dla 2 / 4 osób)", en: "Game meats and cold cuts (for 2 / 4 people)", nazwaCz: "Talíř mas a uzenin z diviny / výběr sýrů / kyselé okurky / džem – pro 2/4 osoby", skladniki: ["wybór serów", "pikle", "konfitury"], skladnikiEn: ["selection of cheeses", "pickles", "preserves"], cena: "66 / 124 zł" },
            { nazwa: "Czeski ser Hermelín", en: "Czech Hermelín cheese", nazwaCz: "Nakládaný hermelín / kysané zelí / pumpernikiel", skladniki: ["kiszona kapusta", "pumpernikiel"], skladnikiEn: ["sauerkraut", "pumpernickel"], cena: "29 zł", wege: true, zdjecie: "./assets/img/zdjecie-15.jpg" },
            { nazwa: "Ser ołomuniecki", en: "Olomouc cheese (Olomoucké tvarůžky)", nazwaCz: "Olomoucké tvarůžky / koření / česnek / topinky", skladniki: ["przyprawy", "czosnkowe grzanki", "piwo"], skladnikiEn: ["spices", "garlic toasts", "beer"], cena: "29 zł", wege: true },
            { nazwa: "Tatar z polędwicy wołowej", en: "Beef tenderloin tartare", nazwaCz: "Tatarák z hovězí svíčkové / cibule / nakládaná okurka / křepelčí vejce", skladniki: ["cebula", "ogórek kiszony", "pieczarki", "jajko przepiórcze"], skladnikiEn: ["onion", "pickled cucumber", "mushrooms", "quail egg"], cena: "48 zł", zdjecie: "./assets/img/zdjecie-19.jpg" },
            { nazwa: "Frytki chlebowe", en: "Bread fries", nazwaCz: "Křupavé topinky s česnekovo-sýrovým dipem", skladniki: ["dip serowo-czosnkowy"], skladnikiEn: ["cheese and garlic dip"], cena: "26 zł", wege: true, zdjecie: "./assets/img/zdjecie-24.jpg" },
            { nazwa: "Krążki cebulowe w panierce", en: "Breaded onion rings", nazwaCz: "Cibulové kroužky / tatarská omáčka", skladniki: ["sos tatarski"], skladnikiEn: ["tartar sauce"], cena: "26 zł", wege: true, zdjecie: "./assets/img/zdjecie-26.jpg" },
            { nazwa: "Ciepłe przekąski dla piwosza (dla 2 osób)", en: "Hot beer snacks (for 2 people)", nazwaCz: "Teplé občerstvení pro milovníky piva (pro 2 osoby)", skladniki: [], cena: "59 zł" },
          ],
        },
        {
          id: "zupy",
          kategoria: "Zupy",
          kategoriaEn: "Soups",
          dania: [
            { nazwa: "Krem ziemniaczany", en: "Potato cream soup", nazwaCz: "Bramborový krém se slaninovým chipsem a brynzou", skladniki: ["boczek", "ser bryndza"], skladnikiEn: ["bacon", "bryndza cheese"], cena: "24 zł" },
            { nazwa: "Česnečka – zupa czosnkowa", en: "Česnečka – garlic soup", nazwaCz: "Česnečka", skladniki: ["klarowny bulion", "czosnek", "białko", "grzanka serowa"], skladnikiEn: ["clear broth", "garlic", "egg white", "cheese toast"], cena: "24 zł", zdjecie: "./assets/img/zdjecie-04.jpg" },
            { nazwa: "Klarowny rosół z gęsi", en: "Clear goose broth", nazwaCz: "Husí vývar / knedlíčky s husím masem / petržel", skladniki: ["kołduny z mięsem gęsi", "natka pietruszki"], skladnikiEn: ["goose meat dumplings", "parsley"], cena: "26 zł", zdjecie: "./assets/img/zdjecie-23.jpg" },
            { nazwa: "Zupa cebulowa", en: "Onion soup", nazwaCz: "Cibulačka / bílé víno / rajčata / sýrové krutony", skladniki: ["białe wino", "pomidor", "grzanki z serem"], skladnikiEn: ["white wine", "tomato", "cheese croutons"], cena: "25 zł", zdjecie: "./assets/img/zdjecie-22.jpg" },
            { nazwa: "Pomidorowa z makaronem", en: "Tomato soup with pasta", nazwaCz: "Rajčatová polévka s těstovinami", skladniki: [], cena: "24 zł", zdjecie: "./assets/img/zdjecie-21.jpg" },
          ],
        },
        {
          id: "dzieci",
          kategoria: "Menu dla dzieci",
          kategoriaEn: "Kids' menu",
          dania: [
            { nazwa: "Zupa pomidorowa / rosół z makaronem", en: "Tomato soup / broth with pasta", nazwaCz: "Rajská polévka s těstovinami", skladniki: [], cena: "15 zł" },
            { nazwa: "Polędwiczki drobiowe panierowane", en: "Breaded chicken tenders", nazwaCz: "Kuřecí nugety / hranolky / salát z mrkve a jablek", skladniki: ["frytki", "surówka z marchewki z jabłkiem"], skladnikiEn: ["fries", "carrot and apple salad"], cena: "25 zł" },
            { nazwa: "Pulpety z indyka", en: "Turkey meatballs", nazwaCz: "Krůtí masové kuličky / rajská omáčka, bramborová kaše", skladniki: ["sos pomidorowy", "purée ziemniaczane"], skladnikiEn: ["tomato sauce", "mashed potatoes"], cena: "26 zł" },
            { nazwa: "Deser lodowy", en: "Ice cream dessert", nazwaCz: "Zmrzlinový dezert – zmrzlina / ovocní pěna / šlehačka", skladniki: ["lody", "mus owocowy", "bita śmietana"], skladnikiEn: ["ice cream", "fruit mousse", "whipped cream"], cena: "18 zł" },
          ],
        },
        {
          id: "drob",
          kategoria: "Dania z drobiu",
          kategoriaEn: "Poultry",
          dania: [
            { nazwa: "Pół pieczonej kaczki", en: "Half a roast duck", nazwaCz: "Půlka pečené kachny / knedlík se sušeným ovocem / červené zelí s brusinkami", skladniki: ["knedliki z suszonymi owocami", "czerwona kapusta z żurawiną"], skladnikiEn: ["dumplings with dried fruit", "red cabbage with cranberries"], cena: "74 zł", zdjecie: "./assets/img/zdjecie-09.jpg" },
            { nazwa: "Filet kurczaka kukurydzianego", en: "Corn-fed chicken breast", nazwaCz: "Kukuřičné kuře – prsa / bramborová kaše / salát vinaigrette", skladniki: ["purée ziemniaczane", "sałata winegret"], skladnikiEn: ["mashed potatoes", "salad with vinaigrette"], cena: "46 zł", zdjecie: "./assets/img/zdjecie-25.jpg" },
            { nazwa: "Pierogi z mięsem gęsi", en: "Dumplings (pierogi) with goose meat", nazwaCz: "Ručně vyráběné knedlíky s husím masem / moravské smažené zelí", skladniki: ["morawska zasmażana kapusta"], skladnikiEn: ["Moravian fried cabbage"], cena: "45 zł", zdjecie: "./assets/img/zdjecie-20.jpg" },
          ],
        },
        {
          id: "mieso",
          kategoria: "Dania mięsne",
          kategoriaEn: "Meat dishes",
          dania: [
            { nazwa: "Czeskie specjały dla 4 osób", en: "Czech specialities for 4 people", nazwaCz: "České speciality pro 4 osoby (svíčková, bramborák, hovězí guláš, krkovice, moravské zelí, knedlíky)", skladniki: ["ser wyprażany", "bramborak", "gulasz", "karczek", "knedliki", "kapusta zasmażana morawska"], skladnikiEn: ["fried cheese", "bramborák", "goulash", "pork neck", "dumplings", "Moravian fried cabbage"], cena: "218 zł" },
            { nazwa: "Svíčková na smetaně", en: "Svíčková na smetaně – beef in cream sauce", nazwaCz: "Svíčková na smetaně", skladniki: ["udziec wołowy", "sos śmietanowo-warzywny", "knedliki", "morawska zasmażana kapusta", "żurawina", "śmietana"], skladnikiEn: ["beef round", "vegetable cream sauce", "dumplings", "Moravian fried cabbage", "cranberries", "cream"], cena: "56 zł", zdjecie: "./assets/img/zdjecie-28.jpg" },
            { nazwa: "Praska szynka", en: "Prague ham", nazwaCz: "Pražská šunka", skladniki: ["sos chrzanowo-śmietanowy", "knedliki", "morawska zasmażana kapusta"], skladnikiEn: ["horseradish cream sauce", "dumplings", "Moravian fried cabbage"], cena: "52 zł", zdjecie: "./assets/img/zdjecie-13.jpg" },
            { nazwa: "Gulasz wołowy z pieczarkami", en: "Beef goulash with mushrooms", nazwaCz: "Hovězí guláš", skladniki: ["knedliki", "morawska zasmażana kapusta"], skladnikiEn: ["dumplings", "Moravian fried cabbage"], cena: "52 zł", zdjecie: "./assets/img/zdjecie-08.jpg" },
            { nazwa: "Bramborák", en: "Bramborák", nazwaCz: "Bramborák", skladniki: ["placki ziemniaczane", "praska szynka", "kapusta zasmażana", "kwaśna śmietana"], skladnikiEn: ["potato pancakes", "Prague ham", "fried cabbage", "sour cream"], cena: "52 zł", zdjecie: "./assets/img/zdjecie-29.jpg" },
            { nazwa: "Karczek w ziołach", en: "Herb pork neck", nazwaCz: "Vepřo-knedlo-zelo", skladniki: ["knedliki", "zasmażana kapusta"], skladnikiEn: ["dumplings", "fried cabbage"], cena: "49 zł", zdjecie: "./assets/img/zdjecie-10.jpg" },
            { nazwa: "Pieczona golonka (800 g)", en: "Roast pork knuckle (800 g)", nazwaCz: "Pečené vepřové koleno", skladniki: ["kwaśna kapusta"], skladnikiEn: ["sauerkraut"], uwagi: "Czas oczekiwania: 50 minut.", uwagiEn: "Waiting time: 50 minutes.", cena: "98 zł", zdjecie: "./assets/img/zdjecie-07.jpg" },
            { nazwa: "Stek z czarnego Angusa", en: "Black Angus steak", nazwaCz: "Steak z černého Angusu / salát vinaigrette", skladniki: ["sałata winegret"], skladnikiEn: ["salad with vinaigrette"], uwagi: "Sos do wyboru (9 zł): chimichurri, z zielonym pieprzem, czosnkowy.", uwagiEn: "Sauce of your choice (9 zł): chimichurri, green pepper, garlic.", cena: "114 zł" },
            { nazwa: "Sznycel cielęcy po wiedeńsku", en: "Viennese veal schnitzel", nazwaCz: "Telecí vídeňský řízek / bramborová kaše / salát vinaigrette", skladniki: ["purée ziemniaczane", "sałata winegret"], skladnikiEn: ["mashed potatoes", "salad with vinaigrette"], cena: "72 zł", zdjecie: "./assets/img/zdjecie-18.jpg" },
          ],
        },
        {
          id: "ryby",
          kategoria: "Dania rybne",
          kategoriaEn: "Fish",
          dania: [
            { nazwa: "Łosoś", en: "Salmon", nazwaCz: "Losos / kořenová zelenina / jogurtová omáčka s bylinkami", skladniki: ["warzywa korzeniowe", "sos jogurtowo-ziołowy"], skladnikiEn: ["root vegetables", "herb yoghurt sauce"], cena: "59 zł" },
            { nazwa: "Ryba dnia", en: "Fish of the day", nazwaCz: "Ryba denní nabídka", skladniki: [], cena: "od 49 zł", cenaEn: "from 49 zł" },
          ],
        },
        {
          id: "wege",
          kategoria: "Dania wegetariańskie",
          kategoriaEn: "Vegetarian",
          dania: [
            { nazwa: "Ser panierowany", en: "Fried breaded cheese", nazwaCz: "Smažený sýr s hranolky a tatarkou", skladniki: ["frytki", "sos tatarski"], skladnikiEn: ["fries", "tartar sauce"], cena: "39 zł", wege: true, zdjecie: "./assets/img/zdjecie-16.jpg" },
            { nazwa: "Ser Hermelín panierowany", en: "Fried breaded Hermelín cheese", nazwaCz: "Smažený Hermelín / ostružinová omáčka s tymiánem", skladniki: ["sos z jeżyn z tymiankiem"], skladnikiEn: ["blackberry and thyme sauce"], cena: "36 zł", wege: true },
            { nazwa: "Placki ziemniaczane", en: "Potato pancakes", nazwaCz: "Bramboráky", skladniki: ["kwaśna śmietana", "cukier"], skladnikiEn: ["sour cream", "sugar"], cena: "29 zł", wege: true, zdjecie: "./assets/img/zdjecie-27.jpg" },
            { nazwa: "Pierogi ze szpinakiem i serem feta", en: "Dumplings (pierogi) with spinach and feta", nazwaCz: "Knedlíky se špenátem a feta sýrem s cibulkou", skladniki: ["okraszone cebulką"], skladnikiEn: ["topped with fried onion"], cena: "45 zł", wege: true, zdjecie: "./assets/img/zdjecie-12.jpg" },
            { nazwa: "Pierogi z wędzonym serem owczym", en: "Dumplings (pierogi) with smoked sheep's cheese", nazwaCz: "Knedlíky s uzeným ovčím sýrem / brusinky / červená kapusta", skladniki: ["żurawina", "modra kapusta"], skladnikiEn: ["cranberries", "red cabbage"], cena: "45 zł", wege: true },
          ],
        },
        {
          id: "salatki",
          kategoria: "Sałatki",
          kategoriaEn: "Salads",
          dania: [
            { nazwa: "Sałatka z piersią kaczą", en: "Duck breast salad", nazwaCz: "Salát z kachních prsou / mango / hruška / sezam / malinovo-zázvorová omáčka", skladniki: ["sałaty", "mango", "gruszka", "sezam", "sos malinowo-imbirowy"], skladnikiEn: ["salad leaves", "mango", "pear", "sesame", "raspberry and ginger sauce"], cena: "49 zł" },
            { nazwa: "Sałatka z kurczakiem", en: "Chicken salad", nazwaCz: "Salát s grilovaným kuřecím masem / okurka / rajče / sýr / dressing", skladniki: ["sałaty", "chrupiący filet z kurczaka", "awokado", "owoce", "dressing miodowo-makowy"], skladnikiEn: ["salad leaves", "crispy chicken fillet", "avocado", "fruit", "honey and poppy seed dressing"], cena: "46 zł" },
            { nazwa: "Sałatka z kozim serem", en: "Goat cheese salad", nazwaCz: "Salát s kozím sýrem / hruška / pražené ořechy / pomerančová omáčka", skladniki: ["sałaty", "grillowany ser kozi", "gruszka", "prażone orzechy", "sos pomarańczowy"], skladnikiEn: ["salad leaves", "grilled goat cheese", "pear", "roasted nuts", "orange sauce"], cena: "49 zł", wege: true },
          ],
        },
        {
          id: "dodatki",
          kategoria: "Dodatki",
          kategoriaEn: "Sides",
          dania: [
            { nazwa: "Knedliki", en: "Bread dumplings (knedlíky)", nazwaCz: "Houskové knedlíky", skladniki: [], cena: "12 zł" },
            { nazwa: "Ziemniaki", en: "Potatoes", nazwaCz: "Brambory (puree, vařené, opékané)", skladniki: [], uwagi: "Purée, gotowane lub smażone.", uwagiEn: "Mashed, boiled or fried.", cena: "12 zł" },
            { nazwa: "Frytki", en: "Fries", nazwaCz: "Hranolky", skladniki: [], cena: "12 zł" },
            { nazwa: "Pieczone warzywa korzeniowe", en: "Roasted root vegetables", nazwaCz: "Pečená kořenová zelenina", skladniki: [], cena: "15 zł" },
            { nazwa: "Bukiet surówek", en: "Mixed salads", nazwaCz: "Míchané saláty", skladniki: [], cena: "15 zł" },
            { nazwa: "Sałaty z sosem winegret", en: "Salad leaves with vinaigrette", nazwaCz: "Saláty s vinaigrettovou omáčkou", skladniki: [], cena: "15 zł" },
            { nazwa: "Morawska kapusta zasmażana", en: "Moravian fried cabbage", nazwaCz: "Moravské smažené zelí", skladniki: [], cena: "15 zł" },
            { nazwa: "Czerwona kapusta z żurawiną", en: "Red cabbage with cranberries", nazwaCz: "Červené zelí s brusinkami", skladniki: [], cena: "15 zł" },
          ],
        },
        {
          id: "desery",
          kategoria: "Desery",
          kategoriaEn: "Desserts",
          dania: [
            { nazwa: "Marlenka", en: "Marlenka", nazwaCz: "Marlenka", skladniki: ["czeski torcik miodowy"], skladnikiEn: ["Czech honey cake"], uwagi: "Także w wersji bezglutenowej.", uwagiEn: "Also available gluten-free.", cena: "27 zł", zdjecie: "./assets/img/zdjecie-11.jpg" },
            { nazwa: "Sernik pieczony w niskiej temperaturze", en: "Slow-baked cheesecake", nazwaCz: "Tvarohový koláč / jahodová pěna", skladniki: ["mus truskawkowy"], skladnikiEn: ["strawberry mousse"], cena: "28 zł", zdjecie: "./assets/img/zdjecie-17.jpg" },
            { nazwa: "Deser lodowy", en: "Ice cream dessert", nazwaCz: "Zmrzlinový dezert / ovoce / pusinky / šlehačka / malinová omáčka", skladniki: ["owoce", "bezy", "bita śmietana", "sos malinowy"], skladnikiEn: ["fruit", "meringues", "whipped cream", "raspberry sauce"], cena: "29 zł", zdjecie: "./assets/img/zdjecie-05.jpg" },
          ],
        },
      ];

      // KARTA NAPOJÓW — te same pola co w karcie dań (nazwa, en, skladniki,
      // uwagi, cena). Kategoria może mieć uwagi pokazywane nad pozycjami.
      // { naglowek, naglowekEn } dzieli kategorię na grupy (np. Bezalkoholowe).
      // Ceny wpisane tak jak w karcie lokalu (NAPOJE.docx).
      const NAPOJE = [
        {
          id: "napoje-sezonowe",
          kategoria: "Napoje sezonowe",
          kategoriaEn: "Seasonal drinks",
          dania: [
            { naglowek: "Na ciepło", naglowekEn: "Hot" },
            { nazwa: "Herbata malinowa z rozmarynem", en: "Raspberry tea with rosemary", skladniki: ["czarna herbata", "puree z malin", "syrop Spiced Red Berries", "owoce leśne", "cytryna", "rozmaryn"], skladnikiEn: ["black tea", "raspberry purée", "Spiced Red Berries syrup", "forest berries", "lemon", "rosemary"], uwagi: "400 ml.", uwagiEn: "400 ml.", cena: "32 zł" },
            { nazwa: "Gorąca lemoniada gruszkowa", en: "Hot pear lemonade", skladniki: ["syrop gruszkowy", "gruszka", "sok z cytryny", "miód", "przyprawa korzenna", "cynamon"], skladnikiEn: ["pear syrup", "pear", "lemon juice", "honey", "mixed spice", "cinnamon"], uwagi: "400 ml.", uwagiEn: "400 ml.", cena: "29 zł" },
            { nazwa: "Gorąca lemoniada szarlotka", en: "Hot apple pie lemonade", skladniki: ["sok jabłkowy", "syrop Apple Pie", "jabłko", "cynamon", "goździki"], skladnikiEn: ["apple juice", "Apple Pie syrup", "apple", "cinnamon", "cloves"], uwagi: "400 ml.", uwagiEn: "400 ml.", cena: "29 zł" },
            { nazwa: "Grzaniec bezalkoholowy z czerwonego wina", en: "Alcohol-free red mulled wine", skladniki: ["wino czerwone bezalkoholowe", "puree z malin", "syrop Spiced Red Berries", "miód", "pomarańcza", "goździki", "przyprawa korzenna"], skladnikiEn: ["alcohol-free red wine", "raspberry purée", "Spiced Red Berries syrup", "honey", "orange", "cloves", "mixed spice"], uwagi: "250 ml.", uwagiEn: "250 ml.", cena: "32 zł" },
            { nazwa: "Grzaniec bezalkoholowy z białego wina", en: "Alcohol-free white mulled wine", skladniki: ["wino białe bezalkoholowe", "puree z gruszki", "syrop gruszkowy", "przyprawa korzenna", "gruszka", "goździki", "cynamon"], skladnikiEn: ["alcohol-free white wine", "pear purée", "pear syrup", "mixed spice", "pear", "cloves", "cinnamon"], uwagi: "250 ml.", uwagiEn: "250 ml.", cena: "32 zł" },
            { nazwa: "Caffè latte piernikowo-dyniowe", en: "Gingerbread and pumpkin caffè latte", skladniki: ["syrop Gingerbread & Pumpkin Spice", "mleko", "espresso", "przyprawa korzenna"], skladnikiEn: ["Gingerbread & Pumpkin Spice syrup", "milk", "espresso", "mixed spice"], uwagi: "250 ml.", uwagiEn: "250 ml.", cena: "28 zł" },
            { nazwa: "Rozgrzewający napój bogów", en: "Warming drink of the gods", skladniki: ["jasne piwo", "miód", "przyprawa korzenna", "goździki", "pomarańcza"], skladnikiEn: ["pale beer", "honey", "mixed spice", "cloves", "orange"], uwagi: "400 ml.", uwagiEn: "400 ml.", cena: "26 zł" },
            { naglowek: "Bezalkoholowe", naglowekEn: "Alcohol-free" },
            { nazwa: "Aperol Virgin", en: "Aperol Virgin", skladniki: ["syrop Orange Spritz", "Prosecco 0%", "lód", "plastry pomarańczy"], skladnikiEn: ["Orange Spritz syrup", "0% Prosecco", "ice", "orange slices"], uwagi: "380 ml.", uwagiEn: "380 ml.", cena: "36 zł" },
            { nazwa: "Mojito Mint Virgin", en: "Mojito Mint Virgin", skladniki: ["syrop Mojito Mint", "woda gazowana", "mięta", "limonka"], skladnikiEn: ["Mojito Mint syrup", "sparkling water", "mint", "lime"], uwagi: "380 ml.", uwagiEn: "380 ml.", cena: "36 zł" },
            { nazwa: "Espresso Tonic", en: "Espresso Tonic", skladniki: ["kawa espresso", "Kinley Tonic", "Grenadina", "lód", "limonka"], skladnikiEn: ["espresso", "Kinley Tonic", "grenadine", "ice", "lime"], uwagi: "200 ml.", uwagiEn: "200 ml.", cena: "22 zł" },
            { naglowek: "Alkoholowe", naglowekEn: "With alcohol" },
            { nazwa: "Prosecco Paradise", en: "Prosecco Paradise", skladniki: ["Malibu", "Prosecco", "syrop mango-marakuja", "sok z limonki"], skladnikiEn: ["Malibu", "Prosecco", "mango and passion fruit syrup", "lime juice"], cena: "39 zł" },
            { nazwa: "Butterfly Rum", en: "Butterfly Rum", skladniki: ["rum", "syrop i sok z grejpfruta", "napar z kwiatów klitorii", "limonka"], skladnikiEn: ["rum", "grapefruit syrup and juice", "butterfly pea flower infusion", "lime"], cena: "41 zł" },
            { nazwa: "Hot Plum", en: "Hot Plum", skladniki: ["Soplica śliwkowa", "sok jabłkowy", "śliwka suszona", "jabłko"], skladnikiEn: ["Soplica plum vodka", "apple juice", "dried plum", "apple"], cena: "33 zł" },
          ],
        },
        {
          id: "piwo",
          kategoria: "Piwo – Černá Hora",
          kategoriaEn: "Beer – Černá Hora",
          uwagi: "Ceny za 0,3 l / 0,5 l / 1 l.",
          uwagiEn: "Prices for 0.3 l / 0.5 l / 1 l.",
          dania: [
            { nazwa: "Ležák", en: "Ležák", skladniki: ["pils"], skladnikiEn: ["pilsner"], cena: "16 / 20 / 33 zł" },
            { nazwa: "Pšeničné", en: "Pšeničné", skladniki: ["niefiltrowane"], skladnikiEn: ["unfiltered wheat beer"], cena: "16 / 20 / 33 zł" },
            { nazwa: "Tmavé (Granát)", en: "Tmavé (Granát)", skladniki: ["ciemne"], skladnikiEn: ["dark"], cena: "16 / 20 / 33 zł" },
            { nazwa: "Medový ležák", en: "Medový ležák", skladniki: ["lager"], skladnikiEn: ["honey lager"], cena: "16 / 20 / 33 zł" },
            { nazwa: "IPA 14 Flying Cloud", en: "IPA 14 Flying Cloud", skladniki: [], cena: "16 / 20 / 33 zł" },
            { nazwa: "Řezané pivo", en: "Řezané pivo", skladniki: [], uwagi: "Medový ležák i Granát pół na pół.", uwagiEn: "Half Medový ležák, half Granát.", cena: "21 / 25 / 39 zł" },
            { nazwa: "Zestaw degustacyjny", en: "Tasting set", skladniki: [], uwagi: "5 × 150 ml.", uwagiEn: "5 × 150 ml.", cena: "30 zł" },
            { nazwa: "Piwo butelkowe", en: "Bottled beer", skladniki: [], uwagi: "Również w wersji bezalkoholowej – o dostępność zapytaj obsługę.", uwagiEn: "Also alcohol-free – ask our staff about availability.", cena: "od 20 zł", cenaEn: "from 20 zł" },
          ],
        },
        {
          id: "cieple",
          kategoria: "Napoje ciepłe",
          kategoriaEn: "Hot drinks",
          dania: [
            { nazwa: "Herbata", en: "Tea", skladniki: [], cena: "12 zł" },
            { nazwa: "Herbata z rumem", en: "Tea with rum", skladniki: [], cena: "27 zł" },
            { nazwa: "Kawa espresso", en: "Espresso", skladniki: [], cena: "13 zł" },
            { nazwa: "Espresso macchiato", en: "Espresso macchiato", skladniki: [], cena: "16 zł" },
            { nazwa: "Espresso doppio", en: "Espresso doppio", skladniki: [], cena: "16 zł" },
            { nazwa: "Americano", en: "Americano", skladniki: [], cena: "14 zł" },
            { nazwa: "Americano z mlekiem", en: "Americano with milk", skladniki: [], cena: "16 zł" },
            { nazwa: "Cappuccino", en: "Cappuccino", skladniki: [], cena: "18 zł" },
            { nazwa: "Latte", en: "Latte", skladniki: [], cena: "20 zł" },
            { nazwa: "Latte macchiato z syropem", en: "Latte macchiato with syrup", skladniki: [], cena: "24 zł" },
            { nazwa: "Ice coffee z lodami i syropem waniliowym", en: "Iced coffee with ice cream and vanilla syrup", skladniki: [], cena: "32 zł" },
            { nazwa: "Irish coffee", en: "Irish coffee", skladniki: [], cena: "32 zł" },
            { nazwa: "Wino grzane", en: "Mulled wine", skladniki: ["goździki", "pomarańcza"], skladnikiEn: ["cloves", "orange"], cena: "25 zł" },
          ],
        },
        {
          id: "zimne",
          kategoria: "Napoje zimne",
          kategoriaEn: "Cold drinks",
          dania: [
            { nazwa: "Kofola", en: "Kofola", skladniki: [], uwagi: "0,5 l / 1 l.", uwagiEn: "0.5 l / 1 l.", cena: "17 / 29 zł" },
            { nazwa: "Almdudler – lemoniada", en: "Almdudler lemonade", skladniki: [], uwagi: "0,33 l.", uwagiEn: "0.33 l.", cena: "26 zł" },
            { nazwa: "Coca-Cola, Tonic Kinley, Fanta, Sprite", en: "Coca-Cola, Kinley Tonic, Fanta, Sprite", skladniki: [], uwagi: "0,25 l.", uwagiEn: "0.25 l.", cena: "12 zł" },
            { nazwa: "Kropla Beskidu – woda mineralna", en: "Kropla Beskidu mineral water", skladniki: [], uwagi: "0,33 l.", uwagiEn: "0.33 l.", cena: "12 zł" },
            { nazwa: "Dzbanek wody z miętą i cytrusami", en: "Jug of water with mint and citrus", skladniki: [], uwagi: "1 l.", uwagiEn: "1 l.", cena: "19 zł" },
            { nazwa: "Sok ze świeżych owoców", en: "Fresh fruit juice", skladniki: [], uwagi: "0,3 l.", uwagiEn: "0.3 l.", cena: "29 zł" },
            { nazwa: "Sok Cappy", en: "Cappy juice", skladniki: [], uwagi: "0,25 l.", uwagiEn: "0.25 l.", cena: "12 zł" },
            { nazwa: "Dzbanek soku", en: "Jug of juice", skladniki: [], uwagi: "1 l.", uwagiEn: "1 l.", cena: "34 zł" },
          ],
        },
        {
          id: "wodki",
          kategoria: "Wódki",
          kategoriaEn: "Vodka and spirits",
          uwagi: "Ceny za 40 ml / 0,7 l.",
          uwagiEn: "Prices per 40 ml / 0.7 l.",
          dania: [
            { nazwa: "Czechoslovakia", en: "Czechoslovakia", skladniki: [], cena: "18 / 220 zł" },
            { nazwa: "Becherovka", en: "Becherovka", skladniki: [], cena: "21 / 220 zł" },
            { nazwa: "Gruszkówka", en: "Pear brandy (Hruškovice)", skladniki: [], cena: "23 / 225 zł" },
            { nazwa: "Śliwowica", en: "Plum brandy (Slivovice)", skladniki: [], cena: "23 / 225 zł" },
            { nazwa: "Śliwowica Kosher 50%", en: "Kosher plum brandy 50%", skladniki: [], cena: "31 / 320 zł" },
            { nazwa: "Absynt 80%", en: "Absinthe 80%", skladniki: [], cena: "27 zł" },
            { nazwa: "Wyborowa", en: "Wyborowa", skladniki: [], uwagi: "40 ml / 0,5 l / 0,7 l.", uwagiEn: "40 ml / 0.5 l / 0.7 l.", cena: "14 / 95 / 139 zł" },
            { nazwa: "Finlandia", en: "Finlandia", skladniki: [], uwagi: "40 ml / 0,5 l / 0,7 l.", uwagiEn: "40 ml / 0.5 l / 0.7 l.", cena: "16 / 150 / 198 zł" },
            { nazwa: "Ostoja", en: "Ostoja", skladniki: [], uwagi: "40 ml / 0,5 l / 0,7 l.", uwagiEn: "40 ml / 0.5 l / 0.7 l.", cena: "17 / 150 / 198 zł" },
            { nazwa: "Żubrówka Bison Grass", en: "Żubrówka Bison Grass", skladniki: [], cena: "14 / 139 zł" },
            { nazwa: "Jägermeister", en: "Jägermeister", skladniki: [], cena: "19 / 210 zł" },
          ],
        },
        {
          id: "whisky",
          kategoria: "Whisky, brandy, bourbon, gin, tequila",
          kategoriaEn: "Whisky, brandy, bourbon, gin, tequila",
          uwagi: "Ceny za 40 ml / 0,7 l.",
          uwagiEn: "Prices per 40 ml / 0.7 l.",
          dania: [
            { nazwa: "Jameson", en: "Jameson", skladniki: [], cena: "22 / 250 zł" },
            { nazwa: "Auchentoshan 12 YO", en: "Auchentoshan 12 YO", skladniki: [], cena: "36 zł" },
            { nazwa: "Glenfiddich 15 YO", en: "Glenfiddich 15 YO", skladniki: [], cena: "42 zł" },
            { nazwa: "Ballantine’s Finest", en: "Ballantine’s Finest", skladniki: [], cena: "27 / 220 zł" },
            { nazwa: "Jack Daniel’s", en: "Jack Daniel’s", skladniki: [], cena: "25 / 280 zł" },
            { nazwa: "Metaxa 7*", en: "Metaxa 7*", skladniki: [], cena: "25 zł" },
            { nazwa: "Gin Beefeater", en: "Beefeater Gin", skladniki: [], cena: "18 zł" },
            { nazwa: "Rum Bacardi", en: "Bacardi Rum", skladniki: [], cena: "18 zł" },
            { nazwa: "Rum Dictador 12 YO", en: "Dictador 12 YO Rum", skladniki: [], cena: "26 zł" },
            { nazwa: "Tequila", en: "Tequila", skladniki: [], cena: "24 zł" },
          ],
        },
        {
          id: "drinki",
          kategoria: "Drinki",
          kategoriaEn: "Cocktails",
          dania: [
            { nazwa: "Zurivy Čech", en: "Zurivy Čech", skladniki: [], cena: "24 zł" },
            { nazwa: "Aperol Spritz", en: "Aperol Spritz", skladniki: [], cena: "42 zł" },
            { nazwa: "Szprycer", en: "Spritzer", skladniki: [], cena: "35 zł" },
            { nazwa: "Hugo Spritz by „Český Film”", en: "Hugo Spritz by „Český Film”", skladniki: [], cena: "42 zł" },
            { nazwa: "Ogórek Bison Grass", en: "Bison Grass Cucumber", skladniki: [], cena: "34 zł" },
            { nazwa: "Cuba Libre", en: "Cuba Libre", skladniki: [], cena: "39 zł" },
            { nazwa: "Gin & Tonik by „Český Film”", en: "Gin & Tonic by „Český Film”", skladniki: [], cena: "36 zł" },
            { nazwa: "Campari Orange", en: "Campari Orange", skladniki: [], cena: "36 zł" },
          ],
        },
      ];

      const UI_TEXT = {
        pl: { wege: "Wege", ostre: "Ostre", wegeLabel: "Danie wegetariańskie", ostreLabel: "Danie ostre", photo: "Pokaż zdjęcie" },
        en: { wege: "Vegetarian", ostre: "Spicy", wegeLabel: "Vegetarian dish", ostreLabel: "Spicy dish", photo: "Show photo" },
      };

      const tabClassActive =
        "menu-tab shrink-0 border-b-4 border-copper px-4 py-4 text-sm font-bold uppercase tracking-[0.18em] text-brass transition-colors duration-300";
      const tabClassIdle =
        "menu-tab shrink-0 border-b-4 border-transparent px-4 py-4 text-sm font-bold uppercase tracking-[0.18em] text-[#A0A0A0] transition-colors duration-300 hover:text-brass";

      // Karty z przełącznikiem PL / EN; aktywna zakładka zostaje przy zmianie języka
      const CARDS = [
        { data: MENU, tabs: "menuTabs", panels: "menuPanels", prefix: "panel-", active: MENU[0].id },
        { data: NAPOJE, tabs: "drinkTabs", panels: "drinkPanels", prefix: "napoje-", active: NAPOJE[0].id },
      ];
