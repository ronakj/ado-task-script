import * as api from 'azure-devops-node-api';
import { IRequestOptions } from 'azure-devops-node-api/interfaces/common/VsoBaseInterfaces';
import * as tl from 'azure-pipelines-task-lib/task';

export function getWebApiWithProxy(options: IRequestOptions = {}): api.WebApi {
  const uri = process.env["API_URL"] || tl.getVariable("System.CollectionUri");
  const accessToken = process.env["API_TOKEN"] || tl.getEndpointAuthorizationParameter('SYSTEMVSSCONNECTION', 'AccessToken', false);
  if (!uri || !accessToken) {
    throw new Error("Could not get access token");
  }
  tl.setSecret(accessToken);
  const credentialHandler = api.getBasicHandler('vsts', accessToken);
  const defaultOptions: IRequestOptions = {
    proxy: tl.getHttpProxyConfiguration(uri) || undefined,
    allowRetries: true,
    maxRetries: 5,
    keepAlive: true
  };

  return new api.WebApi(uri, credentialHandler, { ...defaultOptions, ...options });
}