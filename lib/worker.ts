import { env, pipeline } from '@xenova/transformers';

// Disable local models
env.allowLocalModels = false

self.addEventListener('message', async (event) => {
    const model = await pipeline('automatic-speech-recognition','openai/whisper-small', {
        progress_callback: async (progress:any) => {
            console.log("Progresss: ", progress); 
        }
    });

    const output = await model(event.data.text);

    self.postMessage({
        status: 'complete',
        output: output
    })
});
