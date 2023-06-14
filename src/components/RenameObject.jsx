import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MetaDataTable from '../components/tables/MetaDataTable';
import UseEscape from '../hooks/useEscape';
import { HiOutlinePencilSquare, HiOutlineArrowDownTray, HiOutlineTrash, HiXMark } from 'react-icons/hi2';
import FileIcon from '../assets/file-icon.svg';
import useOnClickOutside from '../hooks/useOnClickOutside';

export default function RenameObject({ accountId, authKey, objectData, container, object }) {
  const fileType = objectData.find((obj) => obj.name === 'content-type').value;
  const navigate = useNavigate();
  const ref = useRef();
  useOnClickOutside(ref, () => navigate(`/${container}`));

  UseEscape(() => {
    navigate(`/${container}`);
  });

  return (
    <>
      <div className="w-2/4 right-0 top-0 h-full absolute z-10 p-4" ref={ref}>
        <div className="p-5 mb-5 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          <h2 className="border-b pb-2 mb-2 border-slate-300 flex justify-between">
            <div>
              Rename object: <strong>{object}</strong>
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
            <Link className="px-4 py-2 font-semibold text-sm bg-white rounded-full shadow-sm border-gray-300 border">
              <HiOutlinePencilSquare size={22} style={{ display: 'inline-block' }} /> Rename
            </Link>
          </div>

          <MetaDataTable metadata={objectData} />
        </div>
      </div>
    </>
  );
}
