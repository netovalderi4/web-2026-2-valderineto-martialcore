/**
 * Utilitários de Segurança e Sanitização - MartialCore
 * Princípio: Security First & Defesa em Profundidade
 */

/**
 * Sanitiza texto de entrada de formulários:
 * - Remove tags HTML e scripts suspeitos para prevenção de XSS
 * - Normaliza espaços em branco
 * - Corta comprimentos excessivos para prevenir buffer-overflow / DoS
 */
export function sanitizeInput(input: string, maxLength: number = 250): string {
  if (!input || typeof input !== 'string') return '';
  
  // 1. Remove qualquer tag HTML/XML (incluindo <script>, <iframe>, <img onerror>, etc.)
  let sanitized = input.replace(/<[^>]*>?/gm, '');

  // 2. Remove caracteres nulos e de controle perigosos
  sanitized = sanitized.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');

  // 3. Normaliza espaços múltiplos
  sanitized = sanitized.replace(/\s+/g, ' ').trim();

  // 4. Limita comprimento
  return sanitized.slice(0, maxLength);
}

/**
 * Validação rigorosa de sintaxe de e-mail (RFC 5322 simplificado)
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

/**
 * Validação de telefone / WhatsApp com DDD (mínimo 10 dígitos)
 */
export function validatePhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.length >= 10 && digitsOnly.length <= 13;
}

/**
 * Formata telefone brasileiro amigavelmente: (XX) XXXXX-XXXX
 */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

