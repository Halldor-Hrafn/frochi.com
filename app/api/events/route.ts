import {NextRequest, NextResponse} from "next/server";
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