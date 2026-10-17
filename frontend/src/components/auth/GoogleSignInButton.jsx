// GoogleSignInButton: shows Google's "Sign in with Google" button.
// Google gives the browser an ID token; we send it to our server (/api/auth/google),
// which verifies it and returns our own JWT. Hidden when VITE_GOOGLE_CLIENT_ID is not set.
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const SCRIPT_URL = 'https://accounts.google.com/gsi/client';

// Loads Google's script once and resolves when window.google is ready
function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.accounts) {
      resolve();
      return;
    }
    let script = document.querySelector(`script[src="${SCRIPT_URL}"]`);
    if (!script) {
      script = document.createElement('script');
      script.src = SCRIPT_URL;
      script.async = true;
      document.head.appendChild(script);
    }
    script.addEventListener('load', () => resolve());
    script.addEventListener('error', () => reject(new Error('Could not load Google sign-in')));
  });
}

export default function GoogleSignInButton({ onError }) {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const buttonRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!CLIENT_ID) return;
    let cancelled = false;

    // Called by Google after the user picks an account
    async function handleCredential(response) {
      try {
        await loginWithGoogle(response.credential);
        navigate('/', { replace: true });
      } catch (err) {
        onError(err.message);
      }
    }

    loadGoogleScript()
      .then(() => {
        if (cancelled || !buttonRef.current) return;
        window.google.accounts.id.initialize({ client_id: CLIENT_ID, callback: handleCredential });
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          width: 320,
          text: 'continue_with',
        });
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [loginWithGoogle, navigate, onError]);

  if (!CLIENT_ID) return null;

  return (
    <div>
      <div className="auth-divider">or</div>
      {failed ? (
        <p className="auth-hint">Google sign-in is unavailable right now.</p>
      ) : (
        <div className="google-button" ref={buttonRef} />
      )}
    </div>
  );
}
