import { useParams, useLoaderData, Link, redirect, Form } from 'react-router-dom';
import { formatFileSize } from '../../lib/utils';
import { auth0AuthProvider } from '../auth';

export default function DeleteContainer() {
  let { container } = useParams();
  const containerData = useLoaderData();
  const objectCount = containerData.find((obj) => obj.name === 'x-container-object-count').value;
  const byteCount = containerData.find((obj) => obj.name === 'x-container-bytes-used').value;

  return (
    <div className="grid h-screen place-items-center top-0 bottom-0 left-0 right-0 absolute z-50">
      <div className="w-2/4">
        <div className="drop-shadow-xl border border-red-400 bg-red-100 p-5 mb-5">
          <h2 className="border-b pb-2 mb-2 border-red-400 text-red-700">Delete {container}</h2>
          <p>
            Are you sure you want to delete the container <strong>{container}</strong>? It contains {objectCount}{' '}
            objects totalling {formatFileSize(byteCount)} in data. This action cannot be undone.
          </p>
          <Form method="POST" action={`/${container}/delete/`}>
            <div className="flex space-x-2 pt-4">
              <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full" type="submit">
                Yes, Delete
              </button>
              <Link to={`/${container}/`} className="text-red-700 py-2 px-4">
                No, cancel
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export async function loader(params) {
  const response = await auth0AuthProvider.authenticatedFetch(`/${params.container}`, {
    method: 'HEAD',
  });
  const headersArray = [];
  for (const [name, value] of response.headers.entries()) {
    headersArray.push({ name, value });
  }
  return headersArray;
}

export async function action({ request, params }) {
  await deleteContainer(params.container);
  return redirect(`/`);
}

async function deleteContainer(container) {
  const res = await auth0AuthProvider.authenticatedFetch(`/${container}/`, {
    method: 'DELETE',
  });

  if (!res.ok) throw res;
  return { ok: true };
}
