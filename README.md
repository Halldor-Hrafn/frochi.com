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
