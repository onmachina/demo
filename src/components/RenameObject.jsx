import { useEffect, useRef } from 'react';
import { Link, Form, useNavigate } from 'react-router-dom';
import MetaDataTable from '../components/tables/MetaDataTable';
import UseEscape from '../hooks/useEscape';
import { HiOutlinePencilSquare, HiOutlineArrowDownTray, HiOutlineTrash, HiXMark } from 'react-icons/hi2';
import FileIcon from '../assets/file-icon.svg';
import useOnClickOutside from '../hooks/useOnClickOutside';

export default function RenameObject({ accountId, authKey, objectData, container, object, setMode }) {
  const fileType = objectData.find((obj) => obj.name === 'content-type').value;
  const navigate = useNavigate();
  const ref = useRef();
  const inputRef = useRef(null);

  useOnClickOutside(ref, () => navigate(`/${container}`));

  UseEscape(() => {
    setMode('display');
  });

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.select();
    }
  }, []);

  return (
    <>
      <div className="ui-panel w-2/4 right-0 top-0 h-full absolute z-10 p-4 text-ui-muted" ref={ref}>
        <div className="p-5 mb-5 w-full bg-ui-base border border-ui-base rounded-lg shadow-lg">
          <h2 className="border-b pb-2 mb-2 border-ui-base flex justify-between">
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
          <Form action={`/${container}/${object}/`} method="POST">
            <label htmlFor="rename" className="sr-only" />
            <input
              name="newname"
              ref={inputRef}
              autoFocus
              type="text"
              className="text-ui-base text-center w-full border-none bg-ui-base"
              defaultValue={object}
            />
            <input name="oldname" type="hidden" value={object} />
            <input name="action" type="hidden" value="rename" />
            <input name="token" type="hidden" value={authKey} />
            <input name="accountId" type="hidden" value={accountId} />
            <div className="flex flex-row items-center space-x-2 mb-4 mt-4 justify-center">
              <button
                type="submit"
                className="px-4 py-2 font-semibold text-sm bg-ui-base rounded-full shadow-sm border-ui-base border text-ui-active"
              >
                <HiOutlinePencilSquare size={22} style={{ display: 'inline-block' }} /> Rename
              </button>
            </div>
          </Form>

          <MetaDataTable metadata={objectData} />
        </div>
      </div>
    </>
  );
}
