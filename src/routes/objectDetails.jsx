import { useEffect, useRef } from 'react';
import { useParams, useLoaderData, Link, useNavigate, Outlet } from 'react-router-dom';
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

export default function Details({ accountId, authKey }) {
  let { container, object } = useParams();
  const objectData = useLoaderData();
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
      <Outlet />
      <div className="w-2/4 right-0 top-0 h-full absolute z-10 p-4" ref={ref}>
        <div className="p-5 mb-5 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          <h2 className="border-b pb-2 mb-2 border-slate-300 flex justify-between">
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
          <div className="text-sky-700 text-center">{object}</div>
          <div className="flex flex-row items-center space-x-2 mb-4 mt-4 justify-center">
            <a
              className="px-4 py-2 font-semibold text-sm bg-white rounded-full shadow-sm border-gray-300 border"
              onClick={handleDownloadClick}
              href="#"
            >
              <HiOutlineArrowDownTray size={22} style={{ display: 'inline-block' }} /> Download
            </a>
            <Link className="px-4 py-2 font-semibold text-sm bg-white rounded-full shadow-sm border-gray-300 border">
              <HiOutlinePencilSquare size={22} style={{ display: 'inline-block' }} /> Rename
            </Link>
            <Link
              to="delete"
              className="text-red-600 px-4 py-2 font-semibold text-sm bg-white rounded-full shadow-sm border-gray-300 border"
            >
              <HiOutlineTrash size={22} style={{ display: 'inline-block' }} /> Delete
            </Link>
          </div>

          <MetaDataTable metadata={objectData} />
        </div>
      </div>
    </>
  );
}

export async function loader(params, accountId, x_auth_token) {
  const response = await fetch(
    `https://api.testnet.onmachina.io/v1/${accountId}/${params.container}/${params.object}`,
    {
      method: 'HEAD',
      headers: {
        'x-auth-token': x_auth_token,
      },
    },
  );
  const headersArray = [];
  for (const [name, value] of response.headers.entries()) {
    if (name === 'last-modified') headersArray.push({ name, value });
    if (name === 'content-type') headersArray.push({ name, value });
    if (name === 'etag') headersArray.push({ name, value });
    if (name.startsWith('x-object-meta')) headersArray.push({ name, value });
  }
  return headersArray;
}
