import Keycloak from 'keycloak-js'

const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
})

export default function loginProvider() {
  let refreshTimeout: number | undefined

  const scheduleTokenRefresh = () => {
    if (!keycloak.tokenParsed?.exp) return

    const expiresIn = keycloak.tokenParsed.exp * 1000 - Date.now()
    const refreshIn = expiresIn - 5000

    if (refreshIn <= 0) {
      console.warn('Token already expired or too close to expiry')
      return
    }

    refreshTimeout = setTimeout(async () => {
      try {
        const refreshed = await keycloak.updateToken(60)
        if (refreshed) {
          scheduleTokenRefresh()
        } else {
          console.log('Token still valid, no need to refresh')
          scheduleTokenRefresh()
        }
      } catch (err) {
        console.error('Failed to refresh token', err)
        await logout()
      }
    }, refreshIn)
  }

  const init = async (): Promise<boolean> => {
    console.log('call init...')
    const authenticated = await keycloak.init({
      pkceMethod: 'S256',
      onLoad: 'check-sso',
      redirectUri: import.meta.env.VITE_BASE_URL + "/auth/callback",
      silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
    })

    if (authenticated) {
      scheduleTokenRefresh()
    }

    return authenticated
  }

  const login = async (): Promise<void> => {
    try {
      await keycloak.login()
    } catch (error) {
      console.error('Login failed', error)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      if (refreshTimeout) {
        clearTimeout(refreshTimeout)
      }
      await keycloak.logout()
    } catch (error) {
      console.error('Logout failed', error)
    }
  }

  const getToken = (): string | undefined => keycloak.token

  const getRoles = (): string[] => {
    if (!keycloak.tokenParsed) {
      return []
    }
    const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID
    const resourceAccess = keycloak.tokenParsed.resource_access
    if (!resourceAccess || !resourceAccess[clientId]) {
      return []
    }
    return resourceAccess[clientId].roles || []
  }

  const isAuthenticated = () => {
    return keycloak.authenticated
  }

  return {
    init,
    login,
    logout,
    getToken,
    getRoles,
    isAuthenticated,
  }
}
