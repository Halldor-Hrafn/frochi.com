import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
    const supabase = await createClient();
    const eventId = await req.nextUrl.searchParams.get("eventId")?.trim()

    const { data, error } = await supabase
        .from("messages")
        .select('*')
        .eq("event_id", eventId);

    if (error) {
        // code for invalid uuid syntax
        if (error.code === '22P02') {
            return NextResponse.json({
                error: "Invalid uuid"
            }, { status: 400 });
        }

        return NextResponse.json({
            error: "Something went wrong"
        }, { status: 500 });
    }

    if (!data.length) {
        return NextResponse.json({ message: "Event not found" }, { status: 404 })
    }
    return NextResponse.json(data);
}


export async function POST(req: NextRequest): Promise<NextResponse> {

    const supabase = await createClient();
    const { event_id, message } = await req.json();
    if (!event_id || !message) {
        return NextResponse.json(
            { error: "Missing data" },
            { status: 400 }
        );
    }

    const { data, error } = await supabase.auth.getUser();

    console.log(error)
    if (error) {
        if (error.status === 400) {
            return NextResponse.json({
                error: "Not authenticated"
            }, { status: 401 });
        }

        return NextResponse.json({
            error: "Something went wrong"
        }, { status: 500 });
    }

    const user = data.user;

    if (!user) {
        return NextResponse.json(
            { error: "Not authenticated" },
            { status: 401 }
        );
    }

    const { data: msgdata, error: msgerror } = await supabase
        .from("messages")
        .insert([
            {
                owner_id: user.id,
                event_id: event_id,
                message: message,
            }
        ])
        .select();

    if (msgerror) {
        return NextResponse.json({
            error: "Something went wrong"
        }, { status: 500 });
    }

    return NextResponse.json(msgdata[0]);
}