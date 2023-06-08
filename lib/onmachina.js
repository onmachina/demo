const apiURL = 'https://api.testnet.onmachina.io/v1';
const authURL = 'https://auth.testnet.onmachina.io/v1';

let authAttemptsRemaining = 3;

// retrieve an auth token from local storage & checks to ensure its valid
export async function getAuthToken(accountID) {
  const storedAuthToken = localStorage.getItem('authToken');
  const storedAuthTokenIsValid = await authCheck(accountID, storedAuthToken);

  if (storedAuthToken && storedAuthTokenIsValid) {
    return storedAuthToken;
  } else {
    return await refreshAuthToken(accountID);
  }
}

// refresh the auth token only if max attempts have not been exceeded
export async function refreshAuthToken(accountID) {
  if (authAttemptsRemaining <= 0) {
    throw new Error('auth token refresh with OnMachina failed');
  }
  authAttemptsRemaining--;
  const newAuthToken = await newAuthTokenFromAPI(accountID);
  localStorage.setItem('authToken', newAuthToken);
  return newAuthToken;
}

// retrieve an auth token from OnMachina
// every call will generate a new auth token
export async function newAuthTokenFromAPI(accountID) {
  console.log('requesting auth token from OnMachina...');
  const credentials = Buffer.from(
    JSON.stringify({
      account: accountData.toString('base64'),
      publicKey: publicKey.toString('base64'),
      signature: signature.toString('base64'),
    }),
  ).toString('base64');

  const response = await fetch(authURL, {
    method: 'GET',
    headers: {
      'x-auth-user': accountID,
      'x-auth-key': credentials,
    },
  });

  const x_auth_token = response.headers.get('x-auth-token');
  console.log('x_auth_token: ', x_auth_token);
  return x_auth_token;
}

// check if the auth token is valid
export async function authCheck(accountID, authToken) {
  const res = await fetch(`https://api.testnet.onmachina.io/v1/${accountID}/?format=json`, {
    method: 'HEAD',
    headers: {
      'x-auth-token': authToken,
    },
  });
  // reset the authAttemptsRemaining if the auth token is valid
  if (res.status !== 401) authAttemptsRemaining = 3;
  return res.status !== 401;
}

// API calls for containers

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

// API calls for objects

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
