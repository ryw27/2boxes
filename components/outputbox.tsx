'use client';
import React, { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import type { Element } from 'hast';

interface Props {
    output : string;    
    setOutput : (output : string) => void;
}

interface MarkdownNode extends Element {
    parent?: {
        type: string;
    };
}

export default function OutputBox({ output, setOutput } : Props) {
    
    // const [isLoading, setIsLoading] = useState(false);

    // const handleSummarize = async () => {
    //     if (!input.trim()) return;
        
    //     setIsLoading(true);
    //     try {
    //         const response = await fetch('/api/summarize', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ text: input }),
    //         });
            
    //         if (!response.ok) {
    //             throw new Error('Failed to summarize');
    //         }
            
    //         const data = await response.json();
    //         console.log(data.response.messages[0].content[0].text);
    //         setOutput(data.response.messages[0].content[0].text);
    //     } catch (error) {
    //         console.error('Error:', error);
    //         setOutput('Failed to process your request.');
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };
    useEffect(() => {
        console.log('output:', output);
    }, [output]);

    // Clean and format the markdown
    const cleanOutput = output
        .split('\n')
        .map(line => {
            // Fix bullet point indentation
            if (line.trim().startsWith('-')) {
                const leadingSpaces = line.match(/^\s*/)?.[0] || '';
                const indent = leadingSpaces.length;
                // Ensure proper indentation for nested lists
                if (indent >= 2) {
                    return '  ' + line.trim();
                }
                return line.trim();
            }
            return line;
        })
        .join('\n');

    return (
         <div> 
            {/* <h2 className="text-xl font-bold">Summarizer</h2> */}
            
            {/* <textarea 
                className="w-full p-2 border-2 border-gray-300 rounded-md min-h-[150px]"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter text to summarize..."
            />
            
            <button 
                onClick={handleSummarize}
                disabled={isLoading || !input.trim()}
                className={`py-2 px-4 rounded-md text-white ${isLoading || !input.trim() 
                    ? 'bg-gray-400' 
                    : 'bg-blue-500 hover:bg-blue-600'}`}
            >
                {isLoading ? 'Processing...' : 'Summarize'}
            </button> */}
        
            {output && (
                <div className="mt-4 p-4 border-2 border-gray-200 rounded-md bg-gray-50">
                    <div>
                        <h1 className="text-lg font-semibold mb-2">Summary:</h1>
                        <Markdown 
                            remarkPlugins={[remarkGfm]} 
                            rehypePlugins={[rehypeRaw]}
                            // components={{
                            //     ul: ({children}) => (
                            //         <ul className="space-y-1">{children}</ul>
                            //     ),
                            //     li: ({children}) => (
                            //         <li className="ml-4">{children}</li>
                            //     )
                            // }}
                        >
                            {cleanOutput}
                        </Markdown>
                    </div>
                </div>
            )}
        </div>
    );
}