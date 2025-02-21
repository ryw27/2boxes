import { VoiceRecorder } from '@/components/voicerecorder';

import OutputBox from '@/components/outputbox';
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen space-x-2">
      <div className="container mx-auto p-4 mb-2">
        <VoiceRecorder/>
      </div>
      <div className="flex flex-1">
        <OutputBox/>
      </div>
    </div>
  )

}
