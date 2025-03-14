import {NextRequest, NextResponse } from "next/server";
import {createClient} from "@/utils/supabase/server";

/**
 * @returns [
 *   {
 *     id: 2,
 *     created_at: '2025-03-14T11:50:58.184754+00:00',
 *     user_id: 'f9466e20-dc88-4e39-aa1a-2d6ab67d2965',
 *     event_id: '07593c78-8214-47e4-80fd-9b731d58232d'
 *   }
 * ]
 */
async function getEventParticipants(eventId: string): Promise<any> {
    const supabase = await createClient();

    const {data, error} = await supabase
        .from("event_users")
        .select("*", {count: 'exact'})
        .eq('event_id', eventId);

    if (error) {
        return [];
    }

    return data;
}

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
        evt.participants = await getEventParticipants(eventId);
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

    return NextResponse.json(
        await Promise.all(data.map(async evt => {
            return {
                ...evt,
                participants: await getEventParticipants(evt.id)
            }
        }))
    );
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
        console.log(error);
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
