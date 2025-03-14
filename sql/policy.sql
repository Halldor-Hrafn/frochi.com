ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable select for all users" ON public.events
    AS PERMISSIVE
    FOR SELECT
    TO public;

CREATE POLICY "Enable insert for authenticated users only" ON public.events
    AS PERMISSIVE
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON public.events
    AS PERMISSIVE
    FOR UPDATE
    TO authenticated
    USING (
        (SELECT auth.uid() AS uid) = owner_id
    );

CREATE POLICY "Enable delete for users based on owner_id" ON public.events
    TO public
    USING (
        (SELECT auth.uid() AS uid) = owner_id
    );

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable select for all users" ON public.messages
    AS PERMISSIVE
    FOR SELECT
    TO public;

CREATE POLICY "Enable insert for authenticated users only" ON public.messages
    AS PERMISSIVE
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON public.messages
    AS PERMISSIVE
    FOR UPDATE
    TO authenticated
    USING (
        (SELECT auth.uid() AS uid) = owner_id
    );

CREATE POLICY "Enable delete for users based on owner_id" ON public.messages
    TO public
    USING (
        (SELECT auth.uid() AS uid) = owner_id
    );
