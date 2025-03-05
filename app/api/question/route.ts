import OpenAI from "openai";
import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server";

type ResponseData = {
    message: string | null
}

async function askQuestion(question: string, userId: string): Promise<string | null> {
    console.log("Creating OpenAI stuff");
    const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENROUTER_API_KEY
    });

    console.log("Asking question");
    const response = await openai.chat.completions.create({
        model: "cognitivecomputations/dolphin3.0-r1-mistral-24b:free",
        messages: [
            {
                role: "user",
                content: question
            }
        ]
    });

    const message = response.choices[0].message.content;
    console.log("Storing question");

    // Store the question in the database
    await storeQuestion(question, userId, message || "");

    console.log("Returning response");
    return response.choices[0].message.content;
}

async function storeQuestion(question: string, userId: string, message: string): Promise<void> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("chats")
        .insert([
            {
                message: question,
                user_id: userId,
                response: message
            }
        ]);

    if (error) {
        console.error(error);
    }
}

// export async function GET(req: NextRequest): Promise<NextResponse> {
//     console.log("Handling GET request");
//     const question = await req.nextUrl.searchParams.get("question");
//     const userId = await req.nextUrl.searchParams.get("userId");
//     const message = await askQuestion(question || "", userId || "");
//     return NextResponse.json({ message });
// }

export async function POST(req: NextRequest): Promise<NextResponse> {
    console.log("Handling POST request");
    const { question, userId } = await req.json();
    const message = await askQuestion(question, userId);
    return NextResponse.json({ message });
}
