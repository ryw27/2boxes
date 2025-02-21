'use client';
import React, { useState, useRef, useEffect }  from 'react';
import { Mic } from 'lucide-react' 
import { pipeline } from '@huggingface/transformers';

interface VoiceRecorderProps {
    updateInterval?: number;
}
export const VoiceRecorder = ({
    updateInterval = 30000
}: VoiceRecorderProps) => {
    const [transcription, setTranscription] = useState<string>('');
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const whisper = useRef<any>(null);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const audioChunks = useRef<Blob[]>([]);
    
    useEffect (() => {
        const loadmodel = async () => {
            whisper.current = await pipeline('automatic-speech-recognition','openai/whisper-small');
        }
        loadmodel();
    }, [])

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({audio : true});
            mediaRecorder.current = new MediaRecorder(stream);
            mediaRecorder.current.ondataavailable = async (e) => {
                audioChunks.current.push(e.data);
            }
            mediaRecorder.current.start; 
            setInterval(() => {
               //todo 
            })
            setIsRecording(true);
        } catch (error) {
            console.error("Error: ", error);
        }
    }
    const processAudio = async () => {
        //todo
    }
    const stopRecording = () => {
        if (mediaRecorder.current) {
            mediaRecorder.current.stop();
            //todo
        }
    }

    return (
        <div className="rounded-md bg-red-400">
            <button onClick={isRecording ? stopRecording : startRecording} 
                className={`rounded-full bg-red-400 items-center justify-center ${isRecording ? 'animate-pulse' : ''}`}>
                    <Mic/>
                </button>
        </div>
    );
}