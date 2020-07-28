const ADJECTIVES = ['Happy', 'Glamurous', 'Affectionate', 'Ambitious', 'Compassionate', 'Courageous', 'Empathetic', 'Exuberant', 'Generous', 'Inventive', 'Philosofical', 'Sensible', 'Sympathetic', 'Witty'];
const THINGS = [
  '🐞',
  '🐠',
  '🐢',
  '🐦',
  '🐨',
  '🐬',
  '🐭',
  '🐮',
  '🐯',
  '🐰',
  '🐱',
  '🐲',
  '🐵',
  '🐶',
  '🐷',
  '🐸',
  '🐹',
  '🐻'
];

export function generateName() {
  return `${ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]} ${THINGS[Math.floor(Math.random() * THINGS.length)]}`
}


export function generateColor(str: string): string {
  return intToRGB(hashCode(str));
}

function hashCode(str: string): number { // java String#hashCode
  str += "salty"
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
     hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
} 

function intToRGB(i: number): string {
  var c = (i & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();

  return "00000".substring(0, 6 - c.length) + c;
}

// function hashStringToString(str: string): number {
//   var hash = 0;
//   if (str.length == 0)
//     return hash;
//   for (let i = 0; i < str.length; i++) {
//     var charCode = str.charCodeAt(i);
//     hash = ((hash << 7) - hash) + charCode;
//     hash = hash & hash;
//   }
// }
export function generatePin(str: string): string {
  // ((x%n)+n)%n to avoid negative
  return (((hashCode(str) % 10000) + 10000) % 10000).toString().padStart(4, '0');
}
