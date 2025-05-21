import * as React from 'react';

interface EmailTemplateProps {
  otp: string;
  IsPasswordReset: boolean;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  otp,
  IsPasswordReset
}) => (
  <div>
    <h1>Welcome, {otp}!</h1>
    {IsPasswordReset ?  'You have requested a password reset. Please use the OTP below to reset your password.' : 'Please use the OTP below to verify your email address.'}
  </div>
);