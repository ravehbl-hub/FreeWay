// Vehicle catalog used by seed.js (full reset) and syncVehicles.js (safe update on every deploy).
// Car photos come from Wikimedia Commons (free licenses), one photo of the real model per car.
// Special:FilePath returns the original file; width=900 asks Commons for a resized copy.
function img(fileName) {
  return 'https://commons.wikimedia.org/wiki/Special:FilePath/' + encodeURIComponent(fileName) + '?width=900';
}

export const vehicles = [
  ['Peugeot 208', 'compact', 5, 'auto', 'petrol', 45, img('Peugeot e-208 facelift Auto Zuerich 2023 1X7A1204.jpg'), 0.105, 'Agile city car, easy to park, great fuel economy.'],
  ['Toyota Yaris Hybrid', 'compact', 5, 'auto', 'hybrid', 49, img('2020 Toyota Yaris Hybrid E-Four (Red).jpg'), 0.085, 'Hybrid compact - ideal for city driving and low emissions.'],
  ['Fiat 500e', 'compact', 4, 'auto', 'electric', 52, img('Fiat 500e SDQ 03 2020 2775.jpg'), 0.0, 'Fully electric city car with a 250 km range.'],
  ['Volkswagen Polo', 'compact', 5, 'manual', 'petrol', 39, img('VW Polo IV 9N 3-Türer.jpg'), 0.115, 'Budget friendly manual compact.'],
  ['Hyundai Tucson', 'suv', 5, 'auto', 'hybrid', 65, img('Hyundai Tucson facelift (rear).jpg'), 0.125, 'Spacious family SUV with a large trunk.'],
  ['Volvo EX30', 'suv', 5, 'auto', 'electric', 75, img('Volvo EX30 Auto Zuerich 2023 1X7A0949.jpg'), 0.0, 'Compact electric SUV, premium interior, 470 km range.'],
  ['Kia Sorento', 'suv', 7, 'auto', 'diesel', 82, img('KIA Sorento 2022 test drive car, Forsage car showroom, Saint Petersburg November 2022.jpg'), 0.165, '7 seats - perfect for big families and road trips.'],
  ['Mercedes C-Class', 'premium', 5, 'auto', 'petrol', 85, img('Mercedes-Benz C 220 BlueTEC Exclusive (W 205) – Frontansicht, 12. Juli 2014, Düsseldorf.jpg'), 0.150, 'Executive sedan for business trips.'],
  ['BMW i4', 'premium', 5, 'auto', 'electric', 110, img('SIN BMW i4 showcar rear @ The Car Show 2023 2023-10-14.jpg'), 0.0, 'Electric gran coupe with sporty handling.'],
  ['Audi A6', 'premium', 5, 'auto', 'diesel', 99, img('2018 Audi A6 TDi Quattro Front.jpg'), 0.140, 'Comfortable long-distance premium sedan.'],
  // --- 30 more vehicles ---
  ['Hyundai Elantra', 'compact', 5, 'auto', 'petrol', 44, img('Hyundai Avante N CN7 black test car (5).jpg'), 0.110, 'Comfortable compact sedan with a big trunk.'],
  ['BMW 4 Series', 'compact', 4, 'auto', 'petrol', 58, img('2020 BMW 4.jpg'), 0.135, 'Sporty coupe, fun on winding roads.'],
  ['Volkswagen Beetle', 'compact', 4, 'manual', 'petrol', 41, img('Oranger VW New Beetle 20210524 DSC09751.jpg'), 0.120, 'Iconic classic look, easy to drive in the city.'],
  ['Tesla Model 3', 'compact', 5, 'auto', 'electric', 62, img('Tesla Model 3 (2023) Auto Zuerich 2023 1X7A1313.jpg'), 0.000, 'Electric sedan with Autopilot and 500 km range.'],
  ['Volkswagen Polo Blue', 'compact', 5, 'manual', 'petrol', 38, img('Volkswagen Polo VI R-Line (2021) Auto Zuerich 2021 IMG 0217.jpg'), 0.112, 'Economical city car, perfect for short trips.'],
  ['Volkswagen Golf', 'compact', 5, 'auto', 'diesel', 46, img('2020 Volkswagen Golf Style 1.5 Front.jpg'), 0.105, 'The all-rounder: city, highway and long drives.'],
  ['Ford F-150', 'suv', 5, 'auto', 'petrol', 95, img('Moscow, Ford F-150 14th gen black, Oct 2026 01.jpg'), 0.230, 'Full-size pickup for gear, bikes and adventure.'],
  ['Range Rover Sport', 'suv', 5, 'auto', 'diesel', 140, img('Range Rover Sport HST 4.2 V8 Supercharged - Flickr - The Car Spy (1).jpg'), 0.200, 'Luxury SUV with real off-road ability.'],
  ['Porsche Panamera', 'premium', 4, 'auto', 'hybrid', 190, img('Porsche 972 Turbo E-Hybrid IMG 0445.jpg'), 0.160, 'Four-door sports sedan with a luxurious cabin.'],
  ['Chevrolet Camaro', 'premium', 4, 'auto', 'petrol', 120, img('Chevrolet Camaro Hirschaid 2022-20220709-RM-112013.jpg'), 0.210, 'American muscle car with a V8 soundtrack.'],
  ['Ford Mustang GT', 'premium', 4, 'manual', 'petrol', 115, img('Leimershof 7. US-Car-Treffen 1937 Ford Mustang-20230910-RM-161811.jpg'), 0.215, 'Legendary pony car, manual gearbox for purists.'],
  ['Mercedes-AMG GT', 'premium', 2, 'auto', 'petrol', 240, img('Dülmen, Automeile auf dem Kartoffelmarkt, Mercedes AMG GT -- 2019 -- 9884.jpg'), 0.250, 'Two-seat grand tourer with 500+ hp.'],
  ['BMW M4 Competition', 'premium', 4, 'auto', 'petrol', 175, img('2024 BMW M4 Competition xDrive, front left, 06-15-2025.jpg'), 0.205, 'Track-ready coupe that is still comfortable daily.'],
  ['McLaren 720S Spider', 'premium', 2, 'auto', 'petrol', 450, img("HKCEC 香港會議展覽中心 Wan Chai 蘇富比 Sotheby's Auction preview exhibition 麥華倫 Mclaren race car 720S Spider blue March 2019 SSG 01.jpg"), 0.260, 'Supercar experience with a retractable roof.'],
  ['Nissan GT-R', 'premium', 4, 'auto', 'petrol', 220, img('Nissan GT-R R35 FL3 T-Spec Millennium Jade 01.jpg'), 0.245, '"Godzilla": brutal acceleration, all-wheel drive.'],
  ['Ferrari LaFerrari', 'premium', 2, 'auto', 'hybrid', 990, img('LaFerrari front.jpg'), 0.330, 'Hybrid hypercar - for a once-in-a-lifetime drive.'],
  ['Lamborghini Aventador', 'premium', 2, 'auto', 'petrol', 650, img('Lamborghini Aventador Bahrain.jpg'), 0.370, 'V12 flagship with scissor doors.'],
  ['Lamborghini Huracán Spyder', 'premium', 2, 'auto', 'petrol', 520, img('HK 上環 Sheung Wan 太平山街 Tai Ping Shan Street sidewalk carpark 林寶堅尼 Lamborghini Sept 2018 SSG DAB branch 01.jpg'), 0.290, 'Open-top V10 - the sound alone is worth it.'],
  ['Mercedes-AMG GT R', 'premium', 2, 'auto', 'petrol', 280, img('Mercedes-AMG R190 GT R Roadster Speedlegend IAA 2021 1X7A0124.jpg'), 0.260, '"Beast of the Green Hell" in signature red.'],
  ['Lamborghini Huracán EVO', 'premium', 2, 'auto', 'petrol', 490, img('HK 上環 Sheung Wan 太平山街 Tai Ping Shan Street sidewalk carpark 林寶堅尼 Lamborghini Sept 2018 SSG DAB branch 02.jpg'), 0.285, 'Everyday-usable supercar with rear-wheel steering.'],
  ['Lamborghini Aventador S', 'premium', 2, 'auto', 'petrol', 690, img('Lamborghini Aventador S Roadster (37248144071).jpg'), 0.370, 'Orange V12 icon - heads will turn.'],
  ['Chevrolet Camaro ZL1', 'premium', 4, 'auto', 'petrol', 150, img('2013 Chevrolet Camaro ZL1 pace car (8402969943).jpg'), 0.240, 'Supercharged 650 hp muscle car.'],
  ['Bugatti Chiron', 'premium', 2, 'auto', 'petrol', 2500, img('Full blue 2017 Bugatti Chiron at Grand Basel 2018 (Ank Kumar) 10.jpg'), 0.500, 'The ultimate hypercar. Chauffeur optional.'],
  ['Jaguar F-Type', 'premium', 2, 'auto', 'petrol', 165, img('Jaguar F-Type ZP Edition, Auto 2024, Zurich (PANA0387).jpg'), 0.210, 'Elegant British sports coupe.'],
  ['Tesla Model S', 'premium', 5, 'auto', 'electric', 150, img('Tesla Model S DCA 08 2018 0283 trimmed.jpg'), 0.000, 'Fast, silent and spacious electric saloon.'],
  ['Tesla Roadster', 'premium', 4, 'auto', 'electric', 390, img('Tesla Roadster - Flickr - The Car Spy.jpg'), 0.000, 'Electric supercar: 0-100 km/h in about 2 seconds.'],
  ['Audi RS7 Sportback', 'premium', 5, 'auto', 'petrol', 210, img('Audi RS7 C8 at IAA 2019 IMG 0307.jpg'), 0.225, '600 hp family car with quattro grip.'],
  ['BMW 7 Series', 'premium', 5, 'auto', 'hybrid', 185, img('BMW-7-series-e65-right backview.jpg'), 0.090, 'Executive flagship - first-class rear seats.'],
  ['Audi TT RS', 'premium', 4, 'auto', 'petrol', 140, img('Audi TT RS @ the 2012 New York International Auto Show (6905521236).jpg'), 0.195, 'Compact five-cylinder sports coupe.'],
  ['Audi A8', 'premium', 5, 'auto', 'diesel', 160, img('Audi A8 L rolling! (25044808319).jpg'), 0.150, 'Quiet luxury limousine for business travel.'],
];
