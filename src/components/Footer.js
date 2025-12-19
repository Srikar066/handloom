import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ maxWidth: 480 }}>
          <div className="brand">Handloom Bazaar</div>
          <p style={{ marginTop: 6, color: '#444' }}>Connecting artisans with conscious customers worldwide. Questions? We're here to help.</p>
          <p style={{ marginTop: 8 }}><strong>Support:</strong> support@handloombazaar.example • +1 (555) 123-4567</p>
        </div>

        <div>
          <h4>Follow Us</h4>
          <div className="social-links">
            <a href="#" aria-label="Instagram">Instagram</a>
            <a href="#" aria-label="Facebook">Facebook</a>
            <a href="#" aria-label="Twitter">Twitter</a>
            <a href="#" aria-label="LinkedIn">LinkedIn</a>
          </div>

          <h4 style={{ marginTop: 12 }}>Contact</h4>
          <p style={{ color: '#444' }}>Email: business@handloombazaar.example</p>
          <p style={{ color: '#444' }}>Media & Partnerships: media@handloombazaar.example</p>
        </div>
      </div>
    </footer>
  );
}
