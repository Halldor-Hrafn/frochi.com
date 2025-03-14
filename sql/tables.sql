CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    owner_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    lat NUMERIC NOT NULL,
    lng NUMERIC NOT NULL,
    icon TEXT NOT NULL,

    CONSTRAINT pk_events PRIMARY KEY (id),
    CONSTRAINT fk_owner_id FOREIGN KEY (owner_id) REFERENCES auth.users (id) ON DELETE SET NULL
) TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.messages (
    id INT GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMP DEFAULT NOW(),
    owner_id UUID NOT NULL,
    event_id UUID NOT NULL,
    message TEXT NOT NULL,

    CONSTRAINT pk_messages PRIMARY KEY (id),
    CONSTRAINT fk_owner_id FOREIGN KEY (owner_id) REFERENCES auth.users (id) ON DELETE SET NULL,
    CONSTRAINT fk_event_id FOREIGN KEY (event_id) REFERENCES public.events (id) ON DELETE CASCADE
) TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid(),
    auth_id UUID NOT NULL,
    name TEXT NOT NULL,

    CONSTRAINT pk_users PRIMARY KEY (id),
    CONSTRAINT fk_auth_id FOREIGN KEY (auth_id) REFERENCES auth.users (id) ON DELETE CASCADE
) TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.event_users (
    id INT GENERATED ALWAYS AS IDENTITY
    created_at TIMESTAMP DEFAULT NOW(),
    event_id UUID NOT NULL,
    user_id UUID NOT NULL,

    CONSTRAINT pk_event_users PRIMARY KEY (id),
    CONSTRAINT fk_event_id FOREIGN KEY (event_id) REFERENCES public.events (id) ON DELETE CASCADE,
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
) TABLESPACE pg_default;
