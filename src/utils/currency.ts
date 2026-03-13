export const formatCurrency = (value: number | undefined): string => {
  if (value === undefined || value === null) {
    return '';
  }
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export const parseCurrency = (value: string): number | undefined => {
  if (!value) {
    return undefined;
  }
  // Remove tudo que não for número ou vírgula, substitui vírgula por ponto
  const cleaned = value.replace(/[^\d,]/g, '').replace(',', '.');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? undefined : parsed;
};