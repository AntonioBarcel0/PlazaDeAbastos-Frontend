// Fotos reales de cada puesto, indexadas por UUID de vendedor.
// Se usan como fallback cuando imagenPrincipal no está cargada en el backend.
const VENDOR_IMAGES = {
  '34d59fe5-c14e-493c-9059-0e69520d2748': 'https://res.cloudinary.com/dlmnchkjg/image/upload/v1777304573/Captura_de_pantalla_2026-04-27_a_las_17.42.49_th3nza.png',  // Jurado — Frutas
  'fd93ea56-4cfc-4bae-b23e-415d55d8b80e': 'https://res.cloudinary.com/dlmnchkjg/image/upload/v1777304794/Captura_de_pantalla_2026-04-27_a_las_17.46.30_dy4e6w.png',  // Molina Hig. — Panadería
  'bfa9c04f-c6c4-4803-99a0-faace7612128': 'https://res.cloudinary.com/dlmnchkjg/image/upload/v1777304928/Captura_de_pantalla_2026-04-27_a_las_17.48.44_dpp9o5.png',  // Padilla — Frutas
  'ce8544ae-f625-4b5e-866c-e2d9aee24c10': 'https://res.cloudinary.com/dlmnchkjg/image/upload/v1777304518/Captura_de_pantalla_2026-04-27_a_las_17.41.54_cgs1kx.png',  // Moyano — Especias
  '1a33b0b8-6e9a-4000-8146-b2846b2981d6': 'https://res.cloudinary.com/dlmnchkjg/image/upload/v1777304877/Captura_de_pantalla_2026-04-27_a_las_17.47.52_jc4th6.png',  // Rodríguez — Comestibles
  '819ce9c1-ce5a-448e-8362-598fbbcc6fe3': 'https://res.cloudinary.com/dlmnchkjg/image/upload/v1777304776/Captura_de_pantalla_2026-04-27_a_las_17.46.13_k8b78d.png',  // Molina B. — Frutas
  'e2141f28-8775-4d1c-8876-8683794a4a99': 'https://res.cloudinary.com/dlmnchkjg/image/upload/v1777304478/Captura_de_pantalla_2026-04-27_a_las_17.41.14_ykqkol.png',  // Moreno — Jardinería
  'f82d133b-e9c3-4264-8acc-2682a368bd0f': 'https://res.cloudinary.com/dlmnchkjg/image/upload/v1777304537/Captura_de_pantalla_2026-04-27_a_las_17.42.14_qqnaig.png',  // Muñoz — Panadería
  'c1070484-ff1d-4a8b-8bf4-85e4bb9bb439': 'https://res.cloudinary.com/dlmnchkjg/image/upload/v1777304621/Captura_de_pantalla_2026-04-27_a_las_17.43.37_quwbtq.png',  // Juan Cortés — Frutas
  'dd1991e7-ae8a-4b7d-8bda-e56f2c3084f9': 'https://res.cloudinary.com/dlmnchkjg/image/upload/v1777304597/Captura_de_pantalla_2026-04-27_a_las_17.43.13_ofgnhw.png',  // Molina M. — Frutas
  '095b2fcd-f30d-4bf1-b402-e1883fee661a': 'https://res.cloudinary.com/dlmnchkjg/image/upload/v1777304825/Captura_de_pantalla_2026-04-27_a_las_17.47.00_ijtw44.png',  // Molina Hip. — Comestibles
  'a9f57f59-bbd3-43dd-8bba-2c92bbc1286e': 'https://res.cloudinary.com/dlmnchkjg/image/upload/v1777304910/Captura_de_pantalla_2026-04-27_a_las_17.48.26_v95x74.png',  // López — Frutas
  '2e0b6709-687f-4f3c-8271-37e8500ccd43': 'https://res.cloudinary.com/dlmnchkjg/image/upload/v1777304852/Captura_de_pantalla_2026-04-27_a_las_17.47.27_pq7q1h.png',  // Ruíz Pasc. — Comestibles
};

export default VENDOR_IMAGES;
