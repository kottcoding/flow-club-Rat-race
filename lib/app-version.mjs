// Public release number; independent of API_VERSION and game rules.
// Increment once per published minor update, never once per build.
export const APP_VERSION_UNITS = 100;
export const APP_VERSION = (APP_VERSION_UNITS / 100).toFixed(2);
export const APP_VERSION_LABEL = 'Ver ' + APP_VERSION;
