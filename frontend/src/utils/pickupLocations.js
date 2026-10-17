// The pickup locations FreeWay offers (used in the booking form, filters and the map).
// Every location has one car of each model. Keep the names identical to backend/src/config/pickupLocations.js.
export const PICKUP_PLACES = [
  { name: 'Tel Aviv - Downtown', lat: 32.0853, lng: 34.7818 },
  { name: 'Ben Gurion Airport', lat: 32.0055, lng: 34.8854 },
  { name: 'Jerusalem - Center', lat: 31.7818, lng: 35.2174 },
  { name: 'Haifa - Port', lat: 32.8191, lng: 34.9983 },
  { name: 'Eilat - Hotel Area', lat: 29.552, lng: 34.956 },
  { name: 'Lod', lat: 31.9516, lng: 34.8953 },
  { name: 'Holon', lat: 32.0158, lng: 34.7874 },
  { name: 'Hadera', lat: 32.434, lng: 34.9197 },
  { name: 'Haifa', lat: 32.794, lng: 34.9896 },
  { name: 'Beer Sheva', lat: 31.2518, lng: 34.7913 },
  { name: 'Ashdod', lat: 31.8014, lng: 34.6435 },
];

// Just the names, for selects and validation
export const PICKUP_LOCATIONS = PICKUP_PLACES.map((place) => place.name);
