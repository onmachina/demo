import { authProvider } from './auth';
import { json } from 'react-router-dom';

export const apiURL = import.meta.env.VITE_API_URL + '/v1';
export const metricsURL = import.meta.env.VITE_API_URL + '/metrics';

export async function addContainer(containerName: string, isPublic: boolean): Promise<{ ok: boolean }> {
  let headers = [];
  if (isPublic) {
    // set an ACL to allow anybody to get an object in this container
    headers['x-container-read'] = '.r:*';
  }

  const res = await authenticatedFetch(`/${containerName}/`, {
    method: 'PUT',
    headers: headers,
  });

  if (!res.ok) throw res;
  return { ok: true };
}

export async function deleteContainer(container: string): Promise<{ ok: boolean }> {
  const res = await authenticatedFetch(`/${container}/`, {
    method: 'DELETE',
  });

  if (!res.ok) throw res;
  return { ok: true };
}

export async function fetchContainerMetadata(containerName: string): Promise<Object> {
  const response = await authenticatedFetch(`/${containerName}`, {
    method: 'HEAD',
  });
  const metadata = {};
  for (const [name, value] of response.headers.entries()) {
    metadata[name] = value;
  }

  return metadata;
}

export async function uploadObject(container: string, file: File): Promise<{ ok: boolean }> {
  const res = await authenticatedFetch(`/${container}/${file.name}`, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  });
  if (!res.ok) throw res;
  return { ok: true };
}

export async function deleteObject(container: string, object: string): Promise<{ ok: boolean }> {
  const res = await authenticatedFetch(`/${container}/${object}`, {
    method: 'DELETE',
  });

  if (!res.ok) throw res;
  return { ok: true };
}

export async function renameObject({
  container,
  oldName,
  newName,
}: {
  container: string;
  oldName: string;
  newName: string;
}): Promise<{ ok: boolean }> {
  console.log('renaming object: ', oldName);
  // First copy the object to the new name
  const copyRes = await authenticatedFetch(`/${container}/${newName}`, {
    method: 'PUT',
    headers: {
      'Content-Length': '0',
      'X-Copy-From': `/${container}/${oldName}`,
    },
  });
  if (!copyRes.ok) throw copyRes;
  // Then delete the old object
  const delRes = await authenticatedFetch(`/${container}/${oldName}`, {
    method: 'DELETE',
  });
  if (!delRes.ok) throw copyRes;
  return { ok: true };
}

export async function fetchObjectMetadata(containerName: string, objectName: string) {
  const res = await authenticatedFetch(`/${containerName}/${objectName}`, {
    method: 'HEAD',
  });
  if (!res.ok) throw res;
  const metadata = {};
  for (const [name, value] of res.headers.entries()) {
    metadata[name] = value;
  }

  return metadata;
}

export async function authenticatedFetch(path: string, options?: RequestInit) {
  const user = await authProvider.getUser();
  if (!user.emailVerified) {
    throw json(
      {
        code: 'ERR_EMAIL_NOT_VERIFIED',
      },
      { status: 401 },
    );
  }
  const token = await authProvider.accessToken();
  const requestOpts = {
    ...options,
    headers: {
      ...options?.headers,
      'x-auth-token': token || '',
    },
  };
  return fetch(`${apiURL}/${user.name}${path}`, requestOpts);
}

export async function fetchMetrics() {
  const user = await authProvider.getUser();
  if (!user.emailVerified) {
    throw json(
      {
        code: 'ERR_EMAIL_NOT_VERIFIED',
      },
      { status: 401 },
    );
  }
  const accountID = user.name;
  const token = await authProvider.accessToken();
  console.log('metrics url', `${metricsURL}/${accountID}`);
  const response = await fetch(`${metricsURL}/${accountID}`, {
    headers: {
      'x-auth-token': token || '',
    },
  });
  if (!response.ok) {
    throw json(
      {
        code: 'ERR_STATS_UNAVAILABLE',
      },
      { status: 401 },
    );
  }
  const data = await response.json();
  console.log('metrics', data);
  return data;
}
