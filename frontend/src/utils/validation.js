// Form validation functions. Each returns an object { fieldName: 'translation key' }.
// The keys (for example 'validation.emailInvalid') are turned into text by t() in FormField,
// so the same validators work in English and in Hebrew. An empty object means the form is valid.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLogin(values) {
  const errors = {};
  if (!EMAIL_PATTERN.test(values.email)) {
    errors.email = 'validation.emailInvalid';
  }
  if (!values.password) {
    errors.password = 'validation.passwordRequired';
  }
  return errors;
}

export function validatePassword(password) {
  if (!password || password.length < 8) return 'validation.passwordLength';
  if (!/[A-Za-z]/.test(password)) return 'validation.passwordLetter';
  if (!/\d/.test(password)) return 'validation.passwordNumber';
  return '';
}

export function validateRegister(values) {
  const errors = {};
  if (values.name.trim().length < 2) {
    errors.name = 'validation.nameLength';
  }
  if (!EMAIL_PATTERN.test(values.email)) {
    errors.email = 'validation.emailInvalid';
  }
  const passwordError = validatePassword(values.password);
  if (passwordError) {
    errors.password = passwordError;
  }
  if (values.confirm !== values.password) {
    errors.confirm = 'validation.passwordsMismatch';
  }
  return errors;
}

export function validateBooking(values, today) {
  const errors = {};
  if (!values.start_date) {
    errors.start_date = 'validation.pickupDate';
  } else if (values.start_date < today) {
    errors.start_date = 'validation.pickupPast';
  }
  if (!values.end_date) {
    errors.end_date = 'validation.returnDate';
  } else if (values.start_date && values.end_date <= values.start_date) {
    errors.end_date = 'validation.returnAfter';
  }
  if (values.pickup_location.trim().length < 2) {
    errors.pickup_location = 'validation.pickupLocation';
  }
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(values.pickup_time)) {
    errors.pickup_time = 'validation.timeFormat';
  }
  return errors;
}

export function validateVehicle(values) {
  const errors = {};
  if (values.name.trim().length < 2) {
    errors.name = 'validation.nameLength';
  }
  const seats = Number(values.seats);
  if (!Number.isInteger(seats) || seats < 1 || seats > 9) {
    errors.seats = 'validation.seatsRange';
  }
  if (!(Number(values.price_per_day) > 0)) {
    errors.price_per_day = 'validation.pricePositive';
  }
  if (values.co2_per_km === '' || Number(values.co2_per_km) < 0) {
    errors.co2_per_km = 'validation.co2Min';
  }
  return errors;
}

// Turns server validation details [{ field, message }] into { field: message }
// (server messages are plain text, t() returns them unchanged)
export function serverErrorsToFields(error) {
  const fields = {};
  if (error && error.details) {
    error.details.forEach((detail) => {
      fields[detail.field] = detail.message;
    });
  }
  return fields;
}
