import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server";
import {create} from "node:domain";


export async function GET(req: NextRequest): Promise<NextResponse> {
    return NextResponse.json(await getAllPosts());
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    const { heading, content, user_id, image_url } = await req.json();
    if (!heading || !content || !user_id) {
        return new NextResponse(JSON.stringify({ error: "missing fields" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    await createPost(user_id, heading, content, image_url);

    return NextResponse.json({message: "ye"})
}


async function getAllPosts() {
    const supabase = await createClient();
    const {data, error} = await supabase
        .from("posts")
        .select('*')
        .order("created_at", {ascending: false});

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

// this is obv insecure asf since user id is never validated, so u can upload as any user
async function createPost(user_id: string, heading: string, contents: string, image_url: string | null): Promise<void> {
    const supabase = await createClient();
    const {data, error} = await supabase
        .from("posts")
        .insert([
            {
                heading: heading,
                contents: contents,
                owner_id: user_id,
                image_url: image_url
            }
        ]);

    if (error) {
        throw new Error(error.message);
    }
}