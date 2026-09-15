export const normalizeAccessCode=value=>String(value??'').replace(/\D/g,'').slice(0,6);

export const isValidAccessCode=value=>/^\d{6}$/.test(normalizeAccessCode(value));

export const accessCodeEmail=value=>`${normalizeAccessCode(value)}@estudiantes.valle-esmeralda.invalid`;
