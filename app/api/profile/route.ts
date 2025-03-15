import {NextRequest, NextResponse} from "next/server";
import {createClient} from "@/utils/supabase/server";

export async function PATCH(req: NextRequest): Promise<NextResponse> {
    try {
        const { name, profile_image } = await req.json();
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


        console.log(profile_image)
        if (profile_image) {
            const fileExt = profile_image.name
            const fileName = `profile.${fileExt}`;
            const filePath = `${userData.user.id}/${fileName}`
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from("profile-images") 
              .upload(filePath, profile_image, {
                  cacheControl: '3600',  
                  upsert: true
              });
      
            if (uploadError) {
              console.error("Upload Error:", uploadError);
              return NextResponse.json(
                { error: "Failed to upload image." },
                { status: 500 }
              );
            }
        }

        // Update the name in the users table
        const { data, error } = await supabase
            .from("users")
            .update({
                name,
                profile_image,
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
