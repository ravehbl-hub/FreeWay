// ProfilePage: shows the user's details, lets them change name / password and the app language (settings)
import { useState } from 'react';
import { updateProfile } from '../api/auth.api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { localeFor } from '../utils/format.js';
import { validatePassword } from '../utils/validation.js';
import FormField from '../components/ui/FormField.jsx';
import ErrorMessage from '../components/ui/ErrorMessage.jsx';

export default function ProfilePage() {
  const { user, setUser, logout } = useAuth();
  const { t, lang, setLang } = useLanguage();
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
      formErrors.name = 'validation.nameLength';
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
      setSuccess(t('profile.saved'));
    } catch (err) {
      setServerError(err.message);
    }
    setSaving(false);
  }

  return (
    <div>
      <h1 className="page-title">{t('profile.title')}</h1>
      <p className="page-subtitle">{t('profile.subtitle')}</p>
      <div className="profile-layout">
        <section className="card">
          <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
          <h2>{user.name}</h2>
          <p className="muted">{user.email}</p>
          <p className="chip">
            <span className="dot dot-green" /> {t('profile.role')}: {t('admin.role' + (user.role === 'admin' ? 'Admin' : 'User'))}
          </p>
          <p className="muted small">{t('profile.memberSince')} {new Date(user.created_at).toLocaleDateString(localeFor(lang))}</p>
          <button type="button" className="button button-light" onClick={logout}>
            {t('topbar.logout')}
          </button>
        </section>
        <section className="card" id="settings">
          <h2>{t('profile.settings')}</h2>
          <form className="form" onSubmit={handleSubmit} noValidate>
            <FormField label={t('profile.fullName')} name="name" value={values.name} onChange={handleChange} error={errors.name} />
            <FormField
              label={t('profile.newPassword')}
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
              {saving ? t('common.saving') : t('common.save')}
            </button>
          </form>
        </section>
        <section className="card" id="language">
          <h2>{t('profile.language')}</h2>
          <p className="muted">{t('profile.languageText')}</p>
          <div className="language-buttons">
            <button type="button" className={lang === 'en' ? 'button button-green' : 'button button-light'} onClick={() => setLang('en')}>
              {t('profile.english')}
            </button>
            <button type="button" className={lang === 'he' ? 'button button-green' : 'button button-light'} onClick={() => setLang('he')}>
              {t('profile.hebrew')}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
