import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest): Promise<NextResponse> {
    const { id, username, auth_id } = await req.json();
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("users")
        .update({
            auth_id,
            username,
        })
        .eq("id", id)
        .select("*");

    if (error) {
        return NextResponse.json({
            error: "Something went wrong"
        }, {status: 500})
    }

    return NextResponse.json(data);
}