'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, Square } from 'lucide-react';
// Removed pipeline import, it will be used in the worker
// import { pipeline } from '@xenova/transformers';

interface VoiceRecorderProps {
    updateInterval?: number; // Interval in ms to process audio chunks
    transcript: string;
    setTranscript: (transcript: string) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
    updateInterval = 5000, // Process audio every 5 seconds
    transcript,
    setTranscript
}) => {
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [isLoadingModel, setIsLoadingModel] = useState<boolean>(false); // Track model loading

    const worker = useRef<Worker | null>(null);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const audioChunks = useRef<Blob[]>([]);
    const intervalId = useRef<NodeJS.Timeout | null>(null); // To store interval ID for cleanup

    // Initialize the worker only once
    useEffect(() => {
        if (!worker.current) {
            console.log("Initializing worker...");
            worker.current = new Worker(new URL('../lib/worker.ts', import.meta.url), {
                type: 'module'
            });

            // Add listener for messages from the worker
            worker.current.onmessage = (event) => {
                const message = event.data;
                console.log("Message from worker:", message);

                switch (message.type) {
                    case 'model_loading':
                        setIsLoadingModel(true);
                        console.log("Model is loading...");
                        break;
                    case 'model_ready':
                        setIsLoadingModel(false);
                        console.log("Model ready.");
                        // If recording was started before model ready, start processing now
                        if (isRecording && mediaRecorder.current?.state === 'recording') {
                            startProcessingInterval();
                        }
                        break;
                    case 'transcription_result':
                        console.log("Transcription:", message.text);
                        setTranscript(transcript + " " + message.text);
                        break;
                    case 'error':
                        console.error("Worker error:", message.error);
                        setIsLoadingModel(false); // Stop loading indicator on error
                        // Optionally stop recording or notify user
                        break;
                    default:
                        console.warn("Unknown message type from worker:", message.type);
                }
            };

             // Handle worker errors
             worker.current.onerror = (error) => {
                console.error("Worker error:", error);
                setIsLoadingModel(false);
                // Optionally stop recording or notify user
            };
        }

        // Cleanup worker on component unmount
        return () => {
            console.log("Terminating worker...");
            worker.current?.terminate();
            worker.current = null;
            if (intervalId.current) {
                clearInterval(intervalId.current);
                intervalId.current = null;
            }
        };
    }, []); // Empty dependency array ensures this runs only once

    // Function to process audio chunk
    const processAudioChunk = useCallback(() => {
        if (audioChunks.current.length === 0 || !worker.current || isLoadingModel) {
            return; // Nothing to process or worker not ready
        }

        const audioBlob = new Blob(audioChunks.current, { type: mediaRecorder.current?.mimeType || 'audio/webm' });
        audioChunks.current = []; // Reset chunks

        console.log(`Processing audio chunk (${(audioBlob.size / 1024).toFixed(2)} KB)`);
        // Send audio data to the worker
         audioBlob.arrayBuffer().then(arrayBuffer => {
            const audio = new Uint8Array(arrayBuffer);
            worker.current?.postMessage({ type: 'transcribe', audio });
        }).catch(error => console.error("Error converting Blob to ArrayBuffer:", error));

    }, [isLoadingModel]); // Recreate if isLoadingModel changes


     // Start processing interval
    const startProcessingInterval = useCallback(() => {
        if (intervalId.current) clearInterval(intervalId.current); // Clear existing interval
        intervalId.current = setInterval(processAudioChunk, updateInterval);
        console.log(`Started processing interval (${updateInterval}ms)`);
    }, [processAudioChunk, updateInterval]);

    // Stop processing interval
    const stopProcessingInterval = useCallback(() => {
        if (intervalId.current) {
            clearInterval(intervalId.current);
            intervalId.current = null;
            console.log("Stopped processing interval.");
        }
    }, []);


    const startRecording = async () => {
        if (isLoadingModel) {
            console.warn("Model is still loading, please wait.");
            return; // Don't start if model is loading
        }
        if (!worker.current) {
             console.error("Worker not initialized.");
             return;
        }
        console.log("Attempting to start recording...");
        setIsRecording(true);
        audioChunks.current = []; // Clear previous chunks

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            // Determine supported mime type
             const mimeTypes = ['audio/webm;codecs=opus', 'audio/ogg;codecs=opus', 'audio/webm', 'audio/mp4'];
            let supportedMimeType = 'audio/webm'; // Default
            for (const type of mimeTypes) {
                if (MediaRecorder.isTypeSupported(type)) {
                    supportedMimeType = type;
                    break;
                }
            }
            console.log("Using MIME type:", supportedMimeType);

            mediaRecorder.current = new MediaRecorder(stream, { mimeType: supportedMimeType });

            mediaRecorder.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.current.push(event.data);
                    // console.log(`Audio chunk added (${(event.data.size / 1024).toFixed(2)} KB)`);
                }
            };

             mediaRecorder.current.onstop = () => {
                console.log("MediaRecorder stopped.");
                stopProcessingInterval(); // Stop the interval
                 processAudioChunk(); // Process any remaining audio
                // Clean up the stream tracks
                stream.getTracks().forEach(track => track.stop());
             };

            mediaRecorder.current.onerror = (event) => {
                 console.error("MediaRecorder error:", event);
                 setIsRecording(false);
                 stopProcessingInterval();
            }

            mediaRecorder.current.start(); // Start recording
             console.log("MediaRecorder started.");
            // Start processing interval only if model is ready
            if (!isLoadingModel) {
                 startProcessingInterval();
            }

        } catch (error) {
            console.error("Error accessing microphone:", error);
            setIsRecording(false); // Reset recording state on error
        }
    };

    const stopRecording = () => {
        console.log("Attempting to stop recording...");
        if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
            mediaRecorder.current.stop(); // This will trigger the onstop event
            console.log("Called mediaRecorder.stop()");
        } else {
             console.warn("MediaRecorder not recording or not initialized.");
        }
         setIsRecording(false); // Update state immediately
         // Interval is cleared in onstop handler now
    };

    const buttonText = isRecording ? 'Stop Recording' : (isLoadingModel ? 'Loading Model...' : 'Start Recording');
    const ButtonIcon = isRecording ? Square : Mic;


    return (
        <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isLoadingModel && !isRecording} // Disable start if loading, allow stop
            className={`flex py-3 px-5 gap-2 rounded-md text-white items-center justify-center transition-colors duration-200 ease-in-out
                    ${isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-blue-500 hover:bg-blue-600'}
                    ${isLoadingModel && !isRecording ? 'bg-gray-400 cursor-not-allowed' : ''}`}
        >
            <ButtonIcon size={20} /> {buttonText}
        </button>
    );
}

export default VoiceRecorder;