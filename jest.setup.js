jest.mock('@auth0/auth0-spa-js', () => ({
  Auth0Client: jest.fn().mockImplementation(() => ({
    isAuthenticated: jest.fn().mockResolvedValue(false),
    loginWithRedirect: jest.fn(),
    handleRedirectCallback: jest.fn(),
    getUser: jest.fn(),
    getIdTokenClaims: jest.fn(),
    logout: jest.fn()
  }))
}));
