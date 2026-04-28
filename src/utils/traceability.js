const normalize = (s) =>
  (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

// Km 0 → Úbeda / Jaén / productor explícitamente local
const KM0_KEYWORDS = [
  'bodega propia',
  'huerta propia',
  'produccion local',
  'finca local',
  'ecologica local',
  'ecologico local',
  'cabra local',
  'ubeda',
  'jaen',
  'local',
];

// Nacional → otra región española (se comprueba ANTES que Andalucía para evitar
// falsos positivos en productos como "Pimentón de la Vera" que mencionan "andaluza")
const NACIONAL_KEYWORDS = [
  'cantabrico',
  'valencian',
  'la mancha',
  'la vera',
  'manchego',
  'canarias',
  'calanda',
  'lleida',
  'benicarlo',
  'murcia',
  'jerte',
  'elche',
];

// Andalucía → región andaluza pero no necesariamente Jaén
const ANDALUCIA_KEYWORDS = [
  'costa tropical',
  'vega granadina',
  'mediterraneo',
  'antequera',
  'almadraba',
  'andalucia',
  'andaluz',
  'huelva',
  'iberico',
  'malaga',
];

export function getOriginTag(nombre = '', descripcion = '') {
  const text = normalize(nombre + ' ' + descripcion);

  for (const kw of KM0_KEYWORDS) {
    if (text.includes(kw)) return { type: 'km0', label: 'Km 0' };
  }

  for (const kw of NACIONAL_KEYWORDS) {
    if (text.includes(kw)) return { type: 'nacional', label: 'España' };
  }

  for (const kw of ANDALUCIA_KEYWORDS) {
    if (text.includes(kw)) return { type: 'andalucia', label: 'Andalucía' };
  }

  return null;
}
