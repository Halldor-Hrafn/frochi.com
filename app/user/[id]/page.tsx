"use client";

import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { getProfileImageLinkFromId, getUsernameFromId } from "@/utils/supabase/user";
import { AuthUser } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import {cn} from "@/utils/utils";
import { redirect } from "next/navigation";


type ProfilePageProps = {
    params: Promise<{ id: string }>; // `params` is now a Promise in Next.js 13
  };


export default function Profile({ params }: ProfilePageProps) {
    const [user, setProfileData] = useState<{ username: string | null, profile_image: string } | null>(null);

    const supabase = createClient();

    useEffect(() => {
        const fetchProfile = async () => {
            const {data, error} = await supabase.auth.getUser();
            const { id } = await params;// Get the user ID from the URL params

            if (id == data.user?.id){
                redirect("/user")
            }

            // Fetch the profile data using the user ID
            const username = await getUsernameFromId(id);
            const profile_image = await getProfileImageLinkFromId(id);

            setProfileData({ username, profile_image });

        };
    
        fetchProfile();
      }, [params]);




    return (
        <div>
            <div className="max-w-7xl flex flex-col gap-12 items-start m-10">
                <div className="mx-auto text-center">
                    <div className="flex justify-center items-center">
                        <img 
                        src={user?.profile_image} 
                        alt="Profile Image" 
                        width="200px"
                        className="max-w-full rounded-[50%]"/>
                    </div>
                    <h2 className="text-2xl">{user?.username}</h2>
                </div>
            </div>
        </div>
    );
}
