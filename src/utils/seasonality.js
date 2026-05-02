const MONTH_TO_SEASON = {
  1: 'invierno', 2: 'invierno',
  3: 'primavera', 4: 'primavera', 5: 'primavera',
  6: 'verano', 7: 'verano', 8: 'verano',
  9: 'otono', 10: 'otono', 11: 'otono',
  12: 'invierno',
};

export const SEASON_META = {
  primavera: { label: 'Primavera', icon: '🌸' },
  verano:    { label: 'Verano',    icon: '☀️' },
  otono:     { label: 'Otoño',     icon: '🍂' },
  invierno:  { label: 'Invierno',  icon: '❄️' },
};

// keywords normalized (no accents, lowercase) → seasons where the product is in season
const SEASONAL = {
  'albaricoque':   ['primavera', 'verano'],
  'alcachofa':     ['primavera', 'otono'],
  'acelga':        ['primavera', 'invierno'],
  'esparrago':     ['primavera', 'verano'],
  'espinaca':      ['primavera', 'invierno'],
  'freson':        ['primavera'],
  'fresa':         ['primavera'],
  'guisante':      ['primavera'],
  'haba':          ['primavera'],
  'lechuga':       ['primavera', 'verano'],
  'rabano':        ['primavera'],
  'cereza':        ['primavera', 'verano'],
  'berenjena':     ['verano'],
  'calabacin':     ['verano'],
  'ciruela':       ['verano'],
  'higo':          ['verano', 'otono'],
  'judia verde':   ['verano'],
  'melocoton':     ['verano'],
  'melon':         ['verano'],
  'pepino':        ['verano'],
  'pimiento':      ['verano', 'otono'],
  'sandia':        ['verano'],
  'tomate':        ['verano'],
  'brocoli':       ['otono', 'invierno'],
  'castana':       ['otono'],
  'caqui':         ['otono'],
  'champinon':     ['otono'],
  'coliflor':      ['otono', 'invierno'],
  'granada':       ['otono'],
  'manzana':       ['otono', 'invierno'],
  'membrillo':     ['otono'],
  'nuez':          ['otono'],
  'pera':          ['otono', 'invierno'],
  'seta':          ['otono'],
  'uva':           ['otono'],
  'col':           ['invierno'],
  'limon':         ['invierno'],
  'mandarina':     ['invierno'],
  'naranja':       ['invierno'],
  'puerro':        ['invierno'],
  'repollo':       ['invierno'],
  'zanahoria':     ['invierno'],
};

const normalize = (s) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const KEYWORDS_BY_LENGTH = Object.keys(SEASONAL).sort((a, b) => b.length - a.length);

export function getCurrentSeason() {
  return MONTH_TO_SEASON[new Date().getMonth() + 1];
}

export function getSeasonTag(nombre = '', categoria = '') {
  const text = normalize(nombre + ' ' + categoria);
  const season = getCurrentSeason();

  for (const keyword of KEYWORDS_BY_LENGTH) {
    if (text.includes(keyword)) {
      const seasons = SEASONAL[keyword];
      return {
        isSeasonal: true,
        inSeason: seasons.includes(season),
        currentSeason: season,
      };
    }
  }

  return { isSeasonal: false };
}
