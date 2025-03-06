import  VoiceRecorder from '@/components/voicerecorder';

import OutputBox from '@/components/outputbox';
export default function Home() {
  return (
    <div className="flex flex-col space-y-2 p-8">
      <div className="flex flex-col max-w-4xl rounded-lg border-2 border-gray-200 
                      container mx-auto p-8 mb-2 bg-white space-y-2">
        <h1 className="font-bold text-2xl">
          2 Boxes!!!!!
        </h1>        
        <p className="text-gray-700">
          Record 
        </p>
        <div className="flex justify-center items-center"> 
          <VoiceRecorder/>
        </div>
      </div>
      <div className="flex bg-gray-500">
        <OutputBox/>
      </div>
    </div>
  )

}
