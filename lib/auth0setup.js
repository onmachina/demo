import { Auth0Client } from '@auth0/auth0-spa-js';

const auth0 = new Auth0Client({
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  authorizationParams: {
    redirect_uri: window.location.origin + '/callback',
  },
});

export async function auth0Setup() {
  try {
    // Check if the user is authenticated
    const isAuthenticated = await auth0.isAuthenticated();

    if (isAuthenticated) {
      // User is authenticated
      // Get the identity token
      const user = await auth0.getIdTokenClaims();
      const token = await auth0.getTokenSilently();
      return { token, accountId: user.email, x_auth_token: token };
    } else {
      // User is not authenticated
      // Redirect to the Universal Login page
      // if not on page with callback
      if (window.location.pathname !== '/callback') auth0.loginWithRedirect();
      if (window.location.pathname === '/callback') {
        await handleAuthCallback();
        const user = await auth0.getIdTokenClaims();
        const token = await auth0.getTokenSilently();
        return { token, accountId: user.email, x_auth_token: token };
      }
    }
  } catch (error) {
    console.error('Authentication error:', error);
  }
}

export async function handleAuthCallback() {
  try {
    // Parses the hash and exchanges the code for a token
    await auth0.handleRedirectCallback();

    const user = await auth0.getUser();
    console.log('User Profile:', user);

    return user;
  } catch (error) {
    console.error('Error handling the authentication callback:', error);
  }
}
