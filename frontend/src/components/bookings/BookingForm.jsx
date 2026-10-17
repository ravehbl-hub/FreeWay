// BookingForm: dates, pickup time, location and insurance. Shows a live price calculation.
// Used to create a booking (vehicle page) and to edit one (My bookings).
import { useEffect, useState } from 'react';
import { fetchVehicleAvailability } from '../../api/vehicles.api.js';
import { PICKUP_LOCATIONS } from '../../utils/pickupLocations.js';
import { daysBetween, formatPrice, todayISO } from '../../utils/format.js';
import { serverErrorsToFields, validateBooking } from '../../utils/validation.js';
import FormField from '../ui/FormField.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import ErrorMessage from '../ui/ErrorMessage.jsx';

const INSURANCE_PER_DAY = 12; // same value as the server

export default function BookingForm({ vehicle, initialValues, submitLabel, onSubmit }) {
  const { t } = useLanguage();
  const [values, setValues] = useState(
    initialValues || { start_date: '', end_date: '', pickup_time: '10:00', pickup_location: PICKUP_LOCATIONS[0], insurance: false }
  );
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [availability, setAvailability] = useState([]); // [{ location, free }] for the chosen dates

  // Every location has one car of this model: when both dates are chosen, ask the server
  // which locations are still free so the user can pick one that works.
  useEffect(() => {
    const datesOk = values.start_date && values.end_date && values.end_date > values.start_date;
    if (!datesOk) {
      setAvailability([]);
      return;
    }
    let cancelled = false;
    fetchVehicleAvailability(vehicle.id, values.start_date, values.end_date)
      .then((data) => {
        if (!cancelled) setAvailability(data.locations);
      })
      .catch(() => {
        if (!cancelled) setAvailability([]);
      });
    return () => {
      cancelled = true;
    };
  }, [vehicle.id, values.start_date, values.end_date]);

  const busyLocations = availability.filter((item) => !item.free).map((item) => item.location);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setValues({ ...values, [name]: type === 'checkbox' ? checked : value });
    setErrors({ ...errors, [name]: '' });
  }

  // Live price: days x price (+ insurance)
  let days = 0;
  if (values.start_date && values.end_date && values.end_date > values.start_date) {
    days = daysBetween(values.start_date, values.end_date);
  }
  let total = days * vehicle.price_per_day;
  if (values.insurance) {
    total += days * INSURANCE_PER_DAY;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const formErrors = validateBooking(values, todayISO());
    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) return;

    setSubmitting(true);
    setServerError('');
    try {
      await onSubmit({ ...values, vehicle_id: vehicle.id });
    } catch (err) {
      setErrors(serverErrorsToFields(err));
      setServerError(err.message);
    }
    setSubmitting(false);
  }

  return (
    <form className="form booking-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <FormField label={t('booking.pickupDate')} name="start_date" type="date" min={todayISO()} value={values.start_date} onChange={handleChange} error={errors.start_date} />
        <FormField label={t('booking.returnDate')} name="end_date" type="date" min={values.start_date || todayISO()} value={values.end_date} onChange={handleChange} error={errors.end_date} />
      </div>
      <div className="form-row">
        <FormField label={t('booking.pickupTime')} name="pickup_time" type="time" value={values.pickup_time} onChange={handleChange} error={errors.pickup_time} />
        <FormField label={t('booking.pickupLocation')} error={errors.pickup_location}>
          <select name="pickup_location" value={values.pickup_location} onChange={handleChange}>
            {PICKUP_LOCATIONS.map((location) => (
              <option key={location} value={location} disabled={busyLocations.includes(location)}>
                {location}{busyLocations.includes(location) ? ' - ' + t('booking.booked') : ''}
              </option>
            ))}
          </select>
        </FormField>
      </div>
      {availability.length > 0 && (
        <div className="availability-list">
          <span className="muted">{t('booking.availabilityTitle')}</span>
          {availability.map((item) => (
            <span key={item.location} className={item.free ? 'availability-chip free' : 'availability-chip busy'}>
              {item.location}
            </span>
          ))}
        </div>
      )}
      <label className="checkbox">
        <input type="checkbox" name="insurance" checked={values.insurance} onChange={handleChange} />
        {t('booking.insurance').replace('{price}', INSURANCE_PER_DAY)}
      </label>

      <div className="price-summary">
        <span>
          {days} {days === 1 ? t('common.day') : t('common.days')} × {formatPrice(vehicle.price_per_day)}
          {values.insurance ? ' ' + t('booking.plusInsurance') : ''}
        </span>
        <strong>{formatPrice(total)}</strong>
      </div>

      <ErrorMessage message={serverError} />
      <button type="submit" className="button button-green button-block" disabled={submitting}>
        {submitting ? t('common.saving') : submitLabel}
      </button>
    </form>
  );
}
