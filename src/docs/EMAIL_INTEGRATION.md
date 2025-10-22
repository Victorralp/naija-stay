# Email Integration Guide

This document explains how to integrate real email services with the Naija Stay Book application.

## Current Implementation

The application currently uses mock email functions in the admin service:

```typescript
const sendEmail = async (to: string, subject: string, message: string) => {
  // Mock implementation - logs to console
  console.log(`Sending email to ${to} with subject "${subject}" and message "${message}"`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true, messageId: 'mock-message-id' };
};
```

## Integration Options

### 1. SendGrid Integration

To integrate with SendGrid:

1. Install the SendGrid package:
```bash
npm install @sendgrid/mail
```

2. Update the sendEmail function in `src/services/adminService.ts`:

```typescript
import sgMail from '@sendgrid/mail';

// Set your SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

const sendEmail = async (to: string, subject: string, message: string) => {
  try {
    const msg = {
      to,
      from: process.env.FROM_EMAIL || 'noreply@naijastaybook.com',
      subject,
      text: message,
      html: `<p>${message.replace(/\n/g, '</p><p>')}</p>`,
    };
    
    await sgMail.send(msg);
    return { success: true, messageId: 'sendgrid-message-id' };
  } catch (error) {
    console.error('SendGrid error:', error);
    throw new Error('Failed to send email via SendGrid');
  }
};
```

3. Add environment variables to `.env`:
```
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=noreply@naijastaybook.com
```

### 2. Nodemailer Integration (SMTP)

To integrate with any SMTP provider:

1. Install Nodemailer:
```bash
npm install nodemailer
```

2. Update the sendEmail function:

```typescript
import nodemailer from 'nodemailer';

const sendEmail = async (to: string, subject: string, message: string) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send email
    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL || '"Naija Stay Book" <noreply@naijastaybook.com>',
      to,
      subject,
      text: message,
      html: `<p>${message.replace(/\n/g, '</p><p>')}</p>`,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Nodemailer error:', error);
    throw new Error('Failed to send email via SMTP');
  }
};
```

3. Add environment variables:
```
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=your_email@domain.com
SMTP_PASS=your_password
FROM_EMAIL=noreply@naijastaybook.com
```

### 3. Firebase Email Integration

If using Firebase, you can use Firebase Extensions or Cloud Functions:

1. Create a Firebase Cloud Function:

```javascript
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

// Configure nodemailer with your SMTP settings
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: functions.config().gmail.email,
    pass: functions.config().gmail.password,
  },
});

exports.sendEmail = functions.https.onCall(async (data, context) => {
  const { to, subject, message } = data;
  
  try {
    const mailOptions = {
      from: functions.config().gmail.email,
      to,
      subject,
      text: message,
    };
    
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email error:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send email');
  }
});
```

2. Call the function from your admin service:

```typescript
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase';

const sendEmail = async (to: string, subject: string, message: string) => {
  try {
    const sendEmailFunction = httpsCallable(functions, 'sendEmail');
    const result = await sendEmailFunction({ to, subject, message });
    return result.data;
  } catch (error) {
    console.error('Firebase function error:', error);
    throw new Error('Failed to send email via Firebase');
  }
};
```

## Testing

To test email functionality:

1. Update environment variables with your email service credentials
2. Restart the development server
3. Navigate to the Admin Dashboard > Communications > Newsletter or Contact Messages
4. Send a test email

## Security Considerations

1. Never commit API keys or passwords to version control
2. Use environment variables for sensitive configuration
3. Implement rate limiting to prevent abuse
4. Validate and sanitize all email inputs
5. Use HTTPS in production

## Error Handling

The current implementation includes basic error handling. For production, consider:

1. Retry mechanisms for failed emails
2. Logging failed attempts to a database
3. Admin notifications for critical failures
4. User-friendly error messages