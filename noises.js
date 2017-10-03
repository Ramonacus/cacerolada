var list = [
  'BAM',
  'BANG',
  'CACHAPLÚN',
  'CACHING',
  'CACHONK',
  'CARRACRAC',
  'CATACROC',
  'CHUNDA',
  'CHUNDA TACHUNDA',
  'CLAC',
  'CLAN',
  'CLANCH',
  'CLANG',
  'CLANK',
  'CLEC',
  'CLEN',
  'CLENCH',
  'CLENG',
  'CLENK',
  'CLIC',
  'CLIN',
  'CLINCH',
  'CLING',
  'CLINK',
  'CLOC',
  'CLON',
  'CLONCH',
  'CLONG',
  'CLONK',
  'CLUC',
  'CLUN',
  'CLUNCH',
  'CLUNG',
  'CLUNK',
  'DOOOONG',
  'DONG',
  'GAN',
  'GAAAN',
  'GON',
  'GONG',
  'GOOONG',
  'KANG',
  'KONCH',
  'NANG',
  'NAAAANG',
  'RAKA RAKA RAKA',
  'TIC',
  'TIIING',
  'TIING',
  'TING',
  'TOC',
  'PATAPÚN',
  'PONCH',
  'PUNCHI',
  'PLAC',
  'PLAK',
  'PLING',
  'PLONK',
  'ZOING',
  'ZONK'
];


function getRandomNoise() {
  return list[Math.floor(Math.random() * list.length)];
}

function createNoises(maxLength) {
  var next = getRandomNoise();
  var noise;

  maxLength = maxLength || 140;

  do {
    noise = next;
    next += ' ' + getRandomNoise();
  } while (next.length < maxLength);

  return noise;
}

module.exports = {
  getRandomNoise: getRandomNoise,
  createNoises: createNoises
}