'use client';
import React, { useState, useRef, useEffect }  from 'react';
import VoiceRecorder from './voicerecorder';
import OutputBox from './outputbox';

export default function TwoBoxes() {
    const [transcript, setTranscript] = useState<string>(
        `        
        I am happy to join with you today in what will go down in history as the greatest demonstration for freedom in the history of our nation.

Five score years ago, a great American, in whose symbolic shadow we stand today, signed the Emancipation Proclamation. This momentous decree came as a great beacon light of hope to millions of Negro slaves who had been seared in the flames of withering injustice. It came as a joyous daybreak to end the long night of their captivity.

But one hundred years later, the Negro still is not free. One hundred years later, the life of the Negro is still sadly crippled by the manacles of segregation and the chains of discrimination. One hundred years later, the Negro lives on a lonely island of poverty in the midst of a vast ocean of material prosperity. One hundred years later, the Negro is still languished in the corners of American society and finds himself an exile in his own land. And so we've come here today to dramatize a shameful condition.

In a sense we've come to our nation's capital to cash a check. When the architects of our republic wrote the magnificent words of the Constitution and the Declaration of Independence, they were signing a promissory note to which every American was to fall heir. This note was a promise that all men, yes, black men as well as white men, would be guaranteed the "unalienable Rights" of "Life, Liberty and the pursuit of Happiness." It is obvious today that America has defaulted on this promissory note, insofar as her citizens of color are concerned. Instead of honoring this sacred obligation, America has given the Negro people a bad check, a check which has come back marked "insufficient funds."

But we refuse to believe that the bank of justice is bankrupt. We refuse to believe that there are insufficient funds in the great vaults of opportunity of this nation. And so, we've come to cash this check, a check that will give us upon demand the riches of freedom and the security of justice.

We have also come to this hallowed spot to remind America of the fierce urgency of Now. This is no time to engage in the luxury of cooling off or to take the tranquilizing drug of gradualism. Now is the time to make real the promises of democracy. Now is the time to rise from the dark and desolate valley of segregation to the sunlit path of racial justice. Now is the time to lift our nation from the quicksands of racial injustice to the solid rock of brotherhood. Now is the time to make justice a reality for all of God's children.

It would be fatal for the nation to overlook the urgency of the moment. This sweltering summer of the Negro's legitimate discontent will not pass until there is an invigorating autumn of freedom and equality. Nineteen sixty-three is not an end, but a beginning. And those who hope that the Negro needed to blow off steam and will now be content will have a rude awakening if the nation returns to business as usual. And there will be neither rest nor tranquility in America until the Negro is granted his citizenship rights. The whirlwinds of revolt will continue to shake the foundations of our nation until the bright day of justice emerges.
    `
    );
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
