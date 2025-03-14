

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

  const [user, setUser] = useState<AuthUser & { username: string | null, profile_image: string} | null>(null);

  const supabase = createClient();

  useEffect(() => {
	const fetchUser = async () => {
	  const { error, data } = await supabase.auth.getUser();
	  
	  // If there's an error or no user, do nothing
	  if (error || !data) return;
	  
	  const userId = (await params).id || data.user.id; // Use params.id if provided, otherwise use logged-in user's ID
	  
	  // Fetch username and profile image for the user (either logged-in user or another user)
	  const username = await getUsernameFromId(userId);
	  const profile_image = await getProfileImageLinkFromId(userId);
  
	  // Set the user data (username, profile image, and the logged-in user's data)
	  setUser({
		...data.user,
		username,
		profile_image,
	  });
	};
  
	fetchUser();
  }, [supabase, params]);  // Depend on both supabase and params

  return (
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
			{children}
		</div>
	</div>
  );
}
