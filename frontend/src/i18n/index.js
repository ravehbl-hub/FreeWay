// i18n index: the two dictionaries + a tiny translate helper (no library needed)
import en from './en.js';
import he from './he.js';

export const languages = { en: en, he: he };

// Returns the text for the key. If the key is unknown (for example a message that came
// from the server) the key itself is returned, so nothing ever disappears from the screen.
export function translate(dict, key) {
  if (key && Object.prototype.hasOwnProperty.call(dict, key)) {
    return dict[key];
  }
  return key;
}
