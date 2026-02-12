export type Languages = 'en-US';

import { default as enUS } from './locales/en-US';

export const getLocale = (lang: Languages) => {
  return enUS;
};

/*
// Could be useful for locale files to use these keys rather than hard-coded into the objects
export const keys = {
  connectorName: '{{ CONNECTORNAME }}',
  connectorShortName: '{{ CONNECTORSHORTNAME }}',
  suggestedExtensionBrowser: '{{ SUGGESTEDEXTENSIONBROWSER }}',
  walletConnectLogo: '{{ WALLETCONNECTLOGO }}',
};
*/
