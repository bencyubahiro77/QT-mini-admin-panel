import { Role, Status, ValidationResult, ValidateUserInput } from '../types';

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  
  const isValidFormat = emailRegex.test(email);
  const isReasonableLength = email.length <= 254; 
  const hasValidLocalPart = email.split('@')[0]?.length <= 64; 
  
  return isValidFormat && isReasonableLength && hasValidLocalPart;
}

export function isValidRole(role: string): boolean {
  return Object.values(Role).includes(role as Role);
}

export function isValidStatus(status: string): boolean {
  return Object.values(Status).includes(status as Status);
}

export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function validateUserData(
  data: ValidateUserInput,
  options: { emailRequired: boolean }
): ValidationResult {
  const errors: string[] = [];

  if (options.emailRequired && !data.email) {
    errors.push('Email is required');
  } else if (data.email && !isValidEmail(data.email)) {
    errors.push('Invalid email format');
  }

  if (data.role && !isValidRole(data.role)) {
    errors.push(`Invalid role. Must be one of: ${Object.values(Role).join(', ')}`);
  }

  if (data.status && !isValidStatus(data.status)) {
    errors.push(`Invalid status. Must be one of: ${Object.values(Status).join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}


export function validateUserCreation(data: ValidateUserInput): ValidationResult {
  return validateUserData(data, { emailRequired: true });
}

export function validateUserUpdate(data: ValidateUserInput): ValidationResult {
  return validateUserData(data, { emailRequired: false });
}
