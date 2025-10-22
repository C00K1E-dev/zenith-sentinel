import { useState } from 'react';

export default function CookiePolicy() {
  // Check cookie synchronously to prevent flash
  const [visible, setVisible] = useState(true); // Temporarily always show for testing

  const handleAccept = () => {
    document.cookie = "cookies_accepted=true; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
    setVisible(false);
  };

  const handleClick = (file: string) => {
    let path = '';
    if (file === 'Privacy') path = '/documents/Privacy Policy.pdf';
    else if (file === 'Terms') path = '/documents/Terms and Conditions.pdf';
    else if (file === 'Disclaimer') path = '/documents/Disclaimer.pdf';
    window.open(path, "_blank");
  };

  if (!visible) return null;

  return (
    <div className="cookie-overlay">
      <div className="cookie-content">
        <div className="cookie-top-row">
          <img
            src="/ss-icon.svg"
            alt="Smart Sentinels Logo"
            width={80}
            height={80}
            className="cookie-image"
          />
          <div className="cookie-text">
            This website uses cookies to monitor performance and traffic. <span className="cookie-highlight">WE NEVER STORE ANY PERSONAL DATA.</span> By using this website, you agree to our{" "}
            <button className="cookie-link-button" onClick={() => handleClick("Privacy")}>Privacy Policy</button>,{" "}
            <button className="cookie-link-button" onClick={() => handleClick("Terms")}>Terms</button>, and{" "}
            <button className="cookie-link-button" onClick={() => handleClick("Disclaimer")}>Disclaimer</button>.
          </div>
        </div>
        <button
          className="cookie-accept-button"
          onClick={handleAccept}
        >
          Accept
        </button>
      </div>
    </div>
  );
}