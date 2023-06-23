import React from 'react';

export default function FileUpload({ file, status, percentUploaded }) {
  const renderPreview = () => {
    if (file.type === 'image/jpeg' || file.type === 'image/png') {
      return <img className="max-w-sm" src={URL.createObjectURL(file)} alt="Preview" />;
    }
    return null;
  };

  return (
    <div className="flex items-center">
      <div className="mr-2">{renderPreview()}</div>
      <div className="flex items-center">
        <span>{file.name}</span>
        <span>{file.size} bytes</span>
        <span>{percentUploaded}% </span>
        <span>{status}</span>
      </div>
    </div>
  );
}
