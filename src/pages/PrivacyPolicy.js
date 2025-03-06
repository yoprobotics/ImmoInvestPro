import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Politique de confidentialité</h1>
        </div>
        <div className="card-body">
          <div className="mb-4">
            <p>
              Chez ImmoInvestPro, nous accordons une grande importance à la confidentialité de vos données. 
              Cette politique de confidentialité explique comment nous collectons, utilisons, partageons et protégeons vos informations 
              lorsque vous utilisez notre application.
            </p>
          </div>

          <div className="mb-4">
            <h2 className="text-primary mb-3">1. Informations que nous recueillons</h2>
            <p>Nous pouvons collecter les types d'informations suivants :</p>
            
            <h3 className="mb-2">Informations que vous nous fournissez</h3>
            <ul>
              <li>Informations de compte (nom, adresse e-mail, mot de passe)</li>
              <li>Informations de profil (numéro de téléphone, adresse)</li>
              <li>Données d'investissements immobiliers que vous saisissez (propriétés, calculs financiers)</li>
              <li>Communications que vous avez avec nous</li>
            </ul>
            
            <h3 className="mb-2">Informations collectées automatiquement</h3>
            <ul>
              <li>Données d'utilisation (pages visitées, temps passé sur l'application)</li>
              <li>Informations sur l'appareil (type d'appareil, système d'exploitation, adresse IP)</li>
              <li>Données de localisation (si vous avez activé cette fonctionnalité)</li>
              <li>Cookies et technologies similaires</li>
            </ul>
          </div>

          <div className="mb-4">
            <h2 className="text-primary mb-3">2. Comment nous utilisons vos informations</h2>
            <p>Nous utilisons les informations recueillies pour :</p>
            <ul>
              <li>Fournir, maintenir et améliorer l'application</li>
              <li>Créer et gérer votre compte</li>
              <li>Traiter vos calculs et analyses d'investissement immobilier</li>
              <li>Vous envoyer des informations techniques, des mises à jour et des messages administratifs</li>
              <li>Répondre à vos commentaires, questions et demandes</li>
              <li>Surveiller et analyser les tendances d'utilisation pour améliorer l'application</li>
              <li>Détecter, prévenir et résoudre les problèmes techniques ou de sécurité</li>
              <li>Vous envoyer des communications marketing (avec votre consentement)</li>
            </ul>
          </div>

          <div className="mb-4">
            <h2 className="text-primary mb-3">3. Partage de vos informations</h2>
            <p>Nous ne vendons pas vos informations personnelles. Nous pouvons partager vos informations dans les situations suivantes :</p>
            <ul>
              <li><strong>Avec votre consentement</strong> : Nous partagerons vos informations si vous nous en donnez l'autorisation.</li>
              <li><strong>Avec nos fournisseurs de services</strong> : Nous pouvons partager vos informations avec des tiers qui fournissent des services en notre nom (hébergement, analyse de données, assistance client).</li>
              <li><strong>Pour des raisons légales</strong> : Nous pouvons divulguer vos informations si nous pensons que cela est nécessaire pour se conformer à la loi, protéger nos droits ou la sécurité d'autrui.</li>
              <li><strong>En cas de transfert d'entreprise</strong> : Si ImmoInvestPro est impliqué dans une fusion, acquisition ou vente d'actifs, vos informations peuvent être transférées.</li>
            </ul>
          </div>

          <div className="mb-4">
            <h2 className="text-primary mb-3">4. Sécurité de vos informations</h2>
            <p>
              Nous prenons des mesures raisonnables pour protéger vos informations contre la perte, l'utilisation abusive, l'accès non autorisé, 
              la divulgation, l'altération et la destruction. Ces mesures comprennent le chiffrement des données, des pare-feu, des contrôles 
              d'accès et des examens réguliers de nos pratiques de sécurité.
            </p>
            <p>
              Cependant, aucune méthode de transmission sur Internet ou de stockage électronique n'est totalement sécurisée. Bien que nous nous 
              efforcions de protéger vos informations personnelles, nous ne pouvons garantir leur sécurité absolue.
            </p>
          </div>

          <div className="mb-4">
            <h2 className="text-primary mb-3">5. Conservation des données</h2>
            <p>
              Nous conserverons vos informations personnelles aussi longtemps que votre compte est actif ou que nécessaire pour vous fournir nos services. 
              Nous conserverons et utiliserons également vos informations dans la mesure nécessaire pour nous conformer à nos obligations légales, 
              résoudre les litiges et appliquer nos accords.
            </p>
          </div>

          <div className="mb-4">
            <h2 className="text-primary mb-3">6. Vos droits et choix</h2>
            <p>Selon votre lieu de résidence, vous pouvez avoir certains droits concernant vos informations personnelles :</p>
            <ul>
              <li><strong>Accès et mise à jour</strong> : Vous pouvez accéder et mettre à jour vos informations via les paramètres de votre compte.</li>
              <li><strong>Suppression</strong> : Vous pouvez demander la suppression de votre compte et de vos données.</li>
              <li><strong>Objection et restriction</strong> : Dans certaines circonstances, vous pouvez vous opposer au traitement de vos informations ou en demander la limitation.</li>
              <li><strong>Portabilité</strong> : Vous pouvez demander une copie de vos données dans un format structuré et lisible par machine.</li>
              <li><strong>Retrait du consentement</strong> : Vous pouvez retirer votre consentement à tout moment pour le traitement futur.</li>
            </ul>
            <p>
              Pour exercer ces droits, veuillez nous contacter via les informations fournies dans la section "Contactez-nous". Notez que certains 
              de ces droits peuvent être soumis à des limitations et exceptions selon les lois applicables.
            </p>
          </div>

          <div className="mb-4">
            <h2 className="text-primary mb-3">7. Transferts internationaux de données</h2>
            <p>
              Vos informations peuvent être transférées et traitées dans des pays autres que celui où vous résidez. Ces pays peuvent avoir des lois 
              sur la protection des données différentes de celles de votre pays.
            </p>
            <p>
              Si nous transférons vos informations à l'étranger, nous prendrons des mesures pour garantir qu'elles bénéficient d'un niveau de 
              protection adéquat conformément à cette politique de confidentialité et aux lois applicables.
            </p>
          </div>

          <div className="mb-4">
            <h2 className="text-primary mb-3">8. Modifications de cette politique</h2>
            <p>
              Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. La version mise à jour sera indiquée par une date 
              de "dernière mise à jour" révisée et sera accessible via l'application. Nous vous encourageons à consulter régulièrement cette politique 
              pour rester informé de la façon dont nous protégeons vos informations.
            </p>
          </div>

          <div className="mb-4">
            <h2 className="text-primary mb-3">9. Contactez-nous</h2>
            <p>
              Si vous avez des questions concernant cette politique de confidentialité ou nos pratiques en matière de protection des données, 
              veuillez nous contacter à l'adresse fournie dans la section "Contactez-nous" de l'application.
            </p>
          </div>

          <div className="text-muted mt-5">
            <p>Dernière mise à jour: 6 mars 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
