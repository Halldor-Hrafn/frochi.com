import {NextRequest, NextResponse} from "next/server";
import {createClient} from "@/utils/supabase/server";

export async function PATCH(req: NextRequest): Promise<NextResponse> {
    try {
        const { name, profile_image_link } = await req.json();
        const supabase = await createClient();
        const {data: userData, error: userError} = await supabase.auth.getUser();

        if (userError || !userData.user) {
            console.error(userError);
            return NextResponse.json({error:"Smth went ronn:" + userError?.message}, {status: 500});
        }

        const uid = userData.user.id;







        
        if (name) {
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
            
        }


        if (profile_image_link) {
            const { data, error } = await supabase
                .from("users")
                .update({
                    profile_image_link,
                })
                .eq("auth_id", uid)
                .select("*");
                
            if (error) {
                return NextResponse.json(
                    { error: error.message || "Something went wrong" },
                    { status: 500 }
                );
            }else{
                return NextResponse.json(data ? data : "", { status: 200 });
            }
    

        }


        return NextResponse.json({}, {status: 200})
    } catch (error: any) {
        // Catch any unexpected errors
        console.log(error)
        return NextResponse.json(
            { error: error.message || "An unexpected error occurred" },
            { status: 500 }
        );
    }
}
