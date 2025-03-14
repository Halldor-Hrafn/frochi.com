"use client";


import { createClient } from "@/utils/supabase/client";
import { getUsernameFromId } from "@/utils/supabase/user";
import { AuthUser } from "@supabase/supabase-js";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Profile() {
    const [user, setUser] = useState<AuthUser & {username: string | null} | null>(null);
    const [formData, setFormData] = useState<{id: string, new_username: string | null}| null>(null);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/profile`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({...formData}),
            });

            if (!res.ok) {
                throw new Error('Failed to update username');
            }

            const updatedEvent = await res.json();
            console.log(updatedEvent.id);
        } catch (e: any) {
            throw new Error('Failed to update username');
        } finally {
            throw new Error('Failed to update username');
        }
    };

    return (
    <>
        <p>{user ? user.username : ""}</p>
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="New Name" />
            <div className="bg-gray-500">
                <input type="button" value="submit"/>
            </div>
        </form>
    </>
    );
}
