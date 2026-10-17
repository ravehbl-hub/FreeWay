// VehicleImage: shows the car picture, or a default picture if the URL is broken
import { useState } from 'react';

const FALLBACK = {
  compact: '/cars/compact.svg',
  suv: '/cars/suv.svg',
  premium: '/cars/premium.svg',
};

export default function VehicleImage({ src, category, alt, className }) {
  const [failed, setFailed] = useState(false);
  const fallback = FALLBACK[category] || '/cars/compact.svg';
  return (
    <img
      className={className}
      src={!src || failed ? fallback : src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
