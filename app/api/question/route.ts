import OpenAI from "openai";
import { type NextRequest, NextResponse } from 'next/server';

type ResponseData = {
    message: string | null
}

async function askQuestion(question: string): Promise<string | null> {
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

    console.log("Returning response");
    return response.choices[0].message.content;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
    const query = await req.nextUrl.searchParams.get("question");
    const message = await askQuestion(query || "");
    return NextResponse.json({ message });
}
