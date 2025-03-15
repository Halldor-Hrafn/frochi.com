"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { getProfileImageLinkFromId, getUsernameFromId } from "@/utils/supabase/user";
import { AuthUser } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import UserProfile from "@/components/profile";
import toast from "react-hot-toast";

export default function Profile() {
    const [user, setUser] = useState<AuthUser & { username: string | null, profile_image: string } | null>(null);
    const [formData, setFormData] = useState({
        newName: '',
        profile_image: null as File | null,
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
            const link = await handleUpload();
            if (!link) {
                throw new Error('Failed to upload profile image');
            }
            const res = await fetch(`/api/profile`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: formData.newName, profile_image_link: link }),
            });
            if (!res.ok) {
                throw new Error('Failed to update username');
            }
            
            window.location.reload();
            // const updatedEvent = await res.json();
        } catch (e: any) {
            console.error('Error updating username:', e.message);
        }
    };

    const handleUpload = async (): Promise<string | null> => {
        if (!formData.profile_image) {
            toast.error("No image selected");
            return null;
        }

        const fileExt = formData.profile_image.name.split('.').pop();
        const fileName = `profile.${fileExt}`;
        const filePath = `${user?.id}/${fileName}${Date.now()}`;

        

        const { data, error } = await supabase.storage
            .from("profile-images")
            .upload(filePath, formData.profile_image, {
            upsert: true});
        
        if (error) {
            console.error('Error uploading file:', error.message);
            return null;
        }

        return "https://emqvjwtowgujddqurtnb.supabase.co/storage/v1/object/public/" + data?.fullPath || null;
    };

    return (
    <div>
        <UserProfile username={user?.username ?? "Unknown User"} profile_image={user?.profile_image ?? "https://emqvjwtowgujddqurtnb.supabase.co/storage/v1/object/public/profile-images/default_profile_image.png"} />
        <form onSubmit={handleSubmit} action="/" className="grid">
            <input
                type="text"
                name="newName"
                placeholder="New Name"
                value={formData.newName}
                onChange={handleNameInputChange}
                className="mb-2"
                required
            />
            <div className="w-full"> {/* Ensure the parent div takes the full width */}
                {/* Custom button styled as a label with margin and full width */}
                <label 
                    htmlFor="file-input" 
                    className="bg-accent text-white py-2 px-4 rounded cursor-pointer hover:bg-accent-dark block w-full text-center"  // Added block to ensure label stretches full width
                >
                    {formData.profile_image ? formData.profile_image.name : "Veldu mynd"}
                </label>

                {/* Hidden file input */}
                <input
                    id="file-input"
                    type="file"
                    name="profile_image"
                    onChange={handleProfileImageInputChange}
                    style={{ display: 'none' }} // Hide the default file input
                />
            </div>

            <Button type="submit" className="mt-2">Uppfæra</Button>
        </form>
    </div>
    );
}