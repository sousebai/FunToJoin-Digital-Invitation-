import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields (name, email, subject, message) are required.' },
        { status: 400 }
      );
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const accessKey = process.env.WEB3FORMS_ACCESS_KEY || process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    const recipientEmail = process.env.CONTACT_EMAIL || 'contact@marzeigui.dev';

    if (accessKey) {
      // Send message via Web3Forms API to recipient email
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          name,
          email,
          subject: `[Portfolio Contact] ${subject}`,
          message,
          to_email: recipientEmail,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to dispatch email notification via Web3Forms.');
      }
    } else {
      // Log contact message to server output if API key is not configured yet
      console.log('--- NEW PORTFOLIO CONTACT MESSAGE RECEIVED ---');
      console.log(`From: ${name} (${email})`);
      console.log(`Subject: ${subject}`);
      console.log(`Message: ${message}`);
      console.log('----------------------------------------------');
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Your message has been sent successfully! I will get back to you within 24 hours.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error handling contact submission:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while sending your message. Please try again later.' },
      { status: 500 }
    );
  }
}
