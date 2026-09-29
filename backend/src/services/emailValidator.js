import dns from 'dns/promises';

// Blacklist of known disposable / dummy / fake email provider domains
const DISPOSABLE_DOMAINS = new Set([
  'tempmail.com',
  'temp-mail.org',
  '10minutemail.com',
  'guerrillamail.com',
  'mailinator.com',
  'dispostable.com',
  'trashmail.com',
  'throwawaymail.com',
  'fake.com',
  'dummy.com',
  'test.com',
  'example.com',
  'sample.com',
  'fakeemail.com',
  'yopmail.com',
  'sharklasers.com',
  'getnada.com',
]);

/**
 * Validates whether an email address is real, deliverable, and not a dummy/disposable email.
 * Performs syntax check, disposable blacklist check, and DNS MX record lookup.
 */
export const validateEmailAuthenticity = async (email) => {
  const cleanEmail = email.trim().toLowerCase();

  // 1. Basic Syntax Check
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(cleanEmail)) {
    return {
      valid: false,
      reason: 'Invalid email format. Please enter a valid email address (e.g. user@gmail.com).',
    };
  }

  const domain = cleanEmail.split('@')[1];

  // 2. Disposable / Dummy Domain Blacklist Check
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      valid: false,
      reason: `The email domain '@${domain}' is a disposable or temporary email provider. Please provide an authentic email address (e.g. gmail.com, yahoo.com, outlook.com).`,
    };
  }

  // Check for common dummy words in domain
  if (domain.includes('dummy') || domain.includes('fake') || domain.includes('temp') || domain.includes('test')) {
    return {
      valid: false,
      reason: `Dummy or temporary email domain detected (@${domain}). Please enter a genuine, active email address.`,
    };
  }

  // 3. DNS MX Record Resolution (Verifies that real mail servers exist for this domain)
  try {
    const mxRecords = await dns.resolveMx(domain);
    if (!mxRecords || mxRecords.length === 0) {
      return {
        valid: false,
        reason: `The domain '@${domain}' does not have active MX mail servers configured to receive emails.`,
      };
    }
  } catch (error) {
    console.warn(`[DNS MX Check] Failed to resolve MX records for domain @${domain}:`, error.message);
    // If DNS check fails due to offline local environment or DNS timeout, allow standard domains like gmail.com, yahoo.com, etc.
    const trustedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'protonmail.com', 'live.com', 'aol.com', 'zoho.com'];
    if (!trustedDomains.includes(domain) && !domain.endsWith('.edu') && !domain.endsWith('.gov') && !domain.endsWith('.ac.in') && !domain.endsWith('.org')) {
      return {
        valid: false,
        reason: `Could not verify mail servers for domain '@${domain}'. Please use an authentic email provider (e.g. gmail.com, yahoo.com).`,
      };
    }
  }

  return { valid: true };
};
