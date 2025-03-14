import {NextRequest, NextResponse} from "next/server";
import {createClient} from "@/utils/supabase/server";


export async function POST(req: NextRequest): Promise<NextResponse> {
    const supabase = await createClient();
    const body = await req.json();
    const { event_id } = body;

    const {data, error} = await supabase.auth.getUser();

    if (error || !data.user) {
        console.error(error);
        return NextResponse.json({error:"Smth went ronn:" + error?.message}, {status: 500});
    }

    const uid = data.user.id;

    const {data: insertData, error: insertError} = await supabase
        .from('event_users')
        .insert(
            [
                {
                    user_id: uid,
                    event_id: event_id,
                }
            ]
        ).select();

    if (insertError) {
        console.error(error);
        return NextResponse.json({error: "Failed to join"}, {status: 500})
    }


    return NextResponse.json({message: "success"});
}