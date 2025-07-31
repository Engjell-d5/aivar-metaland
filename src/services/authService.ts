import { UserManager, User, WebStorageStateStore } from 'oidc-client-ts';
import configService from './configService';

// Environment-based SSO Configuration
const getSsoConfig = () => {
  const ssoConfig = configService.getSsoConfig();
  
  return {
    authority: ssoConfig.authority,
    client_id: ssoConfig.clientId,
    redirect_uri: ssoConfig.redirectUri,
    post_logout_redirect_uri: ssoConfig.postLogoutRedirectUri,
    response_type: 'code',
    scope: 'openid profile email',
    loadUserInfo: true,
    automaticSilentRenew: true,
    silent_redirect_uri: ssoConfig.silentRedirectUri,
    stateStore: new WebStorageStateStore({ store: window.localStorage }),
  };
};

class AuthService {
  private userManager: UserManager;
  private user: User | null = null;

  constructor() {
    this.userManager = new UserManager(getSsoConfig());
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.userManager.events.addUserLoaded((user) => {
      console.log('User loaded:', user);
      this.user = user;
    });

    this.userManager.events.addUserUnloaded(() => {
      console.log('User unloaded');
      this.user = null;
    });

    this.userManager.events.addAccessTokenExpiring(() => {
      console.log('Access token expiring');
    });

    this.userManager.events.addAccessTokenExpired(() => {
      console.log('Access token expired');
      this.signinSilent();
    });

    this.userManager.events.addSilentRenewError((error) => {
      console.error('Silent renew error:', error);
    });

    this.userManager.events.addUserSignedOut(() => {
      console.log('User signed out');
      this.user = null;
    });
  }

  async initialize(): Promise<void> {
    try {
      const user = await this.userManager.getUser();
      if (user && !user.expired) {
        this.user = user;
        console.log('User restored from storage:', user);
      }
    } catch (error) {
      console.error('Error initializing auth service:', error);
    }
  }

  async signin(): Promise<void> {
    try {
      await this.userManager.signinRedirect();
    } catch (error) {
      console.error('Signin error:', error);
      throw error;
    }
  }

  async signinRedirectCallback(): Promise<User> {
    try {
      const user = await this.userManager.signinRedirectCallback();
      this.user = user;
      return user;
    } catch (error) {
      console.error('Signin redirect callback error:', error);
      throw error;
    }
  }

  async signout(): Promise<void> {
    try {
      await this.userManager.signoutRedirect();
    } catch (error) {
      console.error('Signout error:', error);
      throw error;
    }
  }

  async signinSilent(): Promise<User | null> {
    try {
      const user = await this.userManager.signinSilent();
      this.user = user;
      return user;
    } catch (error) {
      console.error('Silent signin error:', error);
      return null;
    }
  }

  getUser(): User | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return this.user !== null && !this.user.expired;
  }

  getAccessToken(): string | null {
    return this.user?.access_token || null;
  }

  getIdToken(): string | null {
    return this.user?.id_token || null;
  }

  getUserInfo() {
    return this.user?.profile || null;
  }
}

// Create a singleton instance
export const authService = new AuthService();
export default authService; 