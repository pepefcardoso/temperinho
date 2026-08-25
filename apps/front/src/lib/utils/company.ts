export function formatCNPJDisplay(cnpj: string): string {
  const cleanCNPJ = cnpj.replace(/[^\d]/g, '');
  if (cleanCNPJ.length === 14) {
    return `${cleanCNPJ.slice(0, 2)}.${cleanCNPJ.slice(2, 5)}.${cleanCNPJ.slice(
      5,
      8
    )}/${cleanCNPJ.slice(8, 12)}-${cleanCNPJ.slice(12)}`;
  }
  return cnpj;
}

export function formatPhoneDisplay(phone: string): string {
  const cleanPhone = phone.replace(/[^\d]/g, '');
  if (cleanPhone.length === 11) {
    return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(
      2,
      7
    )}-${cleanPhone.slice(7)}`;
  } else if (cleanPhone.length === 10) {
    return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(
      2,
      6
    )}-${cleanPhone.slice(6)}`;
  }
  return phone;
}

export function validateCompanyData(data: { name?: string; cnpj?: string; email?: string; website?: string }): string[] {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length < 3) {
    errors.push('Nome da empresa deve ter pelo menos 3 caracteres');
  }

  if (!data.cnpj) {
    errors.push('CNPJ é obrigatório');
  }

  if (!data.email) {
    errors.push('Email é obrigatório');
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.push('Email deve ter um formato válido');
  }

  if (data.website && !data.website.startsWith('http')) {
    errors.push('Website deve incluir http:// ou https://');
  }

  return errors;
}
