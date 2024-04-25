import { useParams, useLoaderData, Link, redirect, Form } from 'react-router-dom';
import { formatFileSize } from '../../lib/utils';
import { auth0AuthProvider } from '../auth';

export default function DeleteObject() {
  let { container, object } = useParams();
  const objectData = useLoaderData();
  const fileType = objectData.find((obj) => obj.name === 'content-type').value;
  const fileSize = objectData.find((obj) => obj.name === 'content-length').value;

  return (
    <div className="grid h-screen place-items-center top-0 bottom-0 left-0 right-0 absolute z-50">
      <div className="w-2/4">
        <div className="drop-shadow-xl border border-red-400 bg-red-100 p-5 mb-5">
          <h2 className="border-b pb-2 mb-2 border-red-400 text-red-700">Delete {object}</h2>
          <p className="pt-4 pb-4">
            Are you sure you want to delete the <strong>{formatFileSize(fileSize)}</strong> file{' '}
            <strong>
              {container}/{object}
            </strong>{' '}
            ({fileType})? This action cannot be undone.
          </p>
          <Form method="POST" action={`/${container}/${object}/delete/`}>
            <div className="flex space-x-2 pt-4">
              <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full" type="submit">
                Yes, Delete
              </button>
              <Link to={`/${container}/${object}`} className="text-red-700 py-2 px-4">
                No, cancel
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export async function loader(params, accountId, x_auth_token) {
  const response = await fetch(
    `https://api.global01.onmachina.io/v1/${accountId}/${params.container}/${params.object}`,
    {
      method: 'HEAD',
      headers: {
        'x-auth-token': x_auth_token,
      },
    },
  );
  const headersArray = [];
  for (const [name, value] of response.headers.entries()) {
    headersArray.push({ name, value });
  }
  return headersArray;
}

export async function action({ params }) {
  await deleteFile(params.container, params.object);
  return redirect(`/${params.container}`);
}

async function deleteFile(container, object) {
  const res = await auth0AuthProvider.authenticatedFetch(`/${container}/${object}`, {
    method: 'DELETE',
  });

  if (!res.ok) throw res;
  return { ok: true };
}
