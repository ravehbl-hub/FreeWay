// VehicleForm: admin form to add or edit a vehicle
import { useState } from 'react';
import { serverErrorsToFields, validateVehicle } from '../../utils/validation.js';
import FormField from '../ui/FormField.jsx';
import ErrorMessage from '../ui/ErrorMessage.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

const EMPTY_VEHICLE = {
  name: '',
  category: 'compact',
  seats: 5,
  transmission: 'auto',
  fuel_type: 'petrol',
  price_per_day: '',
  co2_per_km: 0.12,
  image_url: '',
  description: '',
  available: true,
};

export default function VehicleForm({ vehicle, onSubmit, onCancel }) {
  const { t } = useLanguage();
  const [values, setValues] = useState(vehicle ? { ...EMPTY_VEHICLE, ...vehicle, image_url: vehicle.image_url || '' } : EMPTY_VEHICLE);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [saving, setSaving] = useState(false);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setValues({ ...values, [name]: type === 'checkbox' ? checked : value });
    setErrors({ ...errors, [name]: '' });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const formErrors = validateVehicle(values);
    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) return;

    setSaving(true);
    setServerError('');
    try {
      await onSubmit({
        name: values.name.trim(),
        category: values.category,
        seats: Number(values.seats),
        transmission: values.transmission,
        fuel_type: values.fuel_type,
        price_per_day: Number(values.price_per_day),
        co2_per_km: Number(values.co2_per_km),
        image_url: values.image_url.trim(),
        description: values.description,
        available: values.available,
      });
    } catch (err) {
      setErrors(serverErrorsToFields(err));
      setServerError(err.message);
      setSaving(false);
    }
  }

  return (
    <form className="card form admin-form" onSubmit={handleSubmit} noValidate>
      <h3>{vehicle ? t('admin.editVehicle') : t('admin.addVehicle')}</h3>
      <div className="form-row">
        <FormField label={t('admin.name')} name="name" value={values.name} onChange={handleChange} error={errors.name} />
        <FormField label={t('admin.category')} error={errors.category}>
          <select name="category" value={values.category} onChange={handleChange}>
            <option value="compact">{t('category.compact')}</option>
            <option value="suv">SUV</option>
            <option value="premium">{t('category.premium')}</option>
          </select>
        </FormField>
      </div>
      <div className="form-row">
        <FormField label={t('admin.seats')} name="seats" type="number" min="1" max="9" value={values.seats} onChange={handleChange} error={errors.seats} />
        <FormField label={t('admin.transmission')} error={errors.transmission}>
          <select name="transmission" value={values.transmission} onChange={handleChange}>
            <option value="auto">{t('common.automatic')}</option>
            <option value="manual">{t('common.manual')}</option>
          </select>
        </FormField>
        <FormField label={t('admin.fuel')} error={errors.fuel_type}>
          <select name="fuel_type" value={values.fuel_type} onChange={handleChange}>
            <option value="petrol">{t('fuel.petrol')}</option>
            <option value="diesel">{t('fuel.diesel')}</option>
            <option value="hybrid">{t('fuel.hybrid')}</option>
            <option value="electric">{t('fuel.electric')}</option>
          </select>
        </FormField>
      </div>
      <div className="form-row">
        <FormField label={t('admin.pricePerDay')} name="price_per_day" type="number" min="1" step="0.01" value={values.price_per_day} onChange={handleChange} error={errors.price_per_day} />
        <FormField label={t('admin.co2')} name="co2_per_km" type="number" min="0" step="0.001" value={values.co2_per_km} onChange={handleChange} error={errors.co2_per_km} />
      </div>
      <FormField label={t('admin.imageUrl')} name="image_url" value={values.image_url} onChange={handleChange} error={errors.image_url} placeholder={t('admin.imagePlaceholder')} />
      <FormField label={t('admin.description')} error={errors.description}>
        <textarea name="description" rows={2} value={values.description || ''} onChange={handleChange} />
      </FormField>
      <label className="checkbox">
        <input type="checkbox" name="available" checked={values.available} onChange={handleChange} />
        {t('admin.availableForBooking')}
      </label>
      <ErrorMessage message={serverError} />
      <div className="form-actions">
        <button type="submit" className="button button-green" disabled={saving}>
          {saving ? t('common.saving') : t('admin.saveVehicle')}
        </button>
        <button type="button" className="button button-light" onClick={onCancel}>
          {t('common.cancel')}
        </button>
      </div>
    </form>
  );
}
