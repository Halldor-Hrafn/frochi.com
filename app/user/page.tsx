"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { getProfileImageLinkFromId, getUsernameFromId } from "@/utils/supabase/user";
import { AuthUser } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import {cn} from "@/utils/utils";
import UserProfile from "@/components/profile";

export default function Profile() {
    const [user, setUser] = useState<AuthUser & { username: string | null, profile_image: string } | null>(null);
    const [formData, setFormData] = useState({
        id: '',
        newName: '',
        profile_image: "",
    });
    const supabase = createClient();

    useEffect(() => {
        const fetchUser = async () => {
            const { error, data } = await supabase.auth.getUser();
            if (data && !error) {
                const username = await getUsernameFromId(data.user.id);
                const profile_image = await getProfileImageLinkFromId(data.user.id)
                setUser({ ...data.user, username, profile_image });
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

    const handleNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleProfileImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files && files[0]){
            const file = files[0]
            setFormData((prevState) => ({
                ...prevState,
                [name]: file,
            }));
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/profile`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: formData.newName, profile_image: formData.profile_image }),
            });
            if (!res.ok) {
                throw new Error('Failed to update username');
            }
            
            const updatedEvent = await res.json();
            window.location.reload();
        } catch (e: any) {
            console.error('Error updating username:', e.message);
        }
    };

    return (
    <div>
        <UserProfile username={user?.username ?? "Unknown User"} profile_image={user?.profile_image ?? "https://emqvjwtowgujddqurtnb.supabase.co/storage/v1/object/public/profile-images/default_profile_image.png"} />
        <form onSubmit={handleSubmit} action="/" className="grid">
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
                onChange={handleNameInputChange}
                required
            />
            <input
                type="file"
                name="profile_image"
                placeholder=""
                onChange={handleProfileImageInputChange}
            />
            <Button type="submit">send</Button>
        </form>
    </div>
    );
}