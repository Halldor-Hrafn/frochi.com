# frochi.com
(English below)
## Vefsíða til að hjálpa einstaklingum að taka þátt í viðburðum sem stuðla að því að bæta heiminn.

frochi.com er vefsíða búin til af 3 nemendum frá [FB](https://fb.is) fyrir vefforritunarkeppnina [Mín Framtíð](https://www.minframtid.is) 2025. Þessi vefsíða er hönnuð þannig að notandi sem skráir sig á vefsíðuna getur búið til viðburði sem ætlað er að styðja við Sjálfbærnimarkmið Sameinuðu þjóðanna. Aðrir notendur geta einnig tekið þátt í slíkum viðburðum eða búið til aðra viðburði sjálfir.

## Tækniinnviðir

- Nextjs: Við völdum Nextjs þar sem það er auðvelt í notkun, hefur góða skjölun um virkni þess og hvernig á að nota það, og allir þrír þekktum við Nextjs þegar.
- Supabase: Við völdum Supabase þar sem það léttir af okkur allri bakendavirkni. Með Supabase þurfum við ekki að stilla notandaaðgang, tölvupóststaðfestingar, S3 skýjageymslu, spjallherbergi í rauntíma og margt fleira. Supabase hefur frábæra skjölun og ótrúlegan stuðning fyrir Nextjs.
- Vercel: Við völdum Vercel til að hýsa Nextjs verkefnið okkar þar sem það er besta þjónustan fyrir þann tilgang.
- Resend.com: Við völdum Resend sem SMTP þjón fyrir allt sem við þurfum með tölvupósta, sérstaklega staðfestingu tölvupósta í Supabase. Hægt er að nota Supabase fyrir staðfestingu tölvupósta, en það hefur takmarkanir á hraða, svo við notuðum Resend.com til að sjá um staðfestingu tölvupósta.
- Typescript: Við völdum að nota Typescript sem forritunarmál þar sem það auðveldar að greina villur og tryggir týpubundna öryggi svo við reynum ekki að sækja gildi sem er ekki til.
- TailwindCSS: Við völdum að nota Tailwind þar sem það sparar tíma í að finna CSS-skrár, breyta gildum og leita að réttum div.

## Uppsetning

Leiðbeiningarnar eru hannaðar fyrir einstaklinga sem vilja búa til eigin útgáfu af verkefninu fyrir sig, og því mun það fara yfir alla skrefin sem þarf til að gera vefsíðuna virka.

Skref 1: git clone og cd

```sh
git clone https://github.com/Halldor-Hrafn/frochi.com.git && cd frochi.com
```

Skref 2: Setja upp pakka

```sh
npm i
```

Skref 3: Endurnefna `env.examples` í `env.local` (eða einfaldlega `.env`) og uppfæra eftirfarandi:

```env
NEXT_PUBLIC_SUPABASE_URL=[SETTU SUPABASE SLÓÐ HÉR]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[SETTU ANON LYKIL HÉR]
```

Skref 4: Stilla Supabase

Búðu til verkefni í Supabase [hér](https://database.new)

Finndu verkefnisslóðina þína og opinbera lykilinn (anon/public key) og settu þau í env-skrána.

Skref 5: Setja upp gagnagrunninn

Þegar þú hefur stillt verkefnið þitt þarftu að setja upp allar töflur. Farðu í `sql/tables.sql` skrána og keyrðu allar SQL fyrirspurnirnar til að setja upp allar töflur.

Skref 6: Virkja rauntíma fyrir messages töfluna.

Þú ert ekki alveg búinn enn. Farðu aftur í taflureddu Supabase og virkjaðu rauntíma fyrir messages töfluna. Þú ættir að sjá hnapp efst sem segir realtime off, smelltu á hann, ýttu á nokkra takka og það ætti að vera búið.

Skref 6.5 (valfrjálst): Virkja Raðsstýrðan Öryggisreglur

Þetta skref er valfrjálst, en ef þú vilt geturðu virkjað Raðsstýrðar öryggisreglur. Farðu í `sql/policy.sql` og keyrðu fyrirspurnirnar þar og það ætti að vera tilbúið.

## (Valfrjálst) Stilla resend.com fyrir Supabase

Resend er SMTP þjónustuveita sem virkar mjög vel með Supabase, og við notuðum það í verkefninu okkar. Að nota það er hins vegar valfrjálst en mælt með.

Leiðbeiningar um hvernig á að setja það upp eru utan viðfangsefni þessa README, en ég mun veita heimildir um hvernig á að gera það:

- [Kynning á Resend](https://resend.com/docs/dashboard/domains/introduction)
- [Supabase með SMTP](https://resend.com/docs/send-with-supabase-smtp)

# frochi.com

## A site used to help individual join events made to aid the world.

frochi.com is a website made by 3 students from [FB](https://fb.is) for a web developing competition [Mín Framtíð](https://www.minframtid.is) 2025. This website is designed so that a user who signed up on the website can create events designed to aid with the UN's Sustainable Development Goals. Other users can also participate in such events or create other events themselves.

## Tech Stack

- Nextjs: We picked Nextjs as it is easy to use, has good documentation on its functionality and how to use it, and all three of us knew how to use Nextjs already.
- Supabase: We picked Supabase as it basically offloads all backend functionality to it, with Supabase we wouldn't have to configure user authentication, email verification, S3 file storage, realtime chatrooms, and so much more. Supabase has incredible documentation and amazing support from Nextjs.
- Vercel: We picked Vercel to host our Nextjs project as it is the best service provider for that use case.
- Resend.com: We picked Resend as the SMTP server to handle everything we need with emails, most notably Supabase's email verification. It is possible to use Supabase for email verification, but it is rate limited, so we brought along Resend.com to handle email verification for us.

- Typescript: We picked to use Typescript as the language as it makes detecting errors a breeze, and also for type safety so we are not trying to fetch a value that does not exist.
- TailwindCSS: We picked to use Tailwind as it as it saves some time from having to repeatedly find a CSS file, change some values in it, and then try to find where that div is.


## Installation
The installation guide is designed for individuals to make their own version of the project for themselves, as such, it will go over all steps needed to make the whole website functioning.

Step 1: git clone and cd

```sh
git clone https://github.com/Halldor-Hrafn/frochi.com.git && cd frochi.com
```

Step 2: Install packages

```sh
npm i
```

Step 3: Rename `env.examples` to `env.local` (or simply `.env`) and update the following:

```env
NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE URL HERE]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT ANON KEY HERE]
```

Step 4: Configure Supabase

Create a project for Supabase [here](https://database.new)

Look for your project URL and then the anon/public key and put them in the env file.

Step 5: Setup the database

Now that you have configured your project, you need to setup all the tables. Go to the `sql/tables.sql` file and run all the sql queries in order to set up all of your tables.

Step 6: Enable realtime for the `messages` table.

Now don't think you're completely off the hook yet, go back to the table editor in Supabase and enable realtime for the `messages` table, you should see a button near the top that says `realtime off`, click that, press some buttons, and it should be done.

Step 6.5 (optional): Enable Row-Level Security

This step is optional, but if you so choose you can enable Row-Level Security, go to `sql/policy.sql` and run the queries in there and you should be good.

## (Optional) Configure Resend.com for Supabase

Resend is an SMTP provider that works very well with Supabase, and it is what we used for our project, using it however is very optional but highly reccomended.

Instructions on how to configure it is beyond the scope of this README, but I will provide resources on how to do it:

- [Introduction to Resend](https://resend.com/docs/dashboard/domains/introduction)
- [Supabase with SMTP](https://resend.com/docs/send-with-supabase-smtp)


