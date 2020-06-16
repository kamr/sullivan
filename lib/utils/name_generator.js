"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
function generateName() {
    return `${ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]} ${THINGS[Math.floor(Math.random() * THINGS.length)]}`;
}
exports.generateName = generateName;
