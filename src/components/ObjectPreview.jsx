import { useEffect, useRef, useState } from 'react';
import FileIcon from '../assets/file-icon.svg';
import useOnClickOutside from '../hooks/useOnClickOutside';
import LoadingPreviewGraphic from './LoadingPreviewGraphic';

export default function ObjectPreview({ accountId, authKey, objectData, container, object }) {
  const fileType = objectData.find((obj) => obj.name === 'content-type').value;
  const ref = useRef();
  const [isLoaded, setIsLoaded] = useState(false);
  useOnClickOutside(ref, () => navigate(`/${container}`));

  useEffect(() => {
    const previewImage = document.querySelector('#preview-image');
    const fetchImage = async () => {
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
      previewImage.src = objectUrl;
      setIsLoaded(true);
    };
    if (fileType === 'image/jpeg' || fileType === 'image/png') fetchImage();
  }, [object]);

  return (
    <div>
      <img
        className={`mx-auto mt-8 mb-2 rounded-md shadow-lg ${isLoaded ? 'block' : 'hidden'}`}
        style={{ maxWidth: '400px', maxHeight: '300px' }}
        id="preview-image"
        src={FileIcon}
        alt={`preview for the object ${object}`}
      />
      {!isLoaded && <LoadingPreviewGraphic />}
    </div>
  );
}
