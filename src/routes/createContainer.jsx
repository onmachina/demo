import React, { useState } from 'react';
import debounce from 'lodash/debounce';

import { Link, redirect, Form } from 'react-router-dom';

export default function AddContainer({ accountId, authKey }) {
  // ensure the container name is URL apporpriate
  const slugify = debounce((event) => {
    const text = event.target.value;
    const slug = text.toLowerCase().replace(/[\W_]+/g, '-');
    event.target.value = slug;
  }, 200);

  const handleInputChange = (event) => {
    slugify(event);
  };

  return (
    <div className="grid h-screen place-items-center top-0 bottom-0 left-0 right-0 absolute z-50">
      <div className="w-2/4">
        <div className="drop-shadow-xl border border-cyan-400 bg-cyan-100 p-5 mb-5">
          <h2 className="border-b pb-2 mb-2 border-cyan-400">Create a new container</h2>
          <Form method="POST" action={`/new-container/`}>
            <input name="token" type="hidden" defaultValue={authKey} />
            <input name="accountId" type="hidden" defaultValue={accountId} />
            <input name="name" type="text" placeholder="container-name" onChange={handleInputChange} />
            <input name="public" id="public" type="checkbox" defaultValue={false} />{' '}
            <label htmlFor="public">Make this container public</label>
            <button className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-full" type="submit">
              Create new container
            </button>
            <Link to={`/`}>Cancel</Link>
          </Form>
        </div>
      </div>
    </div>
  );
}

export async function action({ request, params }) {
  const formData = await request.formData();
  const token = Object.fromEntries(formData).token;
  const accountId = Object.fromEntries(formData).accountId;
  console.log(formData);
  // await deleteContainer(params.container, accountId, token);
  return redirect(`/`);
}

async function addContainer(container, accountId, token) {
  // add container object here
}
