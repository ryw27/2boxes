'use client';
import React, { useState } from 'react';
// import { createOpenRouter } from '@openrouter/ai-sdk-provider';
// import { streamText } from 'ai';

export default function OutputBox() {
    
    const [isLoading, setIsLoading] = useState(false);

    const handleSummarize = async () => {
        if (!input.trim()) return;
        
        setIsLoading(true);
        try {
            const response = await fetch('/api/summarize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: input }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to summarize');
            }
            
            const data = await response.json();
            console.log(data.response.messages[0].content[0].text);
            setOutput(data.response.messages[0].content[0].text);
        } catch (error) {
            console.error('Error:', error);
            setOutput('Failed to process your request.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col w-full max-w-4xl mx-auto p-4 space-y-4 bg-white rounded-lg border-2 border-gray-200">
            <h2 className="text-xl font-bold">Summarizer</h2>
            
            <textarea 
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
            </button>
            
            {output && (
                <div className="mt-4 p-4 border-2 border-gray-200 rounded-md bg-gray-50">
                    <h3 className="text-lg font-semibold mb-2">Summary:</h3>
                    <p>{output}</p>
                </div>
            )}
        </div>
    );
}