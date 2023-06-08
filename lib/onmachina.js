export async function addContainer(containerName, isPublic, accountId, token) {
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
  console.log('Container created');
  return { ok: true };
}

export async function deleteContainer(containerName, accountId, token) {
  const res = await fetch(`https://api.testnet.onmachina.io/v1/${accountId}/${containerName}/`, {
    method: 'DELETE',
    headers: {
      'x-auth-token': token,
    },
  });
  if (!res.ok) throw res;
  return { ok: true };
}
