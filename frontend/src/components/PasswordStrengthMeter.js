// frontend/src/components/PasswordStrengthMeter.js
import React from 'react';

function PasswordStrengthMeter({ password }) {
  const calculateStrength = password => {
    let strength = 0;
    if (password.length > 5) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const strength = calculateStrength(password);
  const strengthLabel = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength];

  return (
    <div>
      <p>Password Strength: {strengthLabel}</p>
    </div>
  );
}

export default PasswordStrengthMeter;
