interface AppConfig {
  // SSO Configuration
  sso: {
    authority: string
    clientId: string
    redirectUri: string
    postLogoutRedirectUri: string
    silentRedirectUri: string
  }
  
  // ElevenLabs Configuration
  elevenLabs: {
    agentId: string
  }
  
  // Environment
  isDevelopment: boolean
  isProduction: boolean
  
  // Feature Flags
  features: {
    voiceChat: boolean
    animations: boolean
  }
}

class ConfigService {
  private config: AppConfig

  constructor() {
    this.config = this.buildConfig()
  }

  private buildConfig(): AppConfig {
    const isDevelopment = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1'
    
    return {
      sso: {
        authority: import.meta.env.VITE_SSO_AUTHORITY || 
                   (isDevelopment 
                     ? 'https://auth.staging.aisharing.ai/realms/ais'
                     : 'https://auth.production.aisharing.ai/realms/ais'),
        clientId: import.meta.env.VITE_SSO_CLIENT_ID || 'aivarmetaland-client',
        redirectUri: import.meta.env.VITE_SSO_REDIRECT_URI || `${window.location.origin}/#/callback`,
        postLogoutRedirectUri: import.meta.env.VITE_SSO_POST_LOGOUT_REDIRECT_URI || `${window.location.origin}/#/`,
        silentRedirectUri: import.meta.env.VITE_SSO_SILENT_REDIRECT_URI || `${window.location.origin}/silent-renew.html`,
      },
      elevenLabs: {
        agentId: import.meta.env.VITE_ELEVENLABS_AGENT_ID || '',
      },
      isDevelopment,
      isProduction: !isDevelopment,
      features: {
        voiceChat: true,
        animations: true,
      }
    }
  }

  get(): AppConfig {
    return this.config
  }

  getSsoConfig() {
    return this.config.sso
  }

  getElevenLabsConfig() {
    return this.config.elevenLabs
  }

  isFeatureEnabled(feature: keyof AppConfig['features']): boolean {
    return this.config.features[feature]
  }
}

export const configService = new ConfigService()
export default configService 