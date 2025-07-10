'use client';

import { useEffect, useRef, useState } from 'react';

interface CameraModalProps {
  onClose: () => void;
  onCapture: (file: File) => void;
  mode?: 'photo' | 'video';
}

export default function CameraModal({ onClose, onCapture, mode = 'photo' }: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);
  const [chunks, setChunks] = useState<Blob[]>([]);

  useEffect(() => {
    (async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: mode === 'video',
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    })();

    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [mode]);

  const takePhoto = () => {
    const canvas = document.createElement('canvas');
    const video = videoRef.current!;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
        onCapture(file);
        onClose();
      }
    }, 'image/jpeg');
  };

  const startRecording = () => {
    const mediaRecorder = new MediaRecorder(streamRef.current!, { mimeType: 'video/webm' });
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.ondataavailable = (e) => setChunks((prev) => [...prev, e.data]);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const file = new File([blob], `video-${Date.now()}.webm`, { type: 'video/webm' });
      onCapture(file);
      onClose();
    };
    mediaRecorder.start();
    setChunks([]);
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
      <div className="bg-gray-900 rounded-lg p-4 relative max-w-md w-full">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-auto rounded"
        />
        <div className="flex justify-between mt-4">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded text-sm"
          >
            Cancel
          </button>

          {mode === 'photo' ? (
            <button
              onClick={takePhoto}
              className="bg-green-500 text-white px-4 py-2 rounded text-sm"
            >
              Capture Photo
            </button>
          ) : recording ? (
            <button
              onClick={stopRecording}
              className="bg-yellow-500 text-white px-4 py-2 rounded text-sm"
            >
              Stop Recording
            </button>
          ) : (
            <button
              onClick={startRecording}
              className="bg-blue-500 text-white px-4 py-2 rounded text-sm"
            >
              Start Recording
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
