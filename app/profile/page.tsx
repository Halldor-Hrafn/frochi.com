"use client";


import { createClient } from "@/utils/supabase/client";
import { getUsernameFromId } from "@/utils/supabase/user";
import { AuthUser } from "@supabase/supabase-js";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Profile() {
    const [user, setUser] = useState<AuthUser & {username: string | null} | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = await createClient();
            const {error, data} = await supabase.auth.getUser();
            if (data && !error) {
                
                setUser({...data.user,username: await getUsernameFromId(data.user.id)});
                console.log('usr id:', data.user.id)
            }
        }

        fetchUser();
    }, []);

    return (
    <>
        <p>{user ? user.username : ""}</p>
    </>
    );
}
