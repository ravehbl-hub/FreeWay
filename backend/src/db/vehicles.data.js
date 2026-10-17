// Vehicle catalog used by seed.js (full reset) and syncVehicles.js (safe update on every deploy).
// Car photos come from Unsplash (free to use). The helper builds a resized, cropped URL.
function img(photoId) {
  return 'https://images.unsplash.com/photo-' + photoId + '?w=900&h=560&fit=crop&q=80&auto=format';
}

export const vehicles = [
  ['Peugeot 208', 'compact', 5, 'auto', 'petrol', 45, img('1605559424843-9e4c228bf1c2'), 0.105, 'Agile city car, easy to park, great fuel economy.'],
  ['Toyota Yaris Hybrid', 'compact', 5, 'auto', 'hybrid', 49, img('1502877338535-766e1452684a'), 0.085, 'Hybrid compact - ideal for city driving and low emissions.'],
  ['Fiat 500e', 'compact', 4, 'auto', 'electric', 52, img('1549317661-bd32c8ce0db2'), 0.0, 'Fully electric city car with a 250 km range.'],
  ['Volkswagen Polo', 'compact', 5, 'manual', 'petrol', 39, img('1555215695-3004980ad54e'), 0.115, 'Budget friendly manual compact.'],
  ['Hyundai Tucson', 'suv', 5, 'auto', 'hybrid', 65, img('1519641471654-76ce0107ad1b'), 0.125, 'Spacious family SUV with a large trunk.'],
  ['Volvo EX30', 'suv', 5, 'auto', 'electric', 75, img('1609521263047-f8f205293f24'), 0.0, 'Compact electric SUV, premium interior, 470 km range.'],
  ['Kia Sorento', 'suv', 7, 'auto', 'diesel', 82, img('1533473359331-0135ef1b58bf'), 0.165, '7 seats - perfect for big families and road trips.'],
  ['Mercedes C-Class', 'premium', 5, 'auto', 'petrol', 85, img('1590362891991-f776e747a588'), 0.150, 'Executive sedan for business trips.'],
  ['BMW i4', 'premium', 5, 'auto', 'electric', 110, img('1617531653332-bd46c24f2068'), 0.0, 'Electric gran coupe with sporty handling.'],
  ['Audi A6', 'premium', 5, 'auto', 'diesel', 99, img('1606664515524-ed2f786a0bd6'), 0.140, 'Comfortable long-distance premium sedan.'],
  // --- 30 more vehicles (photos from Unsplash) ---
  ['Hyundai Elantra', 'compact', 5, 'auto', 'petrol', 44, img('1619767886558-efdc259cde1a'), 0.110, 'Comfortable compact sedan with a big trunk.'],
  ['BMW 4 Series', 'compact', 4, 'auto', 'petrol', 58, img('1502877338535-766e1452684a'), 0.135, 'Sporty coupe, fun on winding roads.'],
  ['Volkswagen Beetle', 'compact', 4, 'manual', 'petrol', 41, img('1489824904134-891ab64532f1'), 0.120, 'Iconic classic look, easy to drive in the city.'],
  ['Tesla Model 3', 'compact', 5, 'auto', 'electric', 62, img('1560958089-b8a1929cea89'), 0.000, 'Electric sedan with Autopilot and 500 km range.'],
  ['Volkswagen Polo Blue', 'compact', 5, 'manual', 'petrol', 38, img('1541899481282-d53bffe3c35d'), 0.112, 'Economical city car, perfect for short trips.'],
  ['Volkswagen Golf', 'compact', 5, 'auto', 'diesel', 46, img('1471444928139-48c5bf5173f8'), 0.105, 'The all-rounder: city, highway and long drives.'],
  ['Ford F-150', 'suv', 5, 'auto', 'petrol', 95, img('1551830820-330a71b99659'), 0.230, 'Full-size pickup for gear, bikes and adventure.'],
  ['Range Rover Sport', 'suv', 5, 'auto', 'diesel', 140, img('1563720223185-11003d516935'), 0.200, 'Luxury SUV with real off-road ability.'],
  ['Porsche Panamera', 'premium', 4, 'auto', 'hybrid', 190, img('1503376780353-7e6692767b70'), 0.160, 'Four-door sports sedan with a luxurious cabin.'],
  ['Chevrolet Camaro', 'premium', 4, 'auto', 'petrol', 120, img('1552519507-da3b142c6e3d'), 0.210, 'American muscle car with a V8 soundtrack.'],
  ['Ford Mustang GT', 'premium', 4, 'manual', 'petrol', 115, img('1494976388531-d1058494cdd8'), 0.215, 'Legendary pony car, manual gearbox for purists.'],
  ['Mercedes-AMG GT', 'premium', 2, 'auto', 'petrol', 240, img('1617814076367-b759c7d7e738'), 0.250, 'Two-seat grand tourer with 500+ hp.'],
  ['BMW M4 Competition', 'premium', 4, 'auto', 'petrol', 175, img('1580273916550-e323be2ae537'), 0.205, 'Track-ready coupe that is still comfortable daily.'],
  ['McLaren 720S Spider', 'premium', 2, 'auto', 'petrol', 450, img('1542362567-b07e54358753'), 0.260, 'Supercar experience with a retractable roof.'],
  ['Nissan GT-R', 'premium', 4, 'auto', 'petrol', 220, img('1568605117036-5fe5e7bab0b7'), 0.245, '"Godzilla": brutal acceleration, all-wheel drive.'],
  ['Ferrari LaFerrari', 'premium', 2, 'auto', 'hybrid', 990, img('1583121274602-3e2820c69888'), 0.330, 'Hybrid hypercar - for a once-in-a-lifetime drive.'],
  ['Lamborghini Aventador', 'premium', 2, 'auto', 'petrol', 650, img('1571607388263-1044f9ea01dd'), 0.370, 'V12 flagship with scissor doors.'],
  ['Lamborghini Huracán Spyder', 'premium', 2, 'auto', 'petrol', 520, img('1612825173281-9a193378527e'), 0.290, 'Open-top V10 - the sound alone is worth it.'],
  ['Mercedes-AMG GT R', 'premium', 2, 'auto', 'petrol', 280, img('1553440569-bcc63803a83d'), 0.260, '"Beast of the Green Hell" in signature red.'],
  ['Lamborghini Huracán EVO', 'premium', 2, 'auto', 'petrol', 490, img('1511919884226-fd3cad34687c'), 0.285, 'Everyday-usable supercar with rear-wheel steering.'],
  ['Lamborghini Aventador S', 'premium', 2, 'auto', 'petrol', 690, img('1525609004556-c46c7d6cf023'), 0.370, 'Orange V12 icon - heads will turn.'],
  ['Chevrolet Camaro ZL1', 'premium', 4, 'auto', 'petrol', 150, img('1492144534655-ae79c964c9d7'), 0.240, 'Supercharged 650 hp muscle car.'],
  ['Bugatti Chiron', 'premium', 2, 'auto', 'petrol', 2500, img('1544636331-e26879cd4d9b'), 0.500, 'The ultimate hypercar. Chauffeur optional.'],
  ['Jaguar F-Type', 'premium', 2, 'auto', 'petrol', 165, img('1507136566006-cfc505b114fc'), 0.210, 'Elegant British sports coupe.'],
  ['Tesla Model S', 'premium', 5, 'auto', 'electric', 150, img('1536700503339-1e4b06520771'), 0.000, 'Fast, silent and spacious electric saloon.'],
  ['Tesla Roadster', 'premium', 4, 'auto', 'electric', 390, img('1617788138017-80ad40651399'), 0.000, 'Electric supercar: 0-100 km/h in about 2 seconds.'],
  ['Audi RS7 Sportback', 'premium', 5, 'auto', 'petrol', 210, img('1616422285623-13ff0162193c'), 0.225, '600 hp family car with quattro grip.'],
  ['BMW 7 Series', 'premium', 5, 'auto', 'hybrid', 185, img('1601362840469-51e4d8d58785'), 0.090, 'Executive flagship - first-class rear seats.'],
  ['Audi TT RS', 'premium', 4, 'auto', 'petrol', 140, img('1532974297617-c0f05fe48bff'), 0.195, 'Compact five-cylinder sports coupe.'],
  ['Audi A8', 'premium', 5, 'auto', 'diesel', 160, img('1555652736-e92021d28a10'), 0.150, 'Quiet luxury limousine for business travel.'],
];
