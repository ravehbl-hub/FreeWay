// Form validation functions. Each returns an object { fieldName: 'error message' }.
// An empty object means the form is valid.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLogin(values) {
  const errors = {};
  if (!EMAIL_PATTERN.test(values.email)) {
    errors.email = 'Please enter a valid email';
  }
  if (!values.password) {
    errors.password = 'Password is required';
  }
  return errors;
}

export function validatePassword(password) {
  if (!password || password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Za-z]/.test(password)) return 'Password must contain a letter';
  if (!/\d/.test(password)) return 'Password must contain a number';
  return '';
}

export function validateRegister(values) {
  const errors = {};
  if (values.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }
  if (!EMAIL_PATTERN.test(values.email)) {
    errors.email = 'Please enter a valid email';
  }
  const passwordError = validatePassword(values.password);
  if (passwordError) {
    errors.password = passwordError;
  }
  if (values.confirm !== values.password) {
    errors.confirm = 'Passwords do not match';
  }
  return errors;
}

export function validateBooking(values, today) {
  const errors = {};
  if (!values.start_date) {
    errors.start_date = 'Choose a pickup date';
  } else if (values.start_date < today) {
    errors.start_date = 'Pickup date cannot be in the past';
  }
  if (!values.end_date) {
    errors.end_date = 'Choose a return date';
  } else if (values.start_date && values.end_date <= values.start_date) {
    errors.end_date = 'Return date must be after pickup date';
  }
  if (values.pickup_location.trim().length < 2) {
    errors.pickup_location = 'Choose a pickup location';
  }
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(values.pickup_time)) {
    errors.pickup_time = 'Time must be HH:MM';
  }
  return errors;
}

export function validateVehicle(values) {
  const errors = {};
  if (values.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }
  const seats = Number(values.seats);
  if (!Number.isInteger(seats) || seats < 1 || seats > 9) {
    errors.seats = 'Seats must be a whole number between 1 and 9';
  }
  if (!(Number(values.price_per_day) > 0)) {
    errors.price_per_day = 'Price must be a positive number';
  }
  if (values.co2_per_km === '' || Number(values.co2_per_km) < 0) {
    errors.co2_per_km = 'CO2 must be 0 or more';
  }
  return errors;
}

// Turns server validation details [{ field, message }] into { field: message }
export function serverErrorsToFields(error) {
  const fields = {};
  if (error && error.details) {
    error.details.forEach((detail) => {
      fields[detail.field] = detail.message;
    });
  }
  return fields;
}
