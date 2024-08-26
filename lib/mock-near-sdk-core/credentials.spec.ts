import * as nearAPI from 'near-api-js';
import { base64Credentials } from './credentials';

test("generates NEAR auth credentials [base64(JSON)]", async () => {
  const NETWORK_ID = "sandbox";
  const ACCOUNT_ID = "alice.test.near";
  const SECRET_KEY = "ed25519:57UCM1YnJvVKiRPaNxoKa8rGxaL84t9EMJb8uUMxuhSdZbq7YWQKVcCHKi33RoTGe3wv68t3cdxJ9WeyQSNGpuj9";
  const EMAIL = "any@mail.com";
  const privKey = nearAPI.utils.KeyPair.fromString(SECRET_KEY);
  const keyStore = new nearAPI.keyStores.InMemoryKeyStore();
  keyStore.setKey(NETWORK_ID, ACCOUNT_ID, privKey);

  const signer = new nearAPI.InMemorySigner(keyStore);

  const credentials = await base64Credentials(signer, ACCOUNT_ID, NETWORK_ID, "nonce 1", EMAIL);
  const decoded = JSON.parse(Buffer.from(credentials, 'base64').toString('utf-8'));
  const account = JSON.parse(Buffer.from(decoded['account'], 'base64').toString('utf-8'));
  expect(account['id']).toBe(ACCOUNT_ID);
  expect(account['nonce']).toBe("nonce 1");
  expect(account['email']).toBe(EMAIL);

  const credentials2 = await base64Credentials(signer, ACCOUNT_ID, NETWORK_ID, "nonce 2", EMAIL);
  expect(credentials).not.toBe(credentials2);
});