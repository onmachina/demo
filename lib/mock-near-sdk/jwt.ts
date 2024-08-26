export const decodeJwt = (token: string): any => {
  const parts = token.split('.');
  const [header, payload, signature] = parts;

  if (parts.length !== 3 || !header || !payload || !signature) {
    throw new Error('ID token could not be decoded');
  }
  return JSON.parse(atob(payload));
};
