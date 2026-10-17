// The pickup locations FreeWay offers (used in the booking form, filters and the map).
// Every location has one car of each model. Keep the names identical to backend/src/config/pickupLocations.js.
// "aliases" are other ways people write the place in chat (English and Hebrew), used by the AI quick booking.
export const PICKUP_PLACES = [
  { name: 'Tel Aviv - Downtown', lat: 32.0853, lng: 34.7818, aliases: ['tel aviv', 'tlv', 'תל אביב', 'ת"א'] },
  { name: 'Ben Gurion Airport', lat: 32.0055, lng: 34.8854, aliases: ['ben gurion', 'airport', 'נתב"ג', 'בן גוריון', 'שדה התעופה'] },
  { name: 'Jerusalem - Center', lat: 31.7818, lng: 35.2174, aliases: ['jerusalem', 'ירושלים'] },
  { name: 'Haifa - Port', lat: 32.8191, lng: 34.9983, aliases: ['haifa port', 'נמל חיפה'] },
  { name: 'Eilat - Hotel Area', lat: 29.552, lng: 34.956, aliases: ['eilat', 'אילת'] },
  { name: 'Lod', lat: 31.9516, lng: 34.8953, aliases: ['lod', 'לוד'] },
  { name: 'Holon', lat: 32.0158, lng: 34.7874, aliases: ['holon', 'חולון'] },
  { name: 'Hadera', lat: 32.434, lng: 34.9197, aliases: ['hadera', 'חדרה'] },
  { name: 'Haifa', lat: 32.794, lng: 34.9896, aliases: ['haifa', 'חיפה'] },
  { name: 'Beer Sheva', lat: 31.2518, lng: 34.7913, aliases: ['beer sheva', 'beersheba', 'באר שבע'] },
  { name: 'Ashdod', lat: 31.8014, lng: 34.6435, aliases: ['ashdod', 'אשדוד'] },
];

// Just the names, for selects and validation
export const PICKUP_LOCATIONS = PICKUP_PLACES.map((place) => place.name);
