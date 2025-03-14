"use client";

import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { getUsernameFromId } from "@/utils/supabase/user";
import { AuthUser } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import {cn} from "@/utils/utils";

export default function Profile() {
    const [user, setUser] = useState<AuthUser & { username: string | null } | null>(null);
    const [formData, setFormData] = useState({
        id: '',
        newName: '',
    });
    const supabase = createClient();

    useEffect(() => {
        const fetchUser = async () => {
            const { error, data } = await supabase.auth.getUser();
            if (data && !error) {
                const username = await getUsernameFromId(data.user.id);
                setUser({ ...data.user, username });
                // Set formData's id with the user's ID
                setFormData((prevState) => ({
                    ...prevState,
                    id: data.user.id,
                    newName: username || '', // Set newName if available, else empty string
                }));
            }
        };

        fetchUser();
    }, [supabase]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/profile`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: formData.newName }),
            });
            if (!res.ok) {
                throw new Error('Failed to update username');
            }

            const updatedEvent = await res.json();
            console.log(updatedEvent.id);
        } catch (e: any) {
            console.error('Error updating username:', e.message);
        }
    };

    return (
        <div>
            <p>{user ? user.username : 'Loading user data...'}</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="hidden"
                    name="id"
                    value={formData.id}
                />
                <input
                    type="text"
                    name="newName"
                    placeholder="New Name"
                    value={formData.newName}
                    onChange={handleInputChange}
                    required
                />
                <button type="submit">send</button>
            </form>
        </div>
    );
}
