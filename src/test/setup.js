import '@testing-library/jest-dom';

// Mock localStorage (jsdom no lo implementa correctamente en todos los entornos)
const localStorageMock = (() => {
  let store = {};
  return {
    getItem:    (key) => store[key] ?? null,
    setItem:    (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear:      () => { store = {}; },
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Limpiar localStorage antes de cada test para evitar que el carrito persista entre tests
beforeEach(() => {
  localStorage.clear();
});
