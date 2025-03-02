import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { NextResponse } from 'next/server';

type ResponseData = {
    message: string | null
}

async function askQuestion(): Promise<string | null> {
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
                content: "What is the meaning of life?"
            }
        ]
    });

    console.log("Returning response");
    return response.choices[0].message.content;
}

export async function GET() {
    const message = await askQuestion();
    return NextResponse.json({ message });
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
