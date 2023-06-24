import { useRef } from 'react';
import { Form, useNavigate } from 'react-router-dom';
import { HiOutlineTrash } from 'react-icons/hi2';

export default function DeleteObject({ accountId, authKey, container, object, setMode }) {
  const navigate = useNavigate();
  const ref = useRef();

  return (
    <>
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
    </>
  );
}
