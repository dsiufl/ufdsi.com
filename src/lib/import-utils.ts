import { FormField } from '@/types/db';

const FIELD_ALIASES: Record<string, string[]> = {
    first_name: ['first name', 'first', 'fname', 'given name', 'first_name'],
    last_name: ['last name', 'last', 'lname', 'surname', 'family name', 'last_name'],
    email: ['email', 'email address', 'e-mail', 'mail'],
    phone: ['phone', 'phone number', 'tel', 'telephone', 'mobile', 'cell'],
};

function normalize(s: string): string {
    return s.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
}

export function autoMapColumns(
    csvHeaders: string[],
    formFields: FormField[]
): Record<string, string> {
    const mapping: Record<string, string> = {};

    for (const header of csvHeaders) {
        const norm = normalize(header);

        // Check built-in field aliases
        for (const [target, aliases] of Object.entries(FIELD_ALIASES)) {
            if (aliases.some(a => norm === a || norm.includes(a))) {
                mapping[header] = target;
                break;
            }
        }

        // Check custom form fields by label
        if (!mapping[header]) {
            for (const field of formFields) {
                if (normalize(field.label) === norm) {
                    mapping[header] = field.id;
                    break;
                }
            }
        }
    }

    return mapping;
}

export function validateRow(
    row: Record<string, string>,
    mapping: Record<string, string>
): string[] {
    const errors: string[] = [];
    const reverseMap: Record<string, string> = {};
    for (const [csv, target] of Object.entries(mapping)) {
        reverseMap[target] = csv;
    }

    if (!reverseMap.first_name || !row[reverseMap.first_name]?.trim()) {
        errors.push('Missing first name');
    }
    if (!reverseMap.last_name || !row[reverseMap.last_name]?.trim()) {
        errors.push('Missing last name');
    }
    if (!reverseMap.email || !row[reverseMap.email]?.trim()) {
        errors.push('Missing email');
    } else {
        const email = row[reverseMap.email].trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.push('Invalid email format');
        }
    }

    return errors;
}

export function mapRow(
    row: Record<string, string>,
    mapping: Record<string, string>
): {
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    data: Record<string, string>;
} {
    const result: Record<string, string> = {};
    const data: Record<string, string> = {};

    for (const [csvCol, target] of Object.entries(mapping)) {
        const value = row[csvCol]?.trim() ?? '';
        if (['first_name', 'last_name', 'email', 'phone'].includes(target)) {
            result[target] = value;
        } else {
            data[target] = value;
        }
    }

    return {
        first_name: result.first_name ?? '',
        last_name: result.last_name ?? '',
        email: (result.email ?? '').toLowerCase().trim(),
        phone: result.phone || null,
        data,
    };
}
