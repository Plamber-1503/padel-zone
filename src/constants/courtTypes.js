/**
 * courtTypes.js
 *
 * Tipos de superficie, amenidades y opciones de filtro.
 * Antes los labels de superficie estaban en MyCourtsManager.jsx
 * y las opciones de filtro en Courts.jsx.
 */

export const SURFACE_TYPE = {
  SYNTHETIC_GRASS: "cesped_sintetico",
  CEMENT:          "cemento",
  CRYSTAL:         "cristal",
};

export const SURFACE_TYPE_LABELS = {
  [SURFACE_TYPE.SYNTHETIC_GRASS]: "Césped Sintético",
  [SURFACE_TYPE.CEMENT]:          "Cemento",
  [SURFACE_TYPE.CRYSTAL]:         "Cristal",
};

/**
 * Amenidades disponibles para filtrar canchas.
 * El campo `value` es el que se guarda en la base de datos.
 * El campo `label` es el texto que ve el usuario.
 */
export const AMENITY_FILTER_OPTIONS = [
  { label: "Techada",         value: "Techada"         },
  { label: "Estacionamiento", value: "Estacionamiento" },
  { label: "Wifi",            value: "Wi-Fi"           },
  { label: "Bar",             value: "Bar"             },
  { label: "Vestuarios",      value: "Vestuarios"      },
  { label: "Iluminación LED", value: "Iluminación LED" },
  { label: "Pileta",          value: "Pileta"          },
  { label: "Restaurante",     value: "Restaurante"     },
];
