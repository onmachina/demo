import { Link, Form } from 'react-router-dom';
import { HiXMark } from 'react-icons/hi2';

export default function UploadObjectForm({ containerName, accountID, authToken }) {
  return (
    <div className="container mx-auto border border-cyan-300 bg-cyan-100 p-5 mb-5">
      <h2 className="border-b pb-2 mb-2 border-cyan-300 flex justify-between">
        <div>Upload a new object to &quot;{containerName}&quot;</div>
        <Link to={`/${containerName}`}>
          <HiXMark />
        </Link>
      </h2>
      <Form method="post" encType="multipart/form-data" action={`/${containerName}`}>
        <input name="action" type="hidden" defaultValue="Upload Object" />
        <input name="token" type="hidden" value={authToken} />
        <input name="accountId" type="hidden" value={accountID} />
        <input name="container" type="hidden" value={containerName} />

        <div className="mb-3 w-96">
          <label htmlFor="formFile" className="mb-2 inline-block text-neutral-700">
            File to upload
          </label>
          <div className="flex space-x-2">
            <input
              name="file"
              type="file"
              className="relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded border border-solid border-neutral-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-neutral-700 outline-none transition duration-300 ease-in-out file:-mx-3 file:-my-1.5 file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-1.5 file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[margin-inline-end:0.75rem] file:[border-inline-end-width:1px] hover:file:bg-neutral-200 focus:border-primary focus:bg-white focus:text-neutral-700 focus:shadow-[0_0_0_1px] focus:shadow-primary focus:outline-none"
              id="formFile"
            />
            <button className="px-4 py-2 font-semibold text-sm border border-cyan-300 bg-cyan-200 rounded-full shadow-sm">
              Upload
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
}
