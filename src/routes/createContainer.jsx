import React, { useState } from 'react';
import debounce from 'lodash/debounce';

import { Link, redirect, Form } from 'react-router-dom';

export default function AddContainer({ accountId, authKey }) {
  // ensure the container name is URL apporpriate
  const slugify = debounce((event) => {
    const containerName = event.target.value;
    const slug = containerName.toLowerCase().replace(/[\W_]+/g, '-');
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
          <Form className="pt-4" autocomplete="off" method="POST" action={`/new-container/`}>
            <div class="mb-6">
              <input name="token" type="hidden" defaultValue={authKey} />
              <input name="accountId" type="hidden" defaultValue={accountId} />
              <label for="email" className="block mb-2 text-sm font-medium text-gray-900">
                Container name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="my-new-container"
                onChange={handleInputChange}
                required
                autoFocus
              />
            </div>
            <div className="flex items-start mb-6">
              <label class="relative inline-flex items-center mb-4 cursor-pointer">
                <input type="checkbox" value="" class="sr-only peer" name="public" id="public" />
                <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span class="ml-3 text-sm font-medium text-gray-900">Make this container public</span>
              </label>
            </div>
            <div className="flex items-center">
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Submit
              </button>
              <Link to="/" className="ml-4 text-sm text-gray-500 hover:text-gray-700">
                Cancel
              </Link>
            </div>
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
  const containerName = Object.fromEntries(formData).name;
  const isPublic = Object.fromEntries(formData).public;
  await addContainer(containerName, isPublic, accountId, token);
  return redirect(`/`);
}

async function addContainer(containerName, isPublic, accountId, token) {
  let headers = { 'x-auth-token': token };
  if (isPublic) {
    // set an ACL to allow anybody to get an object in this container
    headers['x-container-read'] = '.r:*';
  }

  const res = await fetch(`https://api.testnet.onmachina.io/v1/${accountId}/${containerName}/`, {
    method: 'PUT',
    headers: headers,
  });
  if (!res.ok) throw res;
  return { ok: true };
}
