/**
 * Module de gestion des profils utilisateurs
 * 
 * Ce module gère les fonctionnalités liées aux profils utilisateurs:
 * - Récupération des informations de profil
 * - Mise à jour des informations de profil
 * - Gestion des données personnelles
 */

/**
 * Récupère le profil d'un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @return {Promise<Object>} - Données du profil
 */
async function getUserProfile(userId) {
  try {
    // Récupérer le profil depuis la base de données
    // TODO: Implémenter la récupération
    
    // Exemple de données de profil (à remplacer par les données réelles)
    return {
      id: userId,
      email: "utilisateur@exemple.com",
      nom: "Nom",
      prenom: "Prénom",
      telephone: "000-000-0000",
      dateInscription: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 jours avant aujourd'hui
      profileCompleted: false,
      investissementType: null, // 'FLIP' ou 'MULTI' ou null si non défini
      region: null,
      secteurs: []
    };
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error);
    throw error;
  }
}

/**
 * Met à jour le profil d'un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @param {Object} profileData - Nouvelles données de profil
 * @return {Promise<Object>} - Résultat de la mise à jour
 */
async function updateUserProfile(userId, profileData) {
  try {
    // Valider les données du profil
    validateProfileData(profileData);
    
    // Mettre à jour le profil dans la base de données
    // TODO: Implémenter la mise à jour
    
    return {
      success: true,
      message: "Profil mis à jour avec succès."
    };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    return {
      success: false,
      message: error.message || "Une erreur est survenue lors de la mise à jour du profil."
    };
  }
}

/**
 * Supprime le compte d'un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @param {string} password - Mot de passe pour confirmation
 * @return {Promise<Object>} - Résultat de la suppression
 */
async function deleteUserAccount(userId, password) {
  try {
    // Vérifier le mot de passe
    // TODO: Implémenter la vérification
    
    // Supprimer les données de l'utilisateur
    // TODO: Implémenter la suppression
    
    return {
      success: true,
      message: "Compte supprimé avec succès."
    };
  } catch (error) {
    console.error("Erreur lors de la suppression du compte:", error);
    return {
      success: false,
      message: error.message || "Une erreur est survenue lors de la suppression du compte."
    };
  }
}

/**
 * Vérifie si un profil est complet
 * @param {Object} profileData - Données du profil
 * @return {boolean} - Vrai si le profil est complet
 */
function isProfileComplete(profileData) {
  // Vérifier les champs obligatoires
  const requiredFields = ['nom', 'prenom', 'email', 'telephone', 'investissementType'];
  
  for (const field of requiredFields) {
    if (!profileData[field]) {
      return false;
    }
  }
  
  // Vérifier les champs spécifiques selon le type d'investissement
  if (profileData.investissementType === 'FLIP' || profileData.investissementType === 'MULTI') {
    if (!profileData.region || !profileData.secteurs.length) {
      return false;
    }
  }
  
  return true;
}

/**
 * Valide les données du profil
 * @param {Object} profileData - Données à valider
 * @throws {Error} Si les données sont invalides
 */
function validateProfileData(profileData) {
  // Validation des champs
  if (profileData.email && !isValidEmail(profileData.email)) {
    throw new Error("Adresse email invalide");
  }
  
  if (profileData.telephone && !isValidPhone(profileData.telephone)) {
    throw new Error("Numéro de téléphone invalide");
  }
  
  if (profileData.investissementType &&
      profileData.investissementType !== 'FLIP' &&
      profileData.investissementType !== 'MULTI') {
    throw new Error("Type d'investissement invalide. Doit être 'FLIP' ou 'MULTI'");
  }
}

/**
 * Vérifie si un email est valide
 * @param {string} email - Email à vérifier
 * @return {boolean} - Vrai si l'email est valide
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Vérifie si un numéro de téléphone est valide
 * @param {string} phone - Numéro à vérifier
 * @return {boolean} - Vrai si le numéro est valide
 */
function isValidPhone(phone) {
  // Format québécois: XXX-XXX-XXXX ou (XXX) XXX-XXXX
  const phoneRegex = /^(\(\d{3}\)|\d{3})[\s-]?\d{3}[\s-]?\d{4}$/;
  return phoneRegex.test(phone);
}

module.exports = {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  isProfileComplete
};
