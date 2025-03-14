# frochi.com

## A site used to help individual join events made to aid the world.

frochi.com is a website made by 3 students from [FB](https://fb.is) for a web developing competition [Mín Framtíð](https://www.minframtid.is) 2025. This website is designed so that a user who signed up on the website can create events designed to aid with the UN's Sustainable Development Goals. Other users can also participate in such events or create other events themselves.

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
