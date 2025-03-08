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

async function getMessages(userId: string): Promise<string> {
    // IMPORTANT: This fetch request only works if RLS is disabled
    // So a policy needs to be made that actually works with this
    // Otherwise, other users might be able to see other people's messages
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("chats")
        .select("message, response")
        .eq("user_id", userId);

    if (error) {
        console.error(error);
        return "";
    }

    // IMPORTANT: Change this so that is returns a JSON object instead of an incredibly long string because that is extremely stupid
    // This is just a really """temporary""" solution (please be a temporary solution)

    return data.map((chat: any) => `${chat.message} - ${chat.response}`).join("\n");
}

export async function GET(req: NextRequest): Promise<NextResponse> {
    // Why tf did I put so many log statements
    console.log("Handling GET request");
    // anyways this fetches the query and trims it in case for some reason a space is within it
    const userId = await req.nextUrl.searchParams.get("userId")?.trim();
    // got to remove this log statement
    console.log(userId);
    // then fetches the messages
    const messages = await getMessages(userId || "");
    // and then returns it
    return NextResponse.json({ messages });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    console.log("Handling POST request");
    const { question, userId } = await req.json();
    const message = await askQuestion(question, userId);
    return NextResponse.json({ message });
}
