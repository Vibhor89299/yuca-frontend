import { z } from 'zod';

/**
 * Shared validation schemas for all storefront forms (YL-001).
 *
 * Single source of truth for form validation. Every form uses react-hook-form
 * with `zodResolver(<schema>)` and the shadcn <Form> components so errors render
 * inline, field-level, and accessibly (aria-invalid + aria-describedby are wired
 * in components/ui/form.tsx).
 *
 * Rules are India-specific where relevant (phone, postal code) and match the
 * existing server-side checks (e.g. RetailPOS phone regex) so client and server
 * agree.
 */

// --- reusable field rules ---

const email = z
  .string()
  .min(1, 'Email is required')
  .email('Enter a valid email address');

/** Indian mobile: 10 digits starting 6-9. Matches the existing RetailPOS check. */
const phoneIN = z
  .string()
  .min(1, 'Phone number is required')
  .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number');

/** Optional Indian mobile — empty string allowed, but if present must be valid. */
const phoneINOptional = z
  .string()
  .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number')
  .optional()
  .or(z.literal(''));

/** Indian PIN code: exactly 6 digits, not starting with 0. */
const postalCodeIN = z
  .string()
  .min(1, 'Postal code is required')
  .regex(/^[1-9]\d{5}$/, 'Enter a valid 6-digit PIN code');

const nonEmpty = (label: string, max = 100) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(max, `${label} is too long`);

const fullName = z
  .string()
  .trim()
  .min(2, 'Please enter your full name')
  .max(80, 'Name is too long');

// --- auth ---

export const loginSchema = z.object({
  // Login stays lenient: don't leak the password policy at the login step.
  email,
  password: z.string().min(1, 'Password is required'),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: fullName,
    email,
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Za-z]/, 'Include at least one letter')
      .regex(/\d/, 'Include at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
export type RegisterValues = z.infer<typeof registerSchema>;

// --- checkout ---

export const guestContactSchema = z.object({
  fullName,
  email,
  phone: phoneIN,
});
export type GuestContactValues = z.infer<typeof guestContactSchema>;

export const shippingAddressSchema = z.object({
  firstName: nonEmpty('First name', 50),
  lastName: nonEmpty('Last name', 50),
  street: nonEmpty('Street address', 200),
  city: nonEmpty('City', 80),
  state: nonEmpty('State', 80),
  postalCode: postalCodeIN,
});
export type ShippingAddressValues = z.infer<typeof shippingAddressSchema>;

// --- profile ---

export const profileSchema = z.object({
  name: fullName,
  phone: phoneINOptional,
});
export type ProfileValues = z.infer<typeof profileSchema>;

// --- retail POS ---

export const posCustomerSchema = z.object({
  customerName: nonEmpty('Customer name', 80),
  customerEmail: email,
  customerPhone: phoneINOptional,
});
export type PosCustomerValues = z.infer<typeof posCustomerSchema>;

// --- newsletter ---

export const newsletterSchema = z.object({
  email,
});
export type NewsletterValues = z.infer<typeof newsletterSchema>;
