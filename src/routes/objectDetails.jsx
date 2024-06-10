import React, { useRef, useState, Suspense } from 'react';
import { Link, redirect, useNavigate, useParams, useLoaderData, Outlet } from 'react-router-dom';
import UseEscape from '../hooks/useEscape';
import useOnClickOutside from '../hooks/useOnClickOutside';
import ObjectPreview from '../components/ObjectPreview';
import { HiXMark } from 'react-icons/hi2';
import { deleteObject, renameObject } from '../../lib/onmachina';

import DisplayObject from '../components/DisplayObject';
const DeleteComponent = React.lazy(() => import('../components/DeleteObject'));
const RenameComponent = React.lazy(() => import('../components/RenameObject'));

import { auth0AuthProvider } from '../../lib/auth';

export default function ObjectDetials({ accountId, authKey }) {
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

  const navigate = useNavigate();
  const ref = useRef();
  useOnClickOutside(ref, () => navigate(`/${container}`));

  UseEscape(() => {
    navigate(`/${container}`);
  });

  return (
    <>
      <div
        className="w-[450px] right-0 top-0 h-full absolute z-10 ui-panel bg-ui-base border-l border-ui-base"
        ref={ref}
      >
        <Outlet />
        <div className="p-5 pt-7 mt-5 w-full text-ui-muted">
          <h2 className="border-b pb-4 mb-2 border-ui-base flex justify-between items-center">
            <div className="text-ui-muted">
              Details for <strong className="text-white font-normal">{object}</strong>
            </div>
            <Link to={`/${container}`}>
              <HiXMark />
            </Link>
          </h2>
          <ObjectPreview
            accountId={accountId}
            authKey={authKey}
            objectData={objectData}
            container={container}
            object={object}
          />
          <Suspense fallback={<div>Loading...</div>}>
            <Component
              accountId={accountId}
              authKey={authKey}
              objectData={objectData}
              container={container}
              object={object}
              setMode={setMode}
            />
          </Suspense>
        </div>
      </div>
    </>
  );
}

// Called to load data for any GET request
export async function loader(params, accountId, x_auth_token) {
  const response = await auth0AuthProvider.authenticatedFetch(`/${params.container}/${params.object}`, {
    method: 'HEAD',
  });
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
  } else if (action === 'rename') {
    const oldName = Object.fromEntries(formData).oldname;
    const newName = Object.fromEntries(formData).newname;
    await renameObject({ container: params.container, oldName, newName, accountId, token });
    return redirect(`/${params.container}/${newName}`);
  }
}
