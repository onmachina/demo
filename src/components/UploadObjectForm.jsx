import { useRef, useEffect } from 'react';
import { Link, Form, useNavigate } from 'react-router-dom';
import { HiXMark } from 'react-icons/hi2';
import { useState } from 'react';
import { fileListTotalSize } from '../../lib/utils.ts';
import FileUpload from './FileUpload.jsx';
import { apiURL } from '../../lib/onmachina.ts';

export default function UploadObjectForm({ containerName, accountId, token }) {
  const [uploadList, setUploadList] = useState([]);
  const [uploadStatus, setUploadStatus] = useState({ totalSize: '0', isComplete: false });

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const generateUploadList = (files) => {
    let fileList = [];
    Array.from(files).forEach((file, index) => {
      fileList.push({ file: file, status: 'pending', percentUploaded: 0, index: index });
    });
    setUploadList(fileList);
    setUploadStatus({ totalSize: fileListTotalSize(fileList), isComplete: false });
  };

  useEffect(() => {
    if (allItemsUploaded()) {
      navigate(`/${containerName}`);
    }
  }, [uploadList]);

  const allItemsUploaded = () => {
    return uploadList.length > 0 && uploadList.every((item) => item.status === 'complete');
  };

  const updateUploadItem = (itemIndex, newMetadata) => {
    const updatedItem = { ...uploadList[itemIndex], ...newMetadata };
    setUploadList((currentUploadList) => {
      let newList = [...currentUploadList];
      newList[itemIndex] = updatedItem;
      return newList;
    });
  };

  const uploadItem = (uploadItem) => {
    let xhr = new XMLHttpRequest();
    xhr.open('PUT', `${apiURL}/${accountId}/${containerName}/${uploadItem.file.name}`, true);
    xhr.setRequestHeader('Content-Type', uploadItem.file.type);
    xhr.setRequestHeader('x-auth-token', token);
    xhr.uploadItem = uploadItem; // save a reference to the uploadItem in the xhr object
    xhr.upload.onprogress = function (event) {
      if (event.lengthComputable) {
        var percent = Math.round((event.loaded / event.total) * 100);
        updateUploadItem(xhr.uploadItem.index, { percentUploaded: percent });
        console.log(`${percent}% complete`);
      }
    };

    xhr.addEventListener(
      'load',
      (e) => {
        updateUploadItem(e.target.uploadItem.index, { percentUploaded: 100, status: 'complete' });
      },
      false,
    );
    // xhr.addEventListener('error', ErrorHandler, false);
    // xhr.addEventListener('abort', AbortHandler, false);
    xhr.send(uploadItem.file);
  };

  const uploadAllItems = () => {
    uploadList.forEach((item) => {
      uploadItem(item);
    });
  };

  const handleUploadButton = (e) => {
    e.stopPropagation();
    e.preventDefault();
    uploadAllItems();
  };

  const dragEnter = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const dragOver = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const drop = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const dt = e.dataTransfer;
    const files = dt.files;

    generateUploadList(files);
  };

  const handleDragAreaClick = () => {
    // trigger the file input click
    fileInputRef.current.click();
  };

  return (
    <div className="container action-panel p-4 text-white">
      <h2 className="pb-2 mb-2 flex justify-between">
        <div></div>
        <Link to={`/${containerName}`}>
          <HiXMark />
        </Link>
      </h2>

      <div>
        {uploadList.map((item, index) => (
          <FileUpload key={index} file={item.file} status={item.status} percentUploaded={item.percentUploaded} />
        ))}
      </div>

      <Form method="post" encType="multipart/form-data" action={`/${containerName}`}>
        <input name="action" type="hidden" defaultValue="Upload Object" />
        <input name="token" type="hidden" value={token} />
        <input name="accountId" type="hidden" value={accountId} />
        <input name="container" type="hidden" value={containerName} />

        <div
          className="w-full mb-2 h-10 bg-blue-400 bg-opacity-40  border-l-blue-800 border-t-blue-800 p-10 flex justify-center items-center cursor-pointer"
          onDragEnter={dragEnter}
          onDragOver={dragOver}
          onDrop={drop}
          onClick={handleDragAreaClick}
        >
          <p className="text-center">
            Drag and drop files here or <a className="underline">click to browse</a>.
          </p>
        </div>

        <div className="sr-only">
          <label htmlFor="formFile" className="mb-2 inline-block text-neutral-700">
            File to upload
          </label>
          <div className="flex space-x-1">
            <input
              name="file"
              type="file"
              className="relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded border border-solid border-neutral-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-neutral-700 outline-none transition duration-300 ease-in-out file:-mx-3 file:-my-1.5 file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-1.5 file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[margin-inline-end:0.75rem] file:[border-inline-end-width:1px] hover:file:bg-neutral-200 focus:border-primary focus:bg-white focus:text-neutral-700 focus:shadow-[0_0_0_1px] focus:shadow-primary focus:outline-none"
              id="formFile"
              onChange={(e) => generateUploadList(e.target.files)}
              multiple
              ref={fileInputRef}
            />
          </div>
        </div>
        <button
          className="block w-full text-white hover:text-white px-4 py-4 font-semibold text-sm  rounded-sm shadow-sm hover:bg-blue-700 hover:bg-opacity-50 animate-pulse hover:animate-none transition-all"
          onClick={handleUploadButton}
        >
          Start Upload
        </button>
      </Form>
    </div>
  );
}
