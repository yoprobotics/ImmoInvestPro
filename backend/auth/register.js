/**
 * Module d'inscription des utilisateurs
 * 
 * Ce module gère le processus d'inscription des utilisateurs:
 * - Création de compte
 * - Validation des données
 * - Attribution du niveau d'accès initial (gratuit)
 */

/**
 * Structure des données utilisateur
 * @typedef {Object} UserData
 * @property {string} email - Email de l'utilisateur
 * @property {string} password - Mot de passe (chiffré)
 * @property {string} firstName - Prénom
 * @property {string} lastName - Nom de famille
 * @property {string} [phone] - Numéro de téléphone (optionnel)
 */

/**
 * Structure du résultat d'inscription
 * @typedef {Object} RegistrationResult
 * @property {boolean} success - Succès de l'inscription
 * @property {string} message - Message descriptif
 * @property {string} [userId] - ID de l'utilisateur créé (si succès)
 * @property {Array<string>} [errors] - Liste des erreurs (si échec)
 */

/**
 * Valide les données d'inscription
 * @param {UserData} userData - Données utilisateur à valider
 * @returns {Object} Résultat de la validation {valid: boolean, errors: Array}
 */
function validateUserData(userData) {
  const errors = [];
  
  // Validation de l'email
  if (!userData.email) {
    errors.push("L'email est requis");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
    errors.push("Format d'email invalide");
  }
  
  // Validation du mot de passe
  if (!userData.password) {
    errors.push("Le mot de passe est requis");
  } else if (userData.password.length < 8) {
    errors.push("Le mot de passe doit contenir au moins 8 caractères");
  }
  
  // Validation du prénom
  if (!userData.firstName) {
    errors.push("Le prénom est requis");
  }
  
  // Validation du nom
  if (!userData.lastName) {
    errors.push("Le nom est requis");
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Vérifie si un email existe déjà dans la base de données
 * @param {string} email - Email à vérifier
 * @returns {Promise<boolean>} - true si l'email existe déjà
 */
async function emailExists(email) {
  // TODO: Implémenter la vérification dans la base de données
  // Exemple de code temporaire
  return false;
}

/**
 * Crée un nouvel utilisateur avec le niveau gratuit par défaut
 * @param {UserData} userData - Données utilisateur validées
 * @returns {Promise<Object>} - Objet utilisateur créé
 */
async function createUser(userData) {
  try {
    // TODO: Implémenter la création de l'utilisateur dans la base de données
    // Exemple de code temporaire
    return {
      id: `user_${Date.now()}`,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone || null,
      createdAt: new Date().toISOString(),
      subscriptionTier: 'FREE', // Niveau gratuit par défaut
      subscriptionExpiry: null, // Pas de date d'expiration pour le niveau gratuit
    };
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);
    throw error;
  }
}

/**
 * Envoie un email de bienvenue à l'utilisateur
 * @param {Object} user - Objet utilisateur créé
 * @returns {Promise<void>}
 */
async function sendWelcomeEmail(user) {
  try {
    // TODO: Implémenter l'envoi d'email
    console.log(`Email de bienvenue envoyé à ${user.email}`);
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de bienvenue:", error);
    // Ne pas bloquer le processus d'inscription si l'email échoue
  }
}

/**
 * Initialise les préférences par défaut de l'utilisateur
 * @param {string} userId - ID de l'utilisateur créé
 * @returns {Promise<void>}
 */
async function initializeUserPreferences(userId) {
  try {
    // TODO: Initialiser les préférences par défaut
    console.log(`Préférences initialisées pour l'utilisateur ${userId}`);
  } catch (error) {
    console.error("Erreur lors de l'initialisation des préférences:", error);
    // Ne pas bloquer le processus d'inscription si l'initialisation échoue
  }
}

/**
 * Gère le processus complet d'inscription
 * @param {UserData} userData - Données utilisateur à inscrire
 * @returns {Promise<RegistrationResult>} - Résultat de l'inscription
 */
async function registerUser(userData) {
  try {
    // Validation des données
    const validation = validateUserData(userData);
    if (!validation.valid) {
      return {
        success: false,
        message: "Validation des données échouée",
        errors: validation.errors
      };
    }
    
    // Vérification de l'existence de l'email
    const exists = await emailExists(userData.email);
    if (exists) {
      return {
        success: false,
        message: "Cet email est déjà utilisé",
        errors: ["Email déjà utilisé"]
      };
    }
    
    // Création de l'utilisateur
    const user = await createUser(userData);
    
    // Envoi de l'email de bienvenue (asynchrone)
    sendWelcomeEmail(user).catch(err => console.error("Échec de l'envoi de l'email:", err));
    
    // Initialisation des préférences (asynchrone)
    initializeUserPreferences(user.id).catch(err => console.error("Échec de l'initialisation des préférences:", err));
    
    return {
      success: true,
      message: "Inscription réussie",
      userId: user.id
    };
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de l'inscription",
      errors: [error.message || "Erreur interne du serveur"]
    };
  }
}

module.exports = {
  registerUser,
  validateUserData,
  emailExists
};
