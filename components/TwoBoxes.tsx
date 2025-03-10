'use client';
import React, { useState, useRef, useEffect }  from 'react';
import VoiceRecorder from './voicerecorder';
import OutputBox from './outputbox';

export default function TwoBoxes() {
    const [transcript, setTranscript] = useState<string>("");
    const [summary, setSummary] = useState<string>("");

    useEffect(() => {
        if (transcript.trim()) {
            const timeoutId = setTimeout(() => {
                summarize();
            }, 3000);
            return () => clearTimeout(timeoutId);
        }
    }, [transcript]);

    const summarize = () => {
        // const response = await fetch('/api/summarize', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ transcript: transcript })
        // });

        // if (response.ok) {
        //     const result = await response.json();
        //     setSummary(result.data);
        // } else {
        //     console.error('Failed to summarize content');
        // }
        console.log("transcript: ", transcript);
        setSummary(transcript);
        console.log("summarizing: ", summary);
    }

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTranscript(e.target.value);
        console.log(transcript);
    };

    return (
        <div>
            <div className="flex flex-col max-w-4xl rounded-lg border-2 border-gray-200 
                            container mx-auto p-8 mb-2 bg-white space-y-2">
                <h1 className="font-bold text-6xl mb-8">
                    2 Boxes!!!!!
                </h1>        
                <p className="text-gray-700 text-4xl">
                    Input Box 
                </p>
                <div className="flex flex-col justify-center items-center gap-6 my-4"> 
                    <VoiceRecorder
                        transcript={transcript}
                        setTranscript={setTranscript}
                        updateInterval={30000}
                    />
                    <textarea
                        placeholder="Or type!"
                        value={transcript}
                        onChange={handleTextareaChange}
                        className="bg-white text-black border border-gray-700 w-full p-2 rounded-md resize-y"
                        onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = `${target.scrollHeight}px`;
                        }}
                    />
                </div>
                <div className="flex flex-col">
                    <p className="text-4xl mt-6">Output Box</p>
                    <OutputBox 
                        initialText={summary}
                        text={summary}
                        setText={setSummary}
                    />
                </div>
            </div>
        </div>
    );
}
