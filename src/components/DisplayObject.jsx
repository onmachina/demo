import { useEffect, useRef } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import MetaDataTable from '../components/tables/MetaDataTable';
import UseEscape from '../hooks/useEscape';
import { HiOutlinePencilSquare, HiOutlineArrowDownTray, HiOutlineTrash, HiXMark } from 'react-icons/hi2';
import FileIcon from '../assets/file-icon.svg';
import useOnClickOutside from '../hooks/useOnClickOutside';

async function downloadFile(authKey, accountId, container, object) {
  const response = await fetch(`https://api.testnet.onmachina.io/v1/${accountId}/${container}/${object}`, {
    method: 'GET',
    headers: {
      'x-auth-token': authKey,
    },
  });

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = object || 'download';

  link.click();
}

export default function DisplayObject({ accountId, authKey, objectData, container, object, setMode }) {
  const fileType = objectData.find((obj) => obj.name === 'content-type').value;
  const navigate = useNavigate();
  const ref = useRef();
  useOnClickOutside(ref, () => navigate(`/${container}`));

  const handleDownloadClick = () => {
    downloadFile(authKey, accountId, container, object);
    navigate(`/${container}`);
  };

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
    };
    if (fileType === 'image/jpeg' || fileType === 'image/png') fetchImage();
  }, [object]);

  UseEscape(() => {
    navigate(`/${container}`);
  });

  return (
    <>
      <div className="w-2/4 right-0 top-0 h-full absolute z-10 p-4 ui-panel" ref={ref}>
        <Outlet />

        <div className="p-5 mb-5 w-full bg-ui-base border border-ui-base rounded-lg shadow-lg text-ui-muted">
          <h2 className="border-b pb-2 mb-2 border-ui-base flex justify-between">
            <div>
              Details for <strong>{object}</strong>
            </div>
            <Link to={`/${container}`}>
              <HiXMark />
            </Link>
          </h2>
          <img
            className="block mx-auto mt-8 mb-2 bg-white rounded-md pl-6 "
            style={{ maxWidth: '400px', maxHeight: '300px' }}
            id="preview-image"
            src={FileIcon}
            alt={`preview for the object ${object}`}
          />
          <div className="text-ui-active text-center">{object}</div>
          <div className="flex flex-row items-center space-x-2 mb-4 mt-4 justify-center">
            <a
              className="px-4 py-2 font-semibold text-sm bg-ui-base rounded-full shadow-sm border-ui-base border"
              onClick={handleDownloadClick}
              href="#"
            >
              <HiOutlineArrowDownTray size={22} style={{ display: 'inline-block' }} /> Download
            </a>
            <a
              onClick={() => setMode('rename')}
              href="#"
              className="px-4 py-2 font-semibold text-sm bg-ui-base rounded-full shadow-sm border-ui-base border"
            >
              <HiOutlinePencilSquare size={22} style={{ display: 'inline-block' }} /> Rename
            </a>
            <a
              onClick={() => setMode('delete')}
              href="#"
              className="text-red-600 px-4 py-2 font-semibold text-sm bg-ui-base rounded-full shadow-sm border-ui-base border"
            >
              <HiOutlineTrash size={22} style={{ display: 'inline-block' }} /> Delete
            </a>
          </div>

          <MetaDataTable metadata={objectData} />
        </div>
      </div>
    </>
  );
}
