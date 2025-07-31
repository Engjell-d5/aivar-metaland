# SSO Implementation Guide

This document explains how to use the Single Sign-On (SSO) implementation for the Aivar Metaland application.

## Overview

The SSO implementation uses OpenID Connect (OIDC) with the following configuration:
- **Host**: `auth.staging.aisharing.ai`
- **Client ID**: `aivarmetaland-client`
- **Realm**: `ais`
- **OIDC Config**: `https://auth.staging.aisharing.ai/realms/ais/.well-known/openid-configuration`

## Features

- ✅ Single Sign-On authentication
- ✅ Automatic token refresh
- ✅ User profile display
- ✅ Secure logout
- ✅ Mobile and desktop support
- ✅ Error handling

## How to Use

### 1. Login
Click the "Login" button in the navigation bar. This will redirect you to the SSO provider's login page.

### 2. Authentication Flow
1. User clicks "Login"
2. Redirected to `auth.staging.aisharing.ai`
3. User enters credentials
4. Redirected back to the application
5. User profile is displayed

### 3. User Profile
When authenticated, a user profile card will appear in the top-right corner showing:
- Profile picture (if available)
- Name
- Email
- Email verification status
- Logout button

### 4. Logout
Click the "Logout" button in the navigation bar or the logout button in the user profile card.

## Technical Implementation

### Files Created/Modified

1. **`src/services/authService.ts`** - Core authentication service
2. **`src/contexts/AuthContext.tsx`** - React context for auth state
3. **`src/components/AuthCallback.tsx`** - Handles OIDC callback
4. **`src/components/UserProfile.tsx`** - User profile display component
5. **`public/silent-renew.html`** - Silent token refresh
6. **`src/components/NavBar.tsx`** - Updated with SSO login/logout
7. **`src/App.tsx`** - Added AuthProvider and callback route
8. **`src/pages/HomePage.tsx`** - Added user profile display

### Key Components

#### AuthService
- Manages OIDC authentication flow
- Handles token refresh
- Stores user information
- Provides authentication state

#### AuthContext
- React context for authentication state
- Provides login/logout functions
- Manages loading states
- Exposes user information

#### AuthCallback
- Handles the OIDC redirect callback
- Processes authentication response
- Redirects to home page on success
- Shows error messages on failure

## Configuration

The SSO configuration is defined in `src/services/authService.ts` and supports environment variables:

```typescript
const getSsoConfig = () => {
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const isVercel = window.location.hostname.includes('vercel.app');
  
  return {
    authority: import.meta.env.VITE_SSO_AUTHORITY || 
               (isDevelopment 
                 ? 'https://auth.staging.aisharing.ai/realms/ais'
                 : 'https://auth.production.aisharing.ai/realms/ais'),
    client_id: import.meta.env.VITE_SSO_CLIENT_ID || 'aivarmetaland-client',
    redirect_uri: import.meta.env.VITE_SSO_REDIRECT_URI || `${window.location.origin}/#/callback`,
    post_logout_redirect_uri: import.meta.env.VITE_SSO_POST_LOGOUT_REDIRECT_URI || `${window.location.origin}/#/`,
    response_type: 'code',
    scope: 'openid profile email',
    loadUserInfo: true,
    automaticSilentRenew: true,
    silent_redirect_uri: import.meta.env.VITE_SSO_SILENT_REDIRECT_URI || `${window.location.origin}/silent-renew.html`,
    stateStore: new WebStorageStateStore({ store: window.localStorage }),
  };
};
```

### Environment Variables

The application supports the following environment variables:

- `VITE_SSO_AUTHORITY`: SSO provider authority URL
- `VITE_SSO_CLIENT_ID`: SSO client ID
- `VITE_SSO_REDIRECT_URI`: Custom redirect URI (optional)
- `VITE_SSO_POST_LOGOUT_REDIRECT_URI`: Custom post-logout redirect URI (optional)
- `VITE_SSO_SILENT_REDIRECT_URI`: Custom silent renew redirect URI (optional)

## Security Features

- **Token Storage**: Tokens are stored securely in localStorage
- **Automatic Refresh**: Access tokens are automatically refreshed before expiration
- **Secure Logout**: Proper cleanup of tokens and session data
- **Error Handling**: Comprehensive error handling for authentication failures

## Troubleshooting

### Common Issues

1. **Redirect URI Mismatch**
   - Ensure the redirect URI in your SSO provider matches: `http://localhost:5173/#/callback`
   - For production, update to your actual domain

2. **CORS Issues**
   - Ensure your SSO provider allows requests from your application domain
   - Check browser console for CORS errors

3. **Token Refresh Failures**
   - Check network connectivity
   - Verify silent renew configuration
   - Check browser console for errors

### Debug Mode

To enable debug logging, add this to your browser console:
```javascript
localStorage.setItem('oidc.debug', 'true');
```

## Production Deployment

### Vercel Deployment

The application is configured for deployment on Vercel at: https://aivar-metaland-zsdj.vercel.app/

#### Environment Variables Setup

Add these environment variables in your Vercel dashboard:

```bash
VITE_SSO_AUTHORITY=https://auth.staging.aisharing.ai/realms/ais
VITE_SSO_CLIENT_ID=aivarmetaland-client
VITE_SSO_REDIRECT_URI=https://aivar-metaland-zsdj.vercel.app/#/callback
VITE_SSO_POST_LOGOUT_REDIRECT_URI=https://aivar-metaland-zsdj.vercel.app/#/
VITE_SSO_SILENT_REDIRECT_URI=https://aivar-metaland-zsdj.vercel.app/silent-renew.html
```

#### SSO Provider Configuration

In your SSO provider admin panel, add these redirect URIs:

**Valid Redirect URIs:**
- `https://aivar-metaland-zsdj.vercel.app/#/callback`

**Valid Post-Logout Redirect URIs:**
- `https://aivar-metaland-zsdj.vercel.app/#/`

**Valid Silent Renew URIs:**
- `https://aivar-metaland-zsdj.vercel.app/silent-renew.html`

### General Production Deployment

Before deploying to production:

1. Update the `VITE_SSO_AUTHORITY` to your production SSO server
2. Update redirect URIs to your production domain
3. Ensure your SSO provider is configured for your production domain
4. Test the complete authentication flow in production environment

## Dependencies

- `oidc-client-ts` - OIDC client library
- `react-router-dom` - Routing (already present)
- `framer-motion` - Animations (already present)

## Browser Support

The implementation supports all modern browsers that support:
- ES6+ features
- LocalStorage
- Fetch API
- Promise API 