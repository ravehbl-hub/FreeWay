// App version + build info for the "What's new" popup.
// BUILD_ID changes on every deploy (git commit id on Vercel), so the popup shows after each release.
// APP_VERSION and CHANGES are edited by hand for bigger releases.
export const APP_VERSION = '1.1.0';

// Injected by vite.config.js at build time
export const BUILD_ID = __BUILD_ID__;
export const BUILD_MESSAGE = __BUILD_MESSAGE__;
export const BUILD_DATE = __BUILD_DATE__;

// Keys of translation strings (see src/i18n) - one line per change
export const CHANGES = [
  'whatsNew.change.language',
  'whatsNew.change.google',
  'whatsNew.change.photos',
  'whatsNew.change.icon',
  'whatsNew.change.aiBooking',
];
