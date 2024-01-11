import { useState, useRef } from 'react';
import { HiMicrophone } from 'react-icons/hi2';
import { apiURL } from '../../lib/onmachina.js';
import { formatDateForFilename } from '../../lib/utils';

const mimeType = 'audio/webm';

const AudioRecorder = ({ containerName, accountID, authToken }) => {
  const [permission, setPermission] = useState(false);

  const mediaRecorder = useRef(null);

  const [recordingStatus, setRecordingStatus] = useState('inactive');

  const [stream, setStream] = useState(null);

  const [audio, setAudio] = useState(null);

  const [audioChunks, setAudioChunks] = useState([]);

  const getMicrophonePermission = async () => {
    if ('MediaRecorder' in window) {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setPermission(true);
        setStream(mediaStream);
      } catch (err) {
        alert(err.message);
      }
    } else {
      alert('The MediaRecorder API is not supported in your browser.');
    }
  };

  const startRecording = async () => {
    setRecordingStatus('recording');
    const media = new MediaRecorder(stream, { type: mimeType });

    mediaRecorder.current = media;

    mediaRecorder.current.start();

    let localAudioChunks = [];

    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === 'undefined') return;
      if (event.data.size === 0) return;
      localAudioChunks.push(event.data);
    };

    setAudioChunks(localAudioChunks);
  };

  const stopRecording = () => {
    setRecordingStatus('inactive');
    mediaRecorder.current.stop();

    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      const audioUrl = URL.createObjectURL(audioBlob);

      setAudio(audioUrl);

      setAudioChunks([]);

      uploadAudio(audioBlob);
    };
  };

  const uploadAudio = (audioBlob) => {
    const dateString = formatDateForFilename(new Date());

    let xhr = new XMLHttpRequest();
    xhr.open('PUT', `${apiURL}/${accountID}/${containerName}/audio-${dateString}.webm`, true);
    xhr.setRequestHeader('Content-Type', mimeType);
    xhr.setRequestHeader('x-auth-token', authToken);
    xhr.setRequestHeader('X-Object-Meta-Pipeline', 'audio-translate');
    xhr.addEventListener(
      'progress',
      (e) => {
        var percent = Math.round((e.loaded / e.total) * 100);
        console.log('progress uploading...', percent);
      },
      false,
    );
    xhr.addEventListener(
      'load',
      (e) => {
        console.log('upload complete');
      },
      false,
    );
    // xhr.addEventListener('error', ErrorHandler, false);
    // xhr.addEventListener('abort', AbortHandler, false);
    xhr.send(audioBlob);
  };

  return (
    <div>
      <div className="audio-controls grid p-8 place-items-center">
        {!permission ? (
          <button onClick={getMicrophonePermission} type="button">
            Get Microphone
          </button>
        ) : null}
        {permission && recordingStatus === 'inactive' ? (
          <button
            onClick={startRecording}
            type="button"
            className="border border-blue-200 aspect-square rounded-full p-8"
          >
            <HiMicrophone size={30} />
          </button>
        ) : null}
        {recordingStatus === 'recording' ? (
          <button
            onClick={stopRecording}
            type="button"
            className="border border-red-500 aspect-square rounded-full p-8 text-red-500"
          >
            <HiMicrophone size={30} />
          </button>
        ) : null}
      </div>
      {/* {audio ? (
        <div className="audio-player">
          <audio src={audio} controls></audio>
          <a download href={audio}>
            Download Recording
          </a>
        </div>
      ) : null} */}
    </div>
  );
};

export default AudioRecorder;
