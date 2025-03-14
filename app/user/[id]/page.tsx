
"use client";

import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { getProfileImageLinkFromId, getUsernameFromId } from "@/utils/supabase/user";
import { AuthUser } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

type PageProps = {
    params: Promise<{ id: string }>;
};

export default function Profile({ params }: PageProps) {



    return (
        <div>
                
        </div>
    );
}
