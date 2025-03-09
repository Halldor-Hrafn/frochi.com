import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server";
import {create} from "node:domain";


export async function GET(req: NextRequest, res: NextResponse) {
    return NextResponse.json(await getAllPosts());
}

export async function POST(req: NextRequest, res: NextResponse) {
    const { heading, content, user_id } = await req.json();
    if (!heading || !content) {
        return new NextResponse(JSON.stringify({ error: "missing fields" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    await createPost(user_id, heading, content);

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
async function createPost(user_id: string, heading: string, contents: string) {
    const supabase = await createClient();
    const {data, error} = await supabase
        .from("posts")
        .insert([
            {
                heading: heading,
                contents: contents,
                owner_id: user_id
            }
        ]);

    if (error) {
        throw new Error(error.message);
    }
}