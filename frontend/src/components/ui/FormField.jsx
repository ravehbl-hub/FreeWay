// FormField: label + input + error message under it (used by all forms).
// The error can be a translation key (from validation.js) or plain text from the server.
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function FormField({ label, name, error, type = 'text', value, onChange, children, ...rest }) {
  const { t } = useLanguage();
  return (
    <label className={error ? 'field field-error' : 'field'}>
      <span className="field-label">{label}</span>
      {children ? (
        children
      ) : (
        <input name={name} type={type} value={value} onChange={onChange} aria-invalid={Boolean(error)} {...rest} />
      )}
      {error && <span className="field-message">{t(error)}</span>}
    </label>
  );
}
