import { useParams, redirect, Link, Form } from 'react-router-dom';

export default function Upload({ accountId, authKey }) {
  let { container } = useParams();

  return (
    <div className="container mx-auto border border-cyan-300 bg-cyan-100 p-5 mb-5">
      <h2 className="border-b pb-2 mb-2 border-cyan-300">Upload a new object to &quot;{container}&quot;</h2>
      <Form method="post" encType="multipart/form-data">
        <input name="file" type="file" />
        <input name="token" type="hidden" defaultValue={authKey} />
        <input name="accountId" type="hidden" defaultValue={accountId} />
        <button className="px-4 py-2 font-semibold text-sm border border-cyan-300 bg-cyan-200 rounded-full shadow-sm">
          Upload
        </button>
      </Form>
      <Link to={`/${container}`}>Close</Link>
    </div>
  );
}

export async function action({ request, params }) {
  const formData = await request.formData();
  const upload = Object.fromEntries(formData);
  await uploadFile(params.container, upload);
  return redirect(`/${params.container}`);
}

async function uploadFile(container, upload) {
  const res = await fetch(`https://api.testnet.onmachina.io/v1/${upload.accountId}/${container}/${upload.file.name}`, {
    // Your POST endpoint
    method: 'PUT',
    headers: {
      'Content-Type': upload.file.type,
      'x-auth-token': upload.token,
    },
    body: upload.file,
  });
  if (!res.ok) throw res;
  return { ok: true };
}
