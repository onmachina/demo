import { useParams, useLoaderData, Link, redirect, Form } from 'react-router-dom';

export default function DeleteContainer({ authKey }) {
  let { container } = useParams();
  const containerData = useLoaderData();
  //   const fileType = containerData.find((obj) => obj.name === 'content-type').value;
  //   const fileSize = containerData.find((obj) => obj.name === 'content-length').value;

  return (
    <div className="grid h-screen place-items-center top-0 bottom-0 left-0 right-0 absolute z-50">
      <div className="w-2/4">
        <div className="drop-shadow-xl border border-red-400 bg-red-100 p-5 mb-5">
          <h2 className="border-b pb-2 mb-2 border-red-400">Delete {container}</h2>
          <p>
            Are you sure you want to delete the container <strong>{container}</strong>? It contains ____ objects
            totalling ____ in data. This action cannot be undone.
          </p>
          <Form method="POST" action={`/${container}/delete/`}>
            <input name="token" type="hidden" defaultValue={authKey} />
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full" type="submit">
              Yes, Delete
            </button>
            <Link to={`/${container}/`}>No, cancel</Link>
          </Form>
        </div>
      </div>
    </div>
  );
}

export async function loader(params, x_auth_token) {
  const response = await fetch(`https://api.testnet.onmachina.io/v1/toddmorey.testnet/${params.container}`, {
    method: 'HEAD',
    headers: {
      'x-auth-token': x_auth_token,
    },
  });
  const headersArray = [];
  for (const [name, value] of response.headers.entries()) {
    headersArray.push({ name, value });
  }
  return headersArray;
}

export async function action({ request, params }) {
  const formData = await request.formData();
  const token = Object.fromEntries(formData).token;
  await deleteContainer(params.container, token);
  return redirect(`/`);
}

async function deleteContainer(container, token) {
  const res = await fetch(`https://api.testnet.onmachina.io/v1/toddmorey.testnet/${container}/`, {
    method: 'DELETE',
    headers: {
      'x-auth-token': token,
    },
  });
  if (!res.ok) throw res;
  return { ok: true };
}
