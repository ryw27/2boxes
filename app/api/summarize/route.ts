import { NextResponse } from 'next/server';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateText, streamText } from 'ai';
import { z } from 'zod';

export async function POST(req: Request) {
    try {
        const { text } = await req.json();
        
        if (!text || typeof text !== 'string') {
            return NextResponse.json(
                { error: 'Text is required' },
                { status: 400 }
            );
        }
        
        const openrouter = createOpenRouter({
            apiKey: process.env.OPENAI_API_KEY,
        });
        
        //         await streamText({
        //             model: openrouter('deepseek/deepseek-chat-v3-0324:free'),
        //             prompt: `
        //             Given the below brainstorming process, can you organize the thoughts into conceptual topics? Be sure to keep the original phrasing, but just add nested headings and subheadings.
        // :\n\n${text}`,
        //             onChunk: async (chunk) => {
        //                 if (chunk instanceof Uint8Array || chunk instanceof ArrayBuffer) {
        //                     const decoded = new TextDecoder().decode(chunk);
        //                     fullText += decoded;
        //                 } else {
        //                     console.error('Unexpected chunk type:', chunk);
        //                 }
        //             },
        //         });
        //         const stream = await streamText({
        //             model: openrouter('deepseek/deepseek-chat-v3-0324:free'),
        //             prompt: `
        //             Given the below brainstorming process, can you organize the thoughts into conceptual topics? Be sure to keep the original phrasing, but just add nested headings and subheadings.
        // :\n\n${text}`,
        //         });
        
        
        const { response } = await generateText({
            model: openrouter('deepseek/deepseek-chat-v3-0324:free'),
            prompt: `
      Given the below brainstorming process, can you organize the thoughts into conceptual topics? Be sure to keep the original phrasing, but just add nested headings and subheadings.
  :\n\n${text}`,
        }); 
        
        console.log('Full text:', response);
        return NextResponse.json({ response });
    } catch (error) {
        console.error('Error in summarize route:', error);
        return NextResponse.json(
            { error: 'Failed to summarize the text' },
            { status: 500 }
        );
    } 
}
