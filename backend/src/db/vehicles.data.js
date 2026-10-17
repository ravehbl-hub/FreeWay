// Vehicle catalog used by seed.js (full reset) and syncVehicles.js (safe update on every deploy).
// Car pictures are PNG cutouts (background removed) served by the frontend from /public/cars.
// Originals are Wikimedia Commons photos of the real model - see frontend/public/cars/CREDITS.md.
function img(fileName) {
  return '/cars/' + fileName;
}

export const vehicles = [
  ['Peugeot 208', 'compact', 5, 'auto', 'petrol', 45, img('peugeot-208.png'), 0.105, 'Agile city car, easy to park, great fuel economy.'],
  ['Toyota Yaris Hybrid', 'compact', 5, 'auto', 'hybrid', 49, img('toyota-yaris-hybrid.png'), 0.085, 'Hybrid compact - ideal for city driving and low emissions.'],
  ['Fiat 500e', 'compact', 4, 'auto', 'electric', 52, img('fiat-500e.png'), 0.0, 'Fully electric city car with a 250 km range.'],
  ['Volkswagen Polo', 'compact', 5, 'manual', 'petrol', 39, img('volkswagen-polo.png'), 0.115, 'Budget friendly manual compact.'],
  ['Hyundai Tucson', 'suv', 5, 'auto', 'hybrid', 65, img('hyundai-tucson.png'), 0.125, 'Spacious family SUV with a large trunk.'],
  ['Volvo EX30', 'suv', 5, 'auto', 'electric', 75, img('volvo-ex30.png'), 0.0, 'Compact electric SUV, premium interior, 470 km range.'],
  ['Kia Sorento', 'suv', 7, 'auto', 'diesel', 82, img('kia-sorento.png'), 0.165, '7 seats - perfect for big families and road trips.'],
  ['Mercedes C-Class', 'premium', 5, 'auto', 'petrol', 85, img('mercedes-c-class.png'), 0.150, 'Executive sedan for business trips.'],
  ['BMW i4', 'premium', 5, 'auto', 'electric', 110, img('bmw-i4.png'), 0.0, 'Electric gran coupe with sporty handling.'],
  ['Audi A6', 'premium', 5, 'auto', 'diesel', 99, img('audi-a6.png'), 0.140, 'Comfortable long-distance premium sedan.'],
  // --- 30 more vehicles ---
  ['Hyundai Elantra', 'compact', 5, 'auto', 'petrol', 44, img('hyundai-elantra.png'), 0.110, 'Comfortable compact sedan with a big trunk.'],
  ['BMW 4 Series', 'compact', 4, 'auto', 'petrol', 58, img('bmw-4-series.png'), 0.135, 'Sporty coupe, fun on winding roads.'],
  ['Volkswagen Beetle', 'compact', 4, 'manual', 'petrol', 41, img('volkswagen-beetle.png'), 0.120, 'Iconic classic look, easy to drive in the city.'],
  ['Tesla Model 3', 'compact', 5, 'auto', 'electric', 62, img('tesla-model-3.png'), 0.000, 'Electric sedan with Autopilot and 500 km range.'],
  ['Volkswagen Polo Blue', 'compact', 5, 'manual', 'petrol', 38, img('volkswagen-polo-blue.png'), 0.112, 'Economical city car, perfect for short trips.'],
  ['Volkswagen Golf', 'compact', 5, 'auto', 'diesel', 46, img('volkswagen-golf.png'), 0.105, 'The all-rounder: city, highway and long drives.'],
  ['Ford F-150', 'suv', 5, 'auto', 'petrol', 95, img('ford-f-150.png'), 0.230, 'Full-size pickup for gear, bikes and adventure.'],
  ['Range Rover Sport', 'suv', 5, 'auto', 'diesel', 140, img('range-rover-sport.png'), 0.200, 'Luxury SUV with real off-road ability.'],
  ['Porsche Panamera', 'premium', 4, 'auto', 'hybrid', 190, img('porsche-panamera.png'), 0.160, 'Four-door sports sedan with a luxurious cabin.'],
  ['Chevrolet Camaro', 'premium', 4, 'auto', 'petrol', 120, img('chevrolet-camaro.png'), 0.210, 'American muscle car with a V8 soundtrack.'],
  ['Ford Mustang GT', 'premium', 4, 'manual', 'petrol', 115, img('ford-mustang-gt.png'), 0.215, 'Legendary pony car, manual gearbox for purists.'],
  ['Mercedes-AMG GT', 'premium', 2, 'auto', 'petrol', 240, img('mercedes-amg-gt.png'), 0.250, 'Two-seat grand tourer with 500+ hp.'],
  ['BMW M4 Competition', 'premium', 4, 'auto', 'petrol', 175, img('bmw-m4-competition.png'), 0.205, 'Track-ready coupe that is still comfortable daily.'],
  ['McLaren 720S Spider', 'premium', 2, 'auto', 'petrol', 450, img('mclaren-720s-spider.png'), 0.260, 'Supercar experience with a retractable roof.'],
  ['Nissan GT-R', 'premium', 4, 'auto', 'petrol', 220, img('nissan-gt-r.png'), 0.245, '"Godzilla": brutal acceleration, all-wheel drive.'],
  ['Ferrari LaFerrari', 'premium', 2, 'auto', 'hybrid', 990, img('ferrari-laferrari.png'), 0.330, 'Hybrid hypercar - for a once-in-a-lifetime drive.'],
  ['Lamborghini Aventador', 'premium', 2, 'auto', 'petrol', 650, img('lamborghini-aventador.png'), 0.370, 'V12 flagship with scissor doors.'],
  ['Lamborghini Huracán Spyder', 'premium', 2, 'auto', 'petrol', 520, img('lamborghini-huracan-spyder.png'), 0.290, 'Open-top V10 - the sound alone is worth it.'],
  ['Mercedes-AMG GT R', 'premium', 2, 'auto', 'petrol', 280, img('mercedes-amg-gt-r.png'), 0.260, '"Beast of the Green Hell" in signature red.'],
  ['Lamborghini Huracán EVO', 'premium', 2, 'auto', 'petrol', 490, img('lamborghini-huracan-evo.png'), 0.285, 'Everyday-usable supercar with rear-wheel steering.'],
  ['Lamborghini Aventador S', 'premium', 2, 'auto', 'petrol', 690, img('lamborghini-aventador-s.png'), 0.370, 'Orange V12 icon - heads will turn.'],
  ['Chevrolet Camaro ZL1', 'premium', 4, 'auto', 'petrol', 150, img('chevrolet-camaro-zl1.png'), 0.240, 'Supercharged 650 hp muscle car.'],
  ['Bugatti Chiron', 'premium', 2, 'auto', 'petrol', 2500, img('bugatti-chiron.png'), 0.500, 'The ultimate hypercar. Chauffeur optional.'],
  ['Jaguar F-Type', 'premium', 2, 'auto', 'petrol', 165, img('jaguar-f-type.png'), 0.210, 'Elegant British sports coupe.'],
  ['Tesla Model S', 'premium', 5, 'auto', 'electric', 150, img('tesla-model-s.png'), 0.000, 'Fast, silent and spacious electric saloon.'],
  ['Tesla Roadster', 'premium', 4, 'auto', 'electric', 390, img('tesla-roadster.png'), 0.000, 'Electric supercar: 0-100 km/h in about 2 seconds.'],
  ['Audi RS7 Sportback', 'premium', 5, 'auto', 'petrol', 210, img('audi-rs7-sportback.png'), 0.225, '600 hp family car with quattro grip.'],
  ['BMW 7 Series', 'premium', 5, 'auto', 'hybrid', 185, img('bmw-7-series.png'), 0.090, 'Executive flagship - first-class rear seats.'],
  ['Audi TT RS', 'premium', 4, 'auto', 'petrol', 140, img('audi-tt-rs.png'), 0.195, 'Compact five-cylinder sports coupe.'],
  ['Audi A8', 'premium', 5, 'auto', 'diesel', 160, img('audi-a8.png'), 0.150, 'Quiet luxury limousine for business travel.'],
];
