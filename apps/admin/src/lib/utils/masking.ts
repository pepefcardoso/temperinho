export function maskEmail(email: string | undefined | null): string {
  if (!email) return "-";
  const [localPart, domain] = email.split("@");
  if (!domain) return email;
  if (localPart.length <= 2) return `***@${domain}`;
  const maskedLocal = `${localPart[0]}***${localPart[localPart.length - 1]}`;
  return `${maskedLocal}@${domain}`;
}

export function maskPhone(phone: string | undefined | null): string {
  if (!phone) return "-";
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) return phone;
  // Assumes Brazilian format: (XX) 9XXXX-XXXX
  return phone.replace(/(\d{4,5})-(\d{4})/, "****-$2");
}

export function maskCnpj(cnpj: string | undefined | null): string {
  if (!cnpj) return "-";
  // Format: XX.XXX.XXX/0001-XX -> **.***.***/0001-XX
  return cnpj.replace(/^\d{2}\.\d{3}\.\d{3}/, "**.***.***");
}
