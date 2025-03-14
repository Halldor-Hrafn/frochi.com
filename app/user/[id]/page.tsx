
"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { getProfileImageLinkFromId, getUsernameFromId } from "@/utils/supabase/user";
import { AuthUser } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

type PageProps = {
    params: Promise<{ id: string }>;
};

export default function Profile({ params }: PageProps) {
    const [user, setUser] = useState<AuthUser & { username: string | null, profile_image: string | null} | null>(null);

    const supabase = createClient();

    useEffect(() => {
        const fetchUser = async () => {
            const { error, data } = await supabase.auth.getUser();
            if (data && !error) {
                const username = await getUsernameFromId((await params).id);
                const profile_image = user ? await getProfileImageLinkFromId(user.id) 
                             : "https://emqvjwtowgujddqurtnb.supabase.co/storage/v1/object/public/profile-images//default_profile_image.png"
                setUser({ ...data.user, username, profile_image });
            }
        };

        fetchUser();
    }, [supabase]);



    return (
        <div>
                
        </div>
    );
}
