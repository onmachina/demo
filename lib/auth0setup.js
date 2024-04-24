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
    // Attempt to restore the session from local storage
    // This will automatically handle checking if the user is authenticated
    // based on tokens available in local storage or in-memory.
    const isAuthenticated = await auth0.isAuthenticated();
    console.log('user is authenticated: ', isAuthenticated);

    if (isAuthenticated) {
      // User is already authenticated, retrieve tokens
      const user = await auth0.getIdTokenClaims();
      const token = await auth0.getTokenSilently();
      return { token, accountId: user.email, x_auth_token: token };
    } else {
      // User is not authenticated
      if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
        // The page is loading the callback URL with the code and state
        // Handle the authentication callback if the current page is the callback route
        await auth0.handleRedirectCallback();
        const isAuthenticated = await auth0.isAuthenticated();
        const user = await auth0.getIdTokenClaims();
        const token = await auth0.getTokenSilently();
        return { token, accountId: user.email, x_auth_token: token };
        // After handling callback, redirect to a default logged-in page
        // window.location.assign('/');
      } else {
        // If not in the callback URL, initiate login
        auth0.loginWithRedirect();
      }
    }
  } catch (error) {
    console.error('Authentication error:', error);
    // Handle or log error appropriately
    // Optional: Redirect to an error page or display a message
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
