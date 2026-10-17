// RegisterPage: sign-up form with validation (name, email, password, confirm password)
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { serverErrorsToFields, validateRegister } from '../utils/validation.js';
import FormField from '../components/ui/FormField.jsx';
import ErrorMessage from '../components/ui/ErrorMessage.jsx';
import AuthLayout from '../components/layout/AuthLayout.jsx';
import GoogleSignInButton from '../components/auth/GoogleSignInButton.jsx';

export default function RegisterPage() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/" replace />;

  function handleChange(event) {
    setValues({ ...values, [event.target.name]: event.target.value });
    setErrors({ ...errors, [event.target.name]: '' });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const formErrors = validateRegister(values);
    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) return;

    setSubmitting(true);
    setServerError('');
    try {
      await register(values.name.trim(), values.email.trim(), values.password);
      navigate('/', { replace: true });
    } catch (err) {
      setErrors(serverErrorsToFields(err));
      setServerError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Start renting with FreeWay in a minute">
      <form onSubmit={handleSubmit} noValidate className="form">
        <FormField label="Full name" name="name" value={values.name} onChange={handleChange} error={errors.name} autoComplete="name" />
        <FormField label="Email" name="email" type="email" value={values.email} onChange={handleChange} error={errors.email} autoComplete="email" />
        <FormField label="Password" name="password" type="password" value={values.password} onChange={handleChange} error={errors.password} autoComplete="new-password" />
        <FormField label="Confirm password" name="confirm" type="password" value={values.confirm} onChange={handleChange} error={errors.confirm} autoComplete="new-password" />
        <ErrorMessage message={serverError} />
        <button type="submit" className="button button-green button-block" disabled={submitting}>
          {submitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>
      <GoogleSignInButton onError={setServerError} />
      <p className="auth-switch">
        Already registered? <Link to="/login">Log in</Link>
      </p>
    </AuthLayout>
  );
}
