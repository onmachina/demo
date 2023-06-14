export async function deleteObject(container, object, accountId, token) {
  const res = await fetch(`https://api.testnet.onmachina.io/v1/${accountId}/${container}/${object}`, {
    method: 'DELETE',
    headers: {
      'x-auth-token': token,
    },
  });
  if (!res.ok) throw res;
  return { ok: true };
}
