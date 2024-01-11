export const apiURL = 'http://localhost:8888/v1';

export async function addContainer(containerName, isPublic, accountId, token) {
  let headers = { 'x-auth-token': token };
  if (isPublic) {
    // set an ACL to allow anybody to get an object in this container
    headers['x-container-read'] = '.r:*';
  }

  const res = await fetch(`${apiURL}/${accountId}/${containerName}/`, {
    method: 'PUT',
    headers: headers,
  });
  if (!res.ok) throw res;
  console.log('Container created');
  return { ok: true };
}

export async function deleteContainer(containerName, accountId, token) {
  const res = await fetch(`${apiURL}/${accountId}/${containerName}/`, {
    method: 'DELETE',
    headers: {
      'x-auth-token': token,
    },
  });
  if (!res.ok) throw res;
  return { ok: true };
}

export async function fetchContainerMetadata(containerName, accountId, token) {
  const response = await fetch(`${apiURL}/${accountId}/${containerName}`, {
    method: 'HEAD',
    headers: {
      'x-auth-token': token,
    },
  });
  const metadata = {};
  for (const [name, value] of response.headers.entries()) {
    metadata[name] = value;
  }

  return metadata;
}

export async function uploadObject(container, file, accountId, token) {
  console.log('uploading object: ', file.name);
  console.log('to container: ', container);
  console.log('URL: ', `${apiURL}/${accountId}/${container}/${file.name}`);
  const res = await fetch(`${apiURL}/${accountId}/${container}/${file.name}`, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
      'x-auth-token': token,
    },
    body: file,
  });
  if (!res.ok) throw res;
  return { ok: true };
}

export async function deleteObject(container, object, accountId, token) {
  console.log('deleting object: ', object);
  const res = await fetch(`${apiURL}/${accountId}/${container}/${object}`, {
    method: 'DELETE',
    headers: {
      'x-auth-token': token,
    },
  });
  if (!res.ok) throw res;
  return { ok: true };
}

export async function renameObject({ container, oldName, newName, accountId, token }) {
  console.log('renaming object: ', oldName);
  // First copy the object to the new name
  const copyRes = await fetch(`${apiURL}/${accountId}/${container}/${newName}`, {
    method: 'PUT',
    headers: {
      'x-auth-token': token,
      'Content-Length': 0,
      'X-Copy-From': `/${container}/${oldName}`,
    },
  });
  if (!copyRes.ok) throw res;
  // Then delete the old object
  const delRes = await fetch(`${apiURL}/${accountId}/${container}/${oldName}`, {
    method: 'DELETE',
    headers: {
      'x-auth-token': token,
    },
  });
  return { ok: true };
}

export async function fetchObjectMetadata(containerName, objectName, accountId, token) {
  const res = await fetch(`${apiURL}/${accountId}/${containerName}/${objectName}`, {
    method: 'HEAD',
    headers: {
      'x-auth-token': token,
    },
  });
  if (!res.ok) throw res;
  const metadata = {};
  for (const [name, value] of res.headers.entries()) {
    metadata[name] = value;
  }

  return metadata;
}
