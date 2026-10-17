// ProfilePage: shows the user's details and lets them change name / password (settings)
import { useState } from 'react';
import { updateProfile } from '../api/auth.api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { validatePassword } from '../utils/validation.js';
import FormField from '../components/ui/FormField.jsx';
import ErrorMessage from '../components/ui/ErrorMessage.jsx';

export default function ProfilePage() {
  const { user, setUser, logout } = useAuth();
  const [values, setValues] = useState({ name: user.name, password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  function handleChange(event) {
    setValues({ ...values, [event.target.name]: event.target.value });
    setErrors({ ...errors, [event.target.name]: '' });
    setSuccess('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const formErrors = {};
    if (values.name.trim().length < 2) {
      formErrors.name = 'Name must be at least 2 characters';
    }
    if (values.password) {
      const passwordError = validatePassword(values.password);
      if (passwordError) formErrors.password = passwordError;
    }
    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) return;

    setSaving(true);
    setServerError('');
    try {
      const body = { name: values.name.trim() };
      if (values.password) body.password = values.password;
      const data = await updateProfile(body);
      setUser(data.user);
      setValues({ name: data.user.name, password: '' });
      setSuccess('Profile saved');
    } catch (err) {
      setServerError(err.message);
    }
    setSaving(false);
  }

  return (
    <div>
      <h1 className="page-title">Profile</h1>
      <p className="page-subtitle">Your account details and settings.</p>
      <div className="profile-layout">
        <section className="card">
          <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
          <h2>{user.name}</h2>
          <p className="muted">{user.email}</p>
          <p className="chip">
            <span className="dot dot-green" /> Role: {user.role}
          </p>
          <p className="muted small">Member since {new Date(user.created_at).toLocaleDateString('en-GB')}</p>
          <button type="button" className="button button-light" onClick={logout}>
            Log out
          </button>
        </section>
        <section className="card" id="settings">
          <h2>Settings</h2>
          <form className="form" onSubmit={handleSubmit} noValidate>
            <FormField label="Full name" name="name" value={values.name} onChange={handleChange} error={errors.name} />
            <FormField
              label="New password (leave empty to keep)"
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="new-password"
            />
            <ErrorMessage message={serverError} />
            {success && <p className="success-box">{success}</p>}
            <button type="submit" className="button button-green" disabled={saving}>
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
