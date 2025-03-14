import {NextRequest, NextResponse} from "next/server";
import {createClient} from "@/utils/supabase/server";

export async function PATCH(req: NextRequest): Promise<NextResponse> {
    try {
        const { name } = await req.json(); // We don't need auth_id if it's not provided
        const supabase = await createClient();
        // Ensure the required fields are provided
        if (!name) {
            return NextResponse.json(
                { error: "Missing required fields: id and name" },
                { status: 400 }
            );
        }

        const {data: userData, error: userError} = await supabase.auth.getUser();

        if (userError || !userData.user) {
            console.error(userError);
            return NextResponse.json({error:"Smth went ronn:" + userError?.message}, {status: 500});
        }
    
        const uid = userData.user.id;

        // Update the name in the users table
        const { data, error } = await supabase
            .from("users")
            .update({
                name,
            })
            .eq("auth_id", uid)
            .select("*");
        
        // Handle errors from Supabase
        if (error) {
            return NextResponse.json(
                { error: error.message || "Something went wrong" },
                { status: 500 }
            );
        }

        // Return the updated data
        console.log(data[0])
        return NextResponse.json(data[0], { status: 200 });
    } catch (error: any) {
        // Catch any unexpected errors
        console.log(error)
        return NextResponse.json(
            { error: error.message || "An unexpected error occurred" },
            { status: 500 }
        );
    }
}
