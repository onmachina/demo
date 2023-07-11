import { useEffect, useRef } from 'react';
import { Form } from 'react-router-dom';
import MetaDataTable from '../components/tables/MetaDataTable';
import { HiOutlinePencilSquare } from 'react-icons/hi2';

export default function RenameObject({ accountId, authKey, objectData, container, object, setMode }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.select();
    }
  }, []);

  return (
    <>
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
    </>
  );
}
