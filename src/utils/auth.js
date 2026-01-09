import { PublicClientApplication } from '@azure/msal-browser';
import { ConnectionSettings } from '@microsoft/agents-copilotstudio-client';

const tenantId = import.meta.env.VITE_TENANT_ID;
const clientId = import.meta.env.VITE_APP_CLIENT_ID;

const msalConfig = {
  auth: {
    clientId: clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    redirectUri: window.location.origin,
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

export async function acquireToken() {
  await msalInstance.initialize();

  const accounts = msalInstance.getAllAccounts();
  const request = {
    scopes: ['https://api.powerplatform.com/.default'],
    account: accounts[0],
  };

  try {
    if (accounts.length > 0) {
      const response = await msalInstance.acquireTokenSilent(request);
      return response.accessToken;
    }
    throw { errorCode: 'interaction_required' };
  } catch (error) {
    if (error.errorCode === 'interaction_required' ||
        error.errorCode === 'consent_required' ||
        error.errorCode === 'login_required' ||
        !accounts.length) {
      const response = await msalInstance.acquireTokenPopup(request);
      return response.accessToken;
    }
    throw error;
  }
}

export function getConnectionSettings() {
  return new ConnectionSettings({
    appClientId: clientId,
    tenantId: tenantId,
    environmentId: import.meta.env.VITE_ENVIRONMENT_ID,
    agentIdentifier: import.meta.env.VITE_AGENT_IDENTIFIER,
  });
}
