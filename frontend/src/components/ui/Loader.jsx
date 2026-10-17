// Loader: spinner shown while data is loading
export default function Loader({ text = 'Loading...', fullPage = false }) {
  return (
    <div className={fullPage ? 'loader loader-full' : 'loader'} role="status">
      <span className="spinner" />
      <span>{text}</span>
    </div>
  );
}
