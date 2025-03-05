ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable users to view their own data only" ON public.chats
    AS PERMISSIVE
    FOR SELECT
    TO authenticated
    USING (
        (SELECT auth.uid()) = user_id
    );

CREATE POLICY "Enable insert for authenticated users only" ON public.chats
    AS PERMISSIVE
    FOR INSERT
    TO authenticated
    WITH CHECK (
        true
    );
