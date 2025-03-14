

"use client";

import { createClient } from "@/utils/supabase/client";
import { getProfileImageLinkFromId, getUsernameFromId } from "@/utils/supabase/user";
import { AuthUser } from "@supabase/supabase-js";
import { ReactNode, useEffect, useState } from "react";
import toast from "react-hot-toast";

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ id: string }>; // Profile ID from URL params
};

export default function Layout({
  children, params
}: LayoutProps) {

  const [user, setUser] = useState<AuthUser & { username: string | null, profile_image: string | null} | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
        const { error, data } = await supabase.auth.getUser();
        if (data && !error) {
            const userId = data.user?.id;
            const username = userId ? await getUsernameFromId(userId) : null;
            const profile_image = userId ? await getProfileImageLinkFromId(userId) 
                         : "https://emqvjwtowgujddqurtnb.supabase.co/storage/v1/object/public/profile-images//default_profile_image.png";
            setUser({ ...data.user, username, profile_image });
        }
    };

      fetchUser();
  }, [supabase]);

  return (
    <div className="max-w-7xl flex flex-col gap-12 items-start m-10">
      <div><p>{user?.username}</p></div>
      {children}
    </div>
  );
}
