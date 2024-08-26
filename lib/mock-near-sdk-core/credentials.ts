import * as nearAPI from 'near-api-js';
import { NetworkId } from '.';

export async function base64Credentials(signer: nearAPI.Signer, accountId: string, networkId: NetworkId, nonce: string, email?: string): Promise<string> {
  const accountData = Buffer.from(JSON.stringify({ id: accountId, nonce, email }));
  const signatureData = await signer.signMessage(
    accountData,
    accountId,
    networkId
  );

  const publicKey = Buffer.from(signatureData.publicKey.toString());
  const signature = Buffer.from(signatureData.signature);

  return Buffer.from(
    JSON.stringify({
      account: accountData.toString('base64'),
      publicKey: publicKey.toString('base64'),
      signature: signature.toString('base64'),
    })
  ).toString('base64');
}