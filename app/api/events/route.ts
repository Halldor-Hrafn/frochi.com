import {NextRequest, NextResponse } from "next/server";
import {createClient} from "@/utils/supabase/server";


export async function GET(req: NextRequest): Promise<NextResponse> {
    const eventId = await req.nextUrl.searchParams.get("eventId")?.trim()

    const supabase = await createClient();

    if (eventId) {
        const {error, data} = await supabase
            .from("events")
            .select("*")
            .eq("id", eventId);

        if (error) {
            // code for invalid uuid syntax
            console.error(error);
            if (error.code === '22P02') {
                return NextResponse.json({
                    error: "Invalid uuid"
                }, {status: 400});
            }

            return NextResponse.json({
                error: "Something went wrong"
            }, {status: 500});
        }

        const evt = data[0];
        if (!evt) {
            return NextResponse.json({message: "Event not found"}, {status: 404})
        }
        return NextResponse.json(evt);
    }

    const {error, data} = await supabase
        .from("events")
        .select("*")

    if (error) {
        return NextResponse.json({
            error: "Something went wrong"
        }, {status: 500})
    }

    return NextResponse.json(data);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    const { title, start_date, end_date, owner_id, description, lat, lng, icon } = await req.json();
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("events")
        .insert([
            {
                title,
                start_date,
                end_date,
                owner_id,
                description,
                lat,
                lng,
                icon
            }
        ]);

    if (error) {
        return NextResponse.json({
            error: "Something went wrong"
        }, {status: 500})
    }

    return NextResponse.json(data);
}

export async function PATCH(req: NextRequest): Promise<NextResponse> {
    const { id, title, start_date, end_date, description, lat, lng, icon } = await req.json();
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("events")
        .update({
            title,
            start_date,
            end_date,
            description,
            lat,
            lng,
            icon
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

export async function DELETE(req: NextRequest): Promise<NextResponse> {
    const eventId = await req.json();
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId);

    if (error) {
        return NextResponse.json({
            error: "Something went wrong"
        }, {status: 500})
    }

    return NextResponse.json(data);
}
