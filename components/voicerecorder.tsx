'use client';
import React, { useState, useRef, useEffect }  from 'react';
import { Mic } from 'lucide-react';
import { pipeline } from '@xenova/transformers';

interface VoiceRecorderProps {
    updateInterval?: number;
}
const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ 
    updateInterval = 30000 
}) => {
    const [transcript, setTranscript] = useState<string>('');
    const [isRecording, setIsRecording] = useState<boolean>(false);

    const whisper = useRef<any>(null);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const audioChunks = useRef<Blob[]>([]);
    
    // useEffect (() => {
    //     const loadmodel = async () => {
    //         whisper.current = new Worker(new URL('./worker.ts', import.meta.url), {
    //             type: 'module'
    //         });
    //         // whisper.current = await pipeline('automatic-speech-recognition','openai/whisper-small');
    //     }
    //     loadmodel();
    // }, [])

    // Using web workers
    useEffect (() => {
        if (!whisper.current) {
            whisper.current = new window.Worker(new URL('../lib/worker.ts', import.meta.url)), {
                type: 'module'
            };
        }
    })

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({audio : true});
            mediaRecorder.current = new MediaRecorder(stream);
            mediaRecorder.current.ondataavailable = async (e) => {
                audioChunks.current.push(e.data);
            }
            mediaRecorder.current.start; 
            setInterval(() => {
                const audioBlob = new Blob(audioChunks.current, {type: 'audio/mpeg'})
                audioChunks.current = [] //reset to empty
                processAudio(audioBlob);
            }, updateInterval)
            setIsRecording(true);
        } catch (error) {
            console.error("Error: ", error);
        }
    }

    const processAudio = async (audioBlob : Blob) => {
        //todo
        if (whisper.current) {
            try {
                const audioArray = await audioBlob.arrayBuffer();
                const output = await whisper.current({
                    audio: new Uint8Array(audioArray),
                    language: "english"
                });
                setTranscript((prev) => {
                    const newTranscript = prev + " " + (output.text);
                    return newTranscript;
                }); 

            } catch (error) {
                console.error("Error in transcribing audio", error);
            }
       } else {
            console.error("Whisper not loaded");
        }

    }

    const stopRecording = () => {
        if (mediaRecorder.current) {
            mediaRecorder.current.stop();
            setIsRecording(false);
            const audioBlob = new Blob(audioChunks.current, {type: 'audio/mpeg'})
            audioChunks.current = [] //reset to empty
            processAudio(audioBlob);
        }
    }

    return (
        <button onClick={isRecording ? stopRecording : startRecording} 
            className={`flex py-3 px-5 gap-4 rounded-md text-white 
                    bg-red-400 items-center justify-center ${isRecording ? 'animate-pulse' : ''}`}>
            <Mic/> Start Recording 
        </button>
    );
}

export default VoiceRecorder