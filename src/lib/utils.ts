import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Genera un slug único del email para URLs públicas
 * Ejemplo: tagiyevemin489@gmail.com -> tagiyevemin489gmail-com
 */
export function generateSlugFromEmail(email: string): string {
  if (!email) return '';
  
  return email
    .toLowerCase()
    .replace('@', '')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Valida y normaliza un slug de perfil
 */
export function normalizeProfileSlug(slug: string): string {
  return slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
