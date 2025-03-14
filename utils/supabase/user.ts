import {createClient} from "@/utils/supabase/client";


export async function getUsernameFromId(authId: string): Promise<string | null> {
    const supabase = createClient();
    const {error, data} = await supabase
        .from("users")
        .select("name")
        .eq("auth_id", authId);

    if (error) return null;

    return data?.map(d => d.name)[0] || null;
}

export async function getProfileImageLinkFromId(authId: string): Promise<string | null> {
    const supabase = createClient();
    const {error, data} = await supabase
        .from("users")
        .select("profile_image_link")
        .eq("auth_id", authId);

    if (error) return null;

    return data?.map(d => d.profile_image_link)[0] || null;
}