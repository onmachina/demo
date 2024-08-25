import { useEffect, useRef, useState } from 'react';
import FileIcon from './FileIcon';
import useOnClickOutside from '../hooks/useOnClickOutside';
import LoadingPreviewGraphic from './LoadingPreviewGraphic';
import { authenticatedFetch } from '../../lib/onmachina';

export default function ObjectPreview({ objectData, container, object }) {
  const fileType = objectData.find((obj) => obj.name === 'content-type').value;
  const ref = useRef();
  const [isLoaded, setIsLoaded] = useState(false);
  const isImage = fileType === 'image/jpeg' || fileType === 'image/png';
  // split by . and get the last element
  const fileExtension = object.split('.').pop();

  useOnClickOutside(ref, () => navigate(`/${container}`));

  useEffect(() => {
    const previewImage = document.querySelector('#preview-image');
    const fetchImage = async () => {
      const response = await authenticatedFetch(`/${container}/${object}`, {
        method: 'GET',
      });
      // Create an object URL from the data.
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      // Set the image src to the object URL.
      previewImage.src = objectUrl;
      setIsLoaded(true);
    };
    if (isImage) fetchImage();
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
      {isImage && !isLoaded && <LoadingPreviewGraphic />}
      {!isImage && <FileIcon type={fileExtension} />}
    </div>
  );
}
