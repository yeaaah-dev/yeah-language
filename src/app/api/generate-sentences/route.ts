import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { unit } = await req.json();

    const prompt = `
      Genrete 6 sentences in english on the subject below and return only json array of sentences:
      ${unit}
  
      A example: 
      [
        {
          id: uuidV4(),
          english: 'sentence in english',
          portuguese: 'sentence in portuguese',
          randomEnglish: radom sentence in english,
          randomPortuguese: radom sentence in portuguese,
        }
      ]
    `.trim();

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: false,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    console.log(response);

    return NextResponse.json(
      JSON.parse(response.choices[0].message.content || "")
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json("", { status: 500 });
  }
}
