import React, { useState, Suspense } from 'react';
import { useParams, useLoaderData, redirect } from 'react-router-dom';

import DisplayObject from '../components/DisplayObject';
// const DeleteComponent = React.lazy(() => import('./DeleteComponent'));
const RenameComponent = React.lazy(() => import('../components/RenameObject'));

export default function Details({ accountId, authkey }) {
  const [mode, setMode] = useState('display');

  let { container, object } = useParams();
  const objectData = useLoaderData();

  let Component;
  switch (mode) {
    case 'delete':
      Component = DeleteComponent;
      break;
    case 'rename':
      Component = RenameComponent;
      break;
    default:
      Component = DisplayObject;
  }

  return (
    <div>
      <button onClick={() => setMode('display')}>Display</button>
      <button onClick={() => setMode('delete')}>Delete</button>
      <button onClick={() => setMode('rename')}>Rename</button>

      <Suspense fallback={<div>Loading...</div>}>
        <Component
          accountId={accountId}
          authKey={authkey}
          objectData={objectData}
          container={container}
          object={object}
          setMode={setMode}
        />
      </Suspense>
    </div>
  );
}

// Called to load data for any GET request
export async function loader(params, accountId, x_auth_token) {
  const response = await fetch(
    `https://api.testnet.onmachina.io/v1/${accountId}/${params.container}/${params.object}`,
    {
      method: 'HEAD',
      headers: {
        'x-auth-token': x_auth_token,
      },
    },
  );
  const headersArray = [];
  for (const [name, value] of response.headers.entries()) {
    if (name === 'last-modified') headersArray.push({ name, value });
    if (name === 'content-type') headersArray.push({ name, value });
    if (name === 'etag') headersArray.push({ name, value });
    if (name.startsWith('x-object-meta')) headersArray.push({ name, value });
  }
  return headersArray;
}

// Called for any POST request
export async function action({ request, params }) {
  const formData = await request.formData();
  const action = Object.fromEntries(formData).action;
  const token = Object.fromEntries(formData).token;
  const accountId = Object.fromEntries(formData).accountId;
  if (action === 'deleteObject') {
    await deleteObject(params.container, params.object, accountId, token);
    return redirect(`/${params.container}`);
  }
}
