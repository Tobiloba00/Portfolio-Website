import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const runtime = 'nodejs';

const TO_EMAIL = 'olujimitobilobaa@gmail.com';
const FROM_EMAIL = 'Portfolio Contact <onboarding@resend.dev>';

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        return NextResponse.json(
            { error: 'Email service is not configured.' },
            { status: 500 }
        );
    }

    let payload: { name?: string; email?: string; message?: string };
    try {
        payload = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const name = (payload.name ?? '').trim();
    const email = (payload.email ?? '').trim();
    const message = (payload.message ?? '').trim();

    if (!name || !email || !message) {
        return NextResponse.json(
            { error: 'All fields are required.' },
            { status: 400 }
        );
    }

    if (name.length > 120 || email.length > 200 || message.length > 5000) {
        return NextResponse.json(
            { error: 'One or more fields are too long.' },
            { status: 400 }
        );
    }

    if (!isValidEmail(email)) {
        return NextResponse.json(
            { error: 'Please provide a valid email address.' },
            { status: 400 }
        );
    }

    const resend = new Resend(apiKey);

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br />');

    try {
        const { error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: TO_EMAIL,
            replyTo: email,
            subject: `New portfolio message from ${name}`,
            text: `New message from the portfolio contact form.\n\nFrom: ${name} <${email}>\n\n${message}`,
            html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background:#0a0a0a; color:#f0f0f0; padding:32px; border-radius:8px;">
                    <div style="font-size:11px; letter-spacing:0.3em; color:#F5A623; text-transform:uppercase; margin-bottom:16px;">
                        New Signal // Portfolio
                    </div>
                    <h1 style="font-size:24px; color:#fff; margin:0 0 24px;">Message from ${safeName}</h1>
                    <table style="width:100%; border-collapse:collapse; margin-bottom:24px;">
                        <tr>
                            <td style="padding:8px 0; color:#888; font-size:12px; text-transform:uppercase; letter-spacing:0.1em; width:120px;">From</td>
                            <td style="padding:8px 0; color:#fff; font-size:14px;">${safeName}</td>
                        </tr>
                        <tr>
                            <td style="padding:8px 0; color:#888; font-size:12px; text-transform:uppercase; letter-spacing:0.1em;">Email</td>
                            <td style="padding:8px 0;"><a href="mailto:${safeEmail}" style="color:#F5A623; text-decoration:none;">${safeEmail}</a></td>
                        </tr>
                    </table>
                    <div style="border-top:1px solid #222; padding-top:24px;">
                        <div style="color:#888; font-size:12px; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:12px;">Message</div>
                        <div style="color:#ddd; font-size:15px; line-height:1.6;">${safeMessage}</div>
                    </div>
                </div>
            `,
        });

        if (error) {
            console.error('Resend error:', error);
            return NextResponse.json(
                { error: 'Failed to send message. Please try again.' },
                { status: 502 }
            );
        }

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('Contact route error:', err);
        return NextResponse.json(
            { error: 'Failed to send message. Please try again.' },
            { status: 500 }
        );
    }
}
