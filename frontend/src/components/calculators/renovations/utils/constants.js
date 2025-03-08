/**
 * Constants pour le calculateur d'estimation des rénovations
 * Basé sur la méthode d'estimation à 500$ des Secrets de l'immobilier
 */

// Prix des rénovations par pièce (estimations de base)
export const BASELINE_COSTS = {
  KITCHEN: 10000,           // Cuisine
  BATHROOM: 5000,           // Salle de bain
  POWDER_ROOM: 3000,        // Salle d'eau
  FLOOR_PER_SQFT: 5,        // Planchers ($/pied carré)
  PAINT_PER_GALLON: 500,    // Peinture ($/gallon)
  EXTERIOR_DOOR: 1500,      // Porte extérieure
  INTERIOR_DOOR: 500,       // Porte intérieure + porte de garde-robe
  BASEMENT_WINDOW: 500,     // Fenêtre sous-sol (200$ + installation)
  BEDROOM_WINDOW: 500,      // Fenêtre chambre (350$ + installation)
  LIVING_ROOM_WINDOW: 1500, // Fenêtre salon (1200$ + installation)
};

// Types de pièces disponibles
export const ROOM_TYPES = {
  KITCHEN: "Cuisine",
  BATHROOM: "Salle de bain",
  POWDER_ROOM: "Salle d'eau",
  LIVING_ROOM: "Salon",
  DINING_ROOM: "Salle à manger",
  BEDROOM: "Chambre",
  OFFICE: "Bureau",
  BASEMENT: "Sous-sol",
  LAUNDRY: "Buanderie",
  HALLWAY: "Couloir",
  ENTRANCE: "Entrée",
  GARAGE: "Garage",
  EXTERIOR: "Extérieur"
};

// Types d'éléments rénovables disponibles par pièce
export const RENOVATION_ELEMENTS = {
  WALLS: "Murs",
  CEILING: "Plafond",
  FLOOR: "Plancher",
  DOORS: "Portes",
  WINDOWS: "Fenêtres",
  LIGHTING: "Éclairage",
  PLUMBING: "Plomberie",
  ELECTRICAL: "Électricité",
  CABINETS: "Armoires",
  COUNTERTOP: "Comptoir",
  APPLIANCES: "Électroménagers",
  BATHROOM_FIXTURES: "Accessoires salle de bain",
  PAINTING: "Peinture",
  TRIM: "Moulures",
  STAIRS: "Escaliers",
  INSULATION: "Isolation",
  HVAC: "Chauffage/Climatisation",
  ROOF: "Toiture",
  SIDING: "Revêtement extérieur",
  LANDSCAPING: "Aménagement paysager",
  DRIVEWAY: "Entrée",
  DECK_PATIO: "Terrasse/Patio",
};

// Modèle vide pour une pièce
export const EMPTY_ROOM = {
  id: null,
  type: "",
  name: "",
  elements: [],
  totalCost: 0,
  notes: "",
};

// Modèle vide pour un élément de rénovation
export const EMPTY_ELEMENT = {
  id: null,
  type: "",
  description: "",
  quantity: 1,
  unitPrice: 500, // Méthode des 500$
  totalPrice: 500,
  notes: "",
};

// Modèle de données initial pour le calculateur de rénovations
export const INITIAL_RENOVATION_STATE = {
  generalInfo: {
    projectName: "",
    address: "",
    propertyType: "",
    squareFootage: 0,
    notes: "",
  },
  rooms: [],
  summary: {
    totalRenovationCost: 0,
    contingencyPercentage: 10,
    contingencyAmount: 0,
    grandTotal: 0,
  },
};
