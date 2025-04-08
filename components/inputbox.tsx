import React, { useState } from 'react';

interface InputBoxProps {
    transcript: string;
    setTranscript: (transcript: string) => void;
    handleSummarize: () => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
}

export default function InputBox({ transcript, setTranscript, handleSummarize, isLoading, setIsLoading }: InputBoxProps) {
    return (

        <div className="flex flex-col w-full max-w-4xl mx-auto p-4 space-y-4 bg-white rounded-lg border-2 border-gray-200">
            <h2 className="text-xl font-bold">Summarizer</h2> 
                <textarea 
                    className="w-full p-2 border-2 border-gray-300 rounded-md min-h-[150px]"
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder="Enter text to summarize..."
                />
                
                <button 
                    onClick={handleSummarize}
                    disabled={isLoading || !transcript.trim()}
                    className={`py-2 px-4 rounded-md text-white ${isLoading || !transcript.trim() 
                        ? 'bg-gray-400' 
                        : 'bg-blue-500 hover:bg-blue-600'}`}
                >
                    {isLoading ? 'Processing...' : 'Summarize'}
                </button>
        </div>
    )
}