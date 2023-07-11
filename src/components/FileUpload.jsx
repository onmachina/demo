import React from 'react';
import PercentChart from './PercentChart';
import { formatFileSize } from '../../lib/utils';

export default function FileUpload({ file, status, percentUploaded }) {
  const renderPreview = () => {
    if (file.type === 'image/jpeg' || file.type === 'image/png') {
      return <img className="object-contain h-14 w-12" src={URL.createObjectURL(file)} alt="Preview" />;
    }
    return null;
  };

  return (
    <div className="flex justify-start items-center my-2">
      <div className="mr-2">{renderPreview()}</div>
      <span className="mr-2">{file.name}</span>
      <span className="mr-2">({formatFileSize(file.size)})</span>
      <span className="flex items-center ml-auto">
        <PercentChart percent={percentUploaded} />
      </span>
    </div>
  );
}
