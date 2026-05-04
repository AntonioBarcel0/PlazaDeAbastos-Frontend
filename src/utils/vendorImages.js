// Fotos reales de cada puesto, indexadas por UUID de vendedor.
// Se usan como fallback cuando imagenPerfil no está cargada en el backend.
const VENDOR_IMAGES = {
  'd5e7396a-e31a-4ad3-8d64-92d14470252a': 'https://res.cloudinary.com/dlmnchkjg/image/upload/v1777304478/Captura_de_pantalla_2026-04-27_a_las_17.41.14_ykqkol.png',   // Alonso Moreno Manjón
  '521348e7-eda3-428f-a1cd-e445d7313c2a': 'https://res.cloudinary.com/dlmnchkjg/image/upload/v1777304518/Captura_de_pantalla_2026-04-27_a_las_17.41.54_cgs1kx.png',   // Bartolomé Moyano Hurtado
  'e5ef2c77-9af5-4da1-be5c-69fd4b519c4e': 'https://res.cloudinary.com/dlmnchkjg/image/upload/v1777304825/Captura_de_pantalla_2026-04-27_a_las_17.47.00_ijtw44.png',   // Dolores Muñoz Guerrero
  'fb2b404c-ac7e-429a-8958-66ce3dd82a8e': 'https://res.cloudinary.com/dlmnchkjg/image/upload/v1777304573/Captura_de_pantalla_2026-04-27_a_las_17.42.49_th3nza.png',   // Francisco Padilla Quesada
  '5523eab7-1f43-4d1e-90b6-713278514bc4': 'https://res.cloudinary.com/dlmnchkjg/image/upload/v1777304597/Captura_de_pantalla_2026-04-27_a_las_17.43.13_ofgnhw.png',   // Gaspar Molina Muñoz
  '883a1754-b054-42c7-b11e-ee53fe76e997': 'https://res.cloudinary.com/dlmnchkjg/image/upload/v1777304621/Captura_de_pantalla_2026-04-27_a_las_17.43.37_quwbtq.png',   // Ginés Juan Cortés
  'dd5dca50-3246-442d-82db-d831b6a33ab3': 'https://res.cloudinary.com/dlmnchkjg/image/upload/v1777304776/Captura_de_pantalla_2026-04-27_a_las_17.46.13_k8b78d.png',   // Juan Jurado Ruíz
  'b767fd14-6123-47e1-8f2a-9327925c7204': 'https://res.cloudinary.com/dlmnchkjg/image/upload/v1777304794/Captura_de_pantalla_2026-04-27_a_las_17.46.30_dy4e6w.png',   // María del Mar Molina Higueras
  '7d864317-5853-4b6a-ae28-5b5bd3fe9f9f': 'https://res.cloudinary.com/dlmnchkjg/image/upload/v1777304825/Captura_de_pantalla_2026-04-27_a_las_17.47.00_ijtw44.png',   // María Dolores Ruíz Pascual
  '42586418-086f-4aee-82dc-86ac6b9550d4': 'https://res.cloudinary.com/dlmnchkjg/image/upload/v1777304852/Captura_de_pantalla_2026-04-27_a_las_17.47.27_pq7q1h.png',   // María Josefa Molina Hipólito
  'a4a03b02-262f-4aa6-9c8d-91ce081b1898': 'https://res.cloudinary.com/dlmnchkjg/image/upload/v1777304928/Captura_de_pantalla_2026-04-27_a_las_17.48.44_dpp9o5.png',   // Rosenda López Alaminos
  '4a7becc9-842a-4dfc-966b-e33b5f37e177': 'https://res.cloudinary.com/dlmnchkjg/image/upload/v1777304877/Captura_de_pantalla_2026-04-27_a_las_17.47.52_jc4th6.png',   // Rosa María Rodríguez Rodríguez
  'f25401ce-1c13-4218-b8aa-cff726321f52': 'https://res.cloudinary.com/dlmnchkjg/image/upload/v1777304910/Captura_de_pantalla_2026-04-27_a_las_17.48.26_v95x74.png',   // Salvador Molina Barbero
};

export default VENDOR_IMAGES;
