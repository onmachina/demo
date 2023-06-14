import { useRef } from 'react';
import { Link, Form, useNavigate } from 'react-router-dom';
import MetaDataTable from '../components/tables/MetaDataTable';
import UseEscape from '../hooks/useEscape';
import { HiOutlinePencilSquare, HiOutlineArrowDownTray, HiOutlineTrash, HiXMark } from 'react-icons/hi2';
import FileIcon from '../assets/file-icon.svg';
import useOnClickOutside from '../hooks/useOnClickOutside';

export default function DeleteObject({ accountId, authKey, container, object, setMode }) {
  const navigate = useNavigate();
  const ref = useRef();

  useOnClickOutside(ref, () => navigate(`/${container}`));

  UseEscape(() => {
    setMode('display');
  });

  return (
    <>
      <div className="w-2/4 right-0 top-0 h-full absolute z-10 p-4 ui-panel" ref={ref}>
        <div className="p-5 mb-5 w-full text-ui-muted bg-ui-base border border-ui-base rounded-lg shadow-lg">
          <h2 className="border-b pb-2 mb-2 border-ui-base flex justify-between">
            <div>
              Delete object: <strong>{object}</strong>
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
          <div className="text-red-700 text-center">{object}</div>

          <Form action={`/${container}/${object}/`} method="POST">
            <input name="action" type="hidden" value="deleteObject" />
            <input name="token" type="hidden" value={authKey} />
            <input name="accountId" type="hidden" value={accountId} />
            <div className="flex flex-row items-center space-x-2 mb-4 mt-4 justify-center">
              <button
                type="submit"
                className="text-red-600 px-4 py-2 font-semibold text-sm bg-ui-base rounded-full shadow-sm border-ui-base border"
              >
                <HiOutlineTrash size={22} style={{ display: 'inline-block' }} /> Yes, delete
              </button>
              <a
                onClick={() => setMode('display')}
                href="#"
                className="px-4 py-2 font-semibold text-sm bg-ui-base rounded-full shadow-sm border-ui-base border"
              >
                Cancel
              </a>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
