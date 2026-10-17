// FormField: label + input + error message under it (used by all forms)
export default function FormField({ label, name, error, type = 'text', value, onChange, children, ...rest }) {
  return (
    <label className={error ? 'field field-error' : 'field'}>
      <span className="field-label">{label}</span>
      {children ? (
        children
      ) : (
        <input name={name} type={type} value={value} onChange={onChange} aria-invalid={Boolean(error)} {...rest} />
      )}
      {error && <span className="field-message">{error}</span>}
    </label>
  );
}
