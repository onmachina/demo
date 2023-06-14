export async function deleteContainer(container, accountId, token) {
  console.log('deleting container...');
  console.log('account id is ' + accountId);
  console.log(`https://api.testnet.onmachina.io/v1/${accountId}/${container}/`);
  const res = await fetch(`https://api.testnet.onmachina.io/v1/${accountId}/${container}/`, {
    method: 'DELETE',
    headers: {
      'x-auth-token': token,
    },
  });
  if (!res.ok) throw res;
  return { ok: true };
}
