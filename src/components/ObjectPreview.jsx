import { useEffect, useRef, useState } from 'react';
import FileIcon from '../assets/file-icon.svg';
import useOnClickOutside from '../hooks/useOnClickOutside';
import LoadingPreviewGraphic from './LoadingPreviewGraphic';

export default function ObjectPreview({ accountId, authKey, objectData, container, object }) {
  const fileType = objectData.find((obj) => obj.name === 'content-type').value;
  const ref = useRef();
  const [isLoaded, setIsLoaded] = useState(false);
  const [transcript, setTranscript] = useState('');
  useOnClickOutside(ref, () => navigate(`/${container}`));

  useEffect(() => {
    const previewAudio = document.querySelector('#audio-controls');
    const fetchAudio = async () => {
      const response = await fetch(`https://api.testnet.onmachina.io/v1/${accountId}/${container}/${object}`, {
        method: 'GET',
        headers: {
          'x-auth-token': authKey,
        },
      });
      // Create an object URL from the data.
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      // Set the image src to the object URL.
      previewAudio.src = objectUrl;
      setIsLoaded(true);
    };

    const fetchTranscript = async () => {
      const noExtension = object.replace(/\.[^/.]+$/, '');
      const jsonFilename = noExtension + '.json';

      const response = await fetch(`https://api.testnet.onmachina.io/v1/${accountId}/${container}/${jsonFilename}`, {
        method: 'GET',
        headers: {
          'x-auth-token': authKey,
        },
      });
      const transcript = await response.json();
      setTranscript(transcript?.text);
    };

    fetchAudio();
    fetchTranscript();
  }, [object]);

  return (
    <div>
      {!isLoaded && <LoadingPreviewGraphic />}
      <audio src="" controls id="audio-controls" className={`mx-auto mb-4 ${isLoaded ? 'block' : 'hidden'}`}></audio>
      {transcript && <div className="text-center mb-4">"{transcript}"</div>}
    </div>
  );
}
