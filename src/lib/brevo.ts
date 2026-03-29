const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const SENDER = { name: 'UF DSI', email: 'noreply@dsiufl.org' };

// Set these in .env after creating templates in the Brevo dashboard
const TEMPLATE_IDS = {
    REGISTRATION_CONFIRMED: parseInt(process.env.BREVO_TEMPLATE_CONFIRMED ?? '0'),
    WAITLIST:               parseInt(process.env.BREVO_TEMPLATE_WAITLIST   ?? '0'),
    PROMOTED:               parseInt(process.env.BREVO_TEMPLATE_PROMOTED   ?? '0'),
    CANCELLED:              parseInt(process.env.BREVO_TEMPLATE_CANCELLED  ?? '0'),
};

async function send(payload: {
    to: { email: string; name: string }[];
    templateId: number;
    params: Record<string, unknown>;
}) {
    if (!process.env.BREVO_API_KEY || !payload.templateId) return;
    try {
        const res = await fetch(BREVO_API_URL, {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                'api-key': process.env.BREVO_API_KEY,
            },
            body: JSON.stringify({ sender: SENDER, ...payload }),
        });
        if (!res.ok) console.error('Brevo error:', await res.text());
    } catch (err) {
        console.error('Failed to send email:', err);
    }
}

export function sendRegistrationConfirmedEmail(opts: {
    email: string;
    first_name: string;
    event_title: string;
    event_date?: string | null;
}) {
    return send({
        to: [{ email: opts.email, name: opts.first_name }],
        templateId: TEMPLATE_IDS.REGISTRATION_CONFIRMED,
        params: { first_name: opts.first_name, event_title: opts.event_title, event_date: opts.event_date ?? '' },
    });
}

export function sendWaitlistEmail(opts: {
    email: string;
    first_name: string;
    event_title: string;
    waitlist_position: number;
}) {
    return send({
        to: [{ email: opts.email, name: opts.first_name }],
        templateId: TEMPLATE_IDS.WAITLIST,
        params: { first_name: opts.first_name, event_title: opts.event_title, waitlist_position: opts.waitlist_position },
    });
}

export function sendPromotedEmail(opts: {
    email: string;
    first_name: string;
    event_title: string;
}) {
    return send({
        to: [{ email: opts.email, name: opts.first_name }],
        templateId: TEMPLATE_IDS.PROMOTED,
        params: { first_name: opts.first_name, event_title: opts.event_title },
    });
}

export function sendCancelledEmail(opts: {
    email: string;
    first_name: string;
    event_title: string;
}) {
    return send({
        to: [{ email: opts.email, name: opts.first_name }],
        templateId: TEMPLATE_IDS.CANCELLED,
        params: { first_name: opts.first_name, event_title: opts.event_title },
    });
}
