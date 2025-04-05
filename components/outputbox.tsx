'use client';
import React, { useState } from 'react';
// import { createOpenRouter } from '@openrouter/ai-sdk-provider';
// import { streamText } from 'ai';

export default function OutputBox() {
    const [input, setInput] = useState<string>(`
        I am happy to join with you today in what will go down in history as the greatest demonstration for freedom in the history of our nation.

Five score years ago, a great American, in whose symbolic shadow we stand today, signed the Emancipation Proclamation. This momentous decree came as a great beacon light of hope to millions of Negro slaves who had been seared in the flames of withering injustice. It came as a joyous daybreak to end the long night of their captivity.

But one hundred years later, the Negro still is not free. One hundred years later, the life of the Negro is still sadly crippled by the manacles of segregation and the chains of discrimination. One hundred years later, the Negro lives on a lonely island of poverty in the midst of a vast ocean of material prosperity. One hundred years later, the Negro is still languished in the corners of American society and finds himself an exile in his own land. And so we've come here today to dramatize a shameful condition.

In a sense we've come to our nation's capital to cash a check. When the architects of our republic wrote the magnificent words of the Constitution and the Declaration of Independence, they were signing a promissory note to which every American was to fall heir. This note was a promise that all men, yes, black men as well as white men, would be guaranteed the "unalienable Rights" of "Life, Liberty and the pursuit of Happiness." It is obvious today that America has defaulted on this promissory note, insofar as her citizens of color are concerned. Instead of honoring this sacred obligation, America has given the Negro people a bad check, a check which has come back marked "insufficient funds."

But we refuse to believe that the bank of justice is bankrupt. We refuse to believe that there are insufficient funds in the great vaults of opportunity of this nation. And so, we've come to cash this check, a check that will give us upon demand the riches of freedom and the security of justice.

We have also come to this hallowed spot to remind America of the fierce urgency of Now. This is no time to engage in the luxury of cooling off or to take the tranquilizing drug of gradualism. Now is the time to make real the promises of democracy. Now is the time to rise from the dark and desolate valley of segregation to the sunlit path of racial justice. Now is the time to lift our nation from the quicksands of racial injustice to the solid rock of brotherhood. Now is the time to make justice a reality for all of God's children.

It would be fatal for the nation to overlook the urgency of the moment. This sweltering summer of the Negro's legitimate discontent will not pass until there is an invigorating autumn of freedom and equality. Nineteen sixty-three is not an end, but a beginning. And those who hope that the Negro needed to blow off steam and will now be content will have a rude awakening if the nation returns to business as usual. And there will be neither rest nor tranquility in America until the Negro is granted his citizenship rights. The whirlwinds of revolt will continue to shake the foundations of our nation until the bright day of justice emerges.`);
    const [output, setOutput] = useState('');
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