export const TiposDeAto = [
    'Ata Notarial',
    'Autenticação de Cópia',
    'Contrato de Compra e Venda',
    'Contrato de Doação',
    'Contrato de Locação',
    'Escritura de Imóvel',
    'Procuração',
    'Reconhecimento de Firma',
    'Testamento',
    'Outro'
] as const;

export type TipoDeAto = typeof TiposDeAto[number];
