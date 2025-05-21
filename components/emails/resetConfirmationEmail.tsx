import { Html, Head, Body, Container, Text, Button, Hr } from '@react-email/components';
import React from 'react';

interface ResetConfirmationEmailProps {
  userEmail: string;
  loginUrl: string;
}

const ResetConfirmationEmail = ({ userEmail, loginUrl }: ResetConfirmationEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Text style={heading}>Password Reset Successful</Text>
        <Text style={paragraph}>
          Hello,<br />
          The password for your account <b>{userEmail}</b> has been successfully reset. If you did not perform this action, please contact our support team immediately.
        </Text>
        <Button style={button} href={loginUrl}>
          Login to your account
        </Button>
        <Hr style={hr} />
        <Text style={footer}>
          If you have any questions, just reply to this email.<br />
          Thank you for using our service!
        </Text>
      </Container>
    </Body>
  </Html>
);

export default ResetConfirmationEmail;

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Arial, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '480px',
};

const heading = {
  fontSize: '22px',
  fontWeight: 'bold',
  marginBottom: '20px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '24px',
  marginBottom: '24px',
};

const button = {
  backgroundColor: '#5F51E8',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  padding: '12px 24px',
  display: 'inline-block',
  marginBottom: '24px',
};

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  marginTop: '16px',
};
