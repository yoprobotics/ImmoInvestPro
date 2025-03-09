document.addEventListener('DOMContentLoaded', function() {
    // Gestion des onglets
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Retirer la classe active de tous les boutons et onglets
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Ajouter la classe active au bouton cliqué et à l'onglet correspondant
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            // Mettre à jour les graphiques si on est dans l'onglet budget ou synthèse
            if (tabId === 'budget-tracking') {
                updateBudgetCharts();
            } else if (tabId === 'summary') {
                updateSummary();
            } else if (tabId === 'material-costs') {
                loadRenovationCosts();
            }
        });
    });
    
    // Initialisation du stockage local
    if (!localStorage.getItem('renovationProjects')) {
        localStorage.setItem('renovationProjects', JSON.stringify({}));
    }
    
    // Initialisation du projet courant
    let currentProject = {
        info: {},
        rooms: [],
        expenses: []
    };
    
    // Données des coûts de rénovation
    let renovationCostsData = null;
    
    // Charger les coûts de rénovation depuis le fichier JSON
    async function loadRenovationCosts() {
        try {
            // Vérifier si les données sont déjà chargées
            if (renovationCostsData !== null) {
                renderRenovationCosts();
                return;
            }
            
            // Charger les données depuis le fichier JSON
            const response = await fetch('/data/renovation-costs.json');
            if (!response.ok) {
                throw new Error('Impossible de charger les données des coûts de rénovation');
            }
            
            renovationCostsData = await response.json();
            
            // Afficher la date de dernière mise à jour
            document.getElementById('costs-last-updated').textContent = "Mise à jour: " + renovationCostsData.lastUpdated;
            
            // Afficher l'avertissement
            document.getElementById('costs-disclaimer').textContent = renovationCostsData.disclaimer;
            
            // Afficher les coûts de rénovation
            renderRenovationCosts();
        } catch (error) {
            console.error('Erreur lors du chargement des coûts de rénovation:', error);
            showNotification('Erreur lors du chargement des coûts de rénovation', 'error');
        }
    }
    
    // Afficher les coûts de rénovation
    function renderRenovationCosts() {
        if (!renovationCostsData) return;
        
        const costsContainer = document.getElementById('renovation-costs-container');
        costsContainer.innerHTML = '';
        
        // Créer un accordéon pour chaque catégorie
        renovationCostsData.categories.forEach(category => {
            const categoryAccordion = document.createElement('div');
            categoryAccordion.className = 'costs-category';
            
            // Entête de la catégorie
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'costs-category-header';
            categoryHeader.innerHTML = `
                <h3>${category.name}</h3>
                <span class="accordion-icon">▼</span>
            `;
            
            // Contenu de la catégorie (initialement masqué)
            const categoryContent = document.createElement('div');
            categoryContent.className = 'costs-category-content';
            
            // Créer un tableau pour chaque item de la catégorie
            category.items.forEach(item => {
                const itemSection = document.createElement('div');
                itemSection.className = 'costs-item';
                
                const itemTitle = document.createElement('h4');
                itemTitle.textContent = item.name;
                itemSection.appendChild(itemTitle);
                
                const itemTable = document.createElement('table');
                itemTable.className = 'costs-table';
                itemTable.innerHTML = `
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Unité</th>
                            <th>Coût</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${item.subItems.map(subItem => `
                            <tr>
                                <td>${subItem.description}</td>
                                <td>${subItem.unit}</td>
                                <td>${formatCurrency(subItem.cost)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                `;
                
                itemSection.appendChild(itemTable);
                categoryContent.appendChild(itemSection);
            });
            
            // Ajouter les éléments à l'accordéon
            categoryAccordion.appendChild(categoryHeader);
            categoryAccordion.appendChild(categoryContent);
            costsContainer.appendChild(categoryAccordion);
            
            // Ajouter un événement de clic pour l'accordéon
            categoryHeader.addEventListener('click', () => {
                categoryContent.style.display = categoryContent.style.display === 'block' ? 'none' : 'block';
                categoryHeader.querySelector('.accordion-icon').textContent = categoryContent.style.display === 'block' ? '▲' : '▼';
            });
        });
        
        // Ajouter la section du pourcentage de contingence
        const contingencySection = document.createElement('div');
        contingencySection.className = 'costs-contingency';
        contingencySection.innerHTML = `
            <h3>Contingence recommandée</h3>
            <p>Il est recommandé d'ajouter entre ${renovationCostsData.contingency.recommended.min}% et ${renovationCostsData.contingency.recommended.max}% au coût total pour les imprévus.</p>
            <p>Valeur par défaut: ${renovationCostsData.contingency.recommended.default}%</p>
        `;
        costsContainer.appendChild(contingencySection);
    }
    
    // Ajouter un nouvel onglet pour les coûts de rénovation
    function addMaterialCostsTab() {
        // Vérifier si l'onglet existe déjà
        if (document.getElementById('material-costs')) {
            return;
        }
        
        // Ajouter le bouton d'onglet
        const tabsContainer = document.querySelector('.tabs');
        const materialCostsButton = document.createElement('button');
        materialCostsButton.className = 'tab-button';
        materialCostsButton.setAttribute('data-tab', 'material-costs');
        materialCostsButton.innerHTML = `
            <i class="fas fa-money-bill-wave"></i>
            Coûts des matériaux
        `;
        tabsContainer.appendChild(materialCostsButton);
        
        // Ajouter le contenu de l'onglet
        const tabsContent = document.querySelector('.tab-content');
        const materialCostsPane = document.createElement('div');
        materialCostsPane.className = 'tab-pane';
        materialCostsPane.id = 'material-costs';
        materialCostsPane.innerHTML = `
            <div class="section-header">
                <h2>Coûts des matériaux et travaux</h2>
                <p id="costs-last-updated" class="last-updated">Chargement des données...</p>
            </div>
            <div class="costs-info">
                <p id="costs-disclaimer" class="disclaimer">Chargement des données...</p>
            </div>
            <div id="renovation-costs-container" class="costs-container">
                <p class="loading">Chargement des coûts de rénovation...</p>
            </div>
        `;
        tabsContent.appendChild(materialCostsPane);
        
        // Ajouter l'événement de clic sur le bouton
        materialCostsButton.addEventListener('click', () => {
            // Retirer la classe active de tous les boutons et onglets
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
            
            // Ajouter la classe active au bouton et à l'onglet
            materialCostsButton.classList.add('active');
            materialCostsPane.classList.add('active');
            
            // Charger les coûts de rénovation
            loadRenovationCosts();
        });
    }
    
    // ------------------- GESTION DES INFORMATIONS DU PROJET ------------------- //
    
    // Enregistrer les informations du projet
    document.getElementById('save-project-btn').addEventListener('click', function() {
        const projectForm = document.getElementById('project-form');
        
        if (!projectForm.checkValidity()) {
            projectForm.reportValidity();
            return;
        }
        
        const projectInfo = {
            name: document.getElementById('project-name').value,
            address: document.getElementById('project-address').value,
            type: document.getElementById('project-type').value,
            startDate: document.getElementById('start-date').value,
            endDate: document.getElementById('end-date').value,
            totalBudget: parseFloat(document.getElementById('total-budget').value) || 0,
            notes: document.getElementById('project-notes').value
        };
        
        currentProject.info = projectInfo;
        saveProject();
        
        // Mettre à jour l'affichage du budget total
        document.getElementById('total-budget-display').textContent = formatCurrency(projectInfo.totalBudget);
        
        // Notification à l'utilisateur
        showNotification('Informations du projet enregistrées avec succès!');
        
        // Passer à l'onglet suivant
        document.querySelector('[data-tab="room-list"]').click();
    });
    
    // ------------------- GESTION DES PIÈCES ------------------- //
    
    // Ouvrir la modale d'ajout de pièce
    document.getElementById('add-room-btn').addEventListener('click', function() {
        const modal = document.getElementById('add-room-modal');
        modal.style.display = 'block';
        
        // Réinitialiser le formulaire
        document.getElementById('add-room-form').reset();
        
        // Vider le conteneur de tâches
        document.getElementById('tasks-container').innerHTML = '';
        addTaskField();
    });
    
    // Fermer la modale d'ajout de pièce
    document.querySelector('#add-room-modal .close').addEventListener('click', function() {
        document.getElementById('add-room-modal').style.display = 'none';
    });
    
    document.getElementById('cancel-room-btn').addEventListener('click', function() {
        document.getElementById('add-room-modal').style.display = 'none';
    });
    
    // Ajouter une tâche dans la modale
    document.getElementById('add-task-btn').addEventListener('click', addTaskField);
    
    function addTaskField() {
        const tasksContainer = document.getElementById('tasks-container');
        const taskIndex = tasksContainer.children.length;
        
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        taskItem.innerHTML = `
            <button type="button" class="task-delete-btn">×</button>
            <div class="task-inputs" style="flex-grow: 1;">
                <div class="form-group">
                    <label for="task-name-${taskIndex}">Description</label>
                    <input type="text" id="task-name-${taskIndex}" class="task-name" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="task-category-${taskIndex}">Catégorie</label>
                        <select id="task-category-${taskIndex}" class="task-category">
                            <option value="demolition">Démolition</option>
                            <option value="plumbing">Plomberie</option>
                            <option value="electrical">Électricité</option>
                            <option value="walls">Murs et cloisons</option>
                            <option value="floors">Planchers</option>
                            <option value="ceilings">Plafonds</option>
                            <option value="painting">Peinture</option>
                            <option value="windows">Fenêtres</option>
                            <option value="doors">Portes</option>
                            <option value="kitchen">Cuisine</option>
                            <option value="bathroom">Salle de bain</option>
                            <option value="hvac">Chauffage/Climatisation</option>
                            <option value="other">Autre</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="task-cost-${taskIndex}">Coût estimé ($)</label>
                        <input type="number" id="task-cost-${taskIndex}" class="task-cost" min="0" step="0.01" required>
                    </div>
                    <div class="form-group">
                        <button type="button" class="btn-small btn-select-cost" data-index="${taskIndex}">
                            Sélectionner le coût
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        tasksContainer.appendChild(taskItem);
        
        // Ajouter l'événement de suppression
        taskItem.querySelector('.task-delete-btn').addEventListener('click', function() {
            tasksContainer.removeChild(taskItem);
        });
        
        // Ajouter l'événement pour sélectionner un coût à partir du catalogue
        taskItem.querySelector('.btn-select-cost').addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            openCostCatalogModal(index);
        });
    }
    
    // Fonction pour ouvrir la modale du catalogue de coûts
    function openCostCatalogModal(taskIndex) {
        // Charger les coûts de rénovation si ce n'est pas déjà fait
        if (renovationCostsData === null) {
            loadRenovationCosts().then(() => {
                showCostCatalogModal(taskIndex);
            });
        } else {
            showCostCatalogModal(taskIndex);
        }
    }
    
    // Fonction pour afficher la modale du catalogue de coûts
    function showCostCatalogModal(taskIndex) {
        // Vérifier si la modale existe déjà, sinon la créer
        let costCatalogModal = document.getElementById('cost-catalog-modal');
        if (!costCatalogModal) {
            costCatalogModal = document.createElement('div');
            costCatalogModal.id = 'cost-catalog-modal';
            costCatalogModal.className = 'modal';
            costCatalogModal.innerHTML = `
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h2>Catalogue des coûts de rénovation</h2>
                    <div class="modal-body">
                        <div class="filters">
                            <div class="form-group">
                                <label for="category-filter">Catégorie</label>
                                <select id="category-filter">
                                    <option value="all">Toutes les catégories</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="item-filter">Élément</label>
                                <select id="item-filter">
                                    <option value="all">Tous les éléments</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="search-filter">Recherche</label>
                                <input type="text" id="search-filter" placeholder="Rechercher...">
                            </div>
                        </div>
                        <div id="cost-catalog-results" class="catalog-results">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Description</th>
                                        <th>Unité</th>
                                        <th>Coût</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <!-- Les résultats seront ajoutés ici -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button id="close-catalog-btn" class="btn">Fermer</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(costCatalogModal);
            
            // Ajouter les événements pour fermer la modale
            costCatalogModal.querySelector('.close').addEventListener('click', function() {
                costCatalogModal.style.display = 'none';
            });
            
            document.getElementById('close-catalog-btn').addEventListener('click', function() {
                costCatalogModal.style.display = 'none';
            });
            
            // Ajouter les événements pour les filtres
            document.getElementById('category-filter').addEventListener('change', function() {
                updateItemFilter();
                filterCostCatalog();
            });
            
            document.getElementById('item-filter').addEventListener('change', function() {
                filterCostCatalog();
            });
            
            document.getElementById('search-filter').addEventListener('input', function() {
                filterCostCatalog();
            });
        }
        
        // Stocker l'index de la tâche dans la modale
        costCatalogModal.setAttribute('data-task-index', taskIndex);
        
        // Remplir les filtres
        populateCatalogFilters();
        
        // Filtrer le catalogue
        filterCostCatalog();
        
        // Afficher la modale
        costCatalogModal.style.display = 'block';
    }
    
    // Fonction pour remplir les filtres du catalogue
    function populateCatalogFilters() {
        if (!renovationCostsData) return;
        
        const categoryFilter = document.getElementById('category-filter');
        
        // Vider les options actuelles
        while (categoryFilter.options.length > 1) {
            categoryFilter.remove(1);
        }
        
        // Ajouter les options de catégorie
        renovationCostsData.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.name;
            option.textContent = category.name;
            categoryFilter.appendChild(option);
        });
        
        // Mettre à jour le filtre d'items
        updateItemFilter();
    }
    
    // Fonction pour mettre à jour le filtre d'items en fonction de la catégorie sélectionnée
    function updateItemFilter() {
        if (!renovationCostsData) return;
        
        const categoryFilter = document.getElementById('category-filter');
        const itemFilter = document.getElementById('item-filter');
        const selectedCategory = categoryFilter.value;
        
        // Vider les options actuelles
        while (itemFilter.options.length > 1) {
            itemFilter.remove(1);
        }
        
        // Si toutes les catégories sont sélectionnées, afficher tous les items
        if (selectedCategory === 'all') {
            renovationCostsData.categories.forEach(category => {
                category.items.forEach(item => {
                    const option = document.createElement('option');
                    option.value = category.name + '|' + item.name;
                    option.textContent = item.name;
                    itemFilter.appendChild(option);
                });
            });
        } else {
            // Sinon, afficher uniquement les items de la catégorie sélectionnée
            const category = renovationCostsData.categories.find(c => c.name === selectedCategory);
            if (category) {
                category.items.forEach(item => {
                    const option = document.createElement('option');
                    option.value = category.name + '|' + item.name;
                    option.textContent = item.name;
                    itemFilter.appendChild(option);
                });
            }
        }
    }
    
    // Fonction pour filtrer le catalogue de coûts
    function filterCostCatalog() {
        if (!renovationCostsData) return;
        
        const categoryFilter = document.getElementById('category-filter');
        const itemFilter = document.getElementById('item-filter');
        const searchFilter = document.getElementById('search-filter');
        const resultsContainer = document.getElementById('cost-catalog-results').querySelector('tbody');
        
        const selectedCategory = categoryFilter.value;
        const selectedItem = itemFilter.value;
        const searchTerm = searchFilter.value.toLowerCase();
        
        // Vider les résultats actuels
        resultsContainer.innerHTML = '';
        
        // Filtrer les coûts
        let filteredItems = [];
        
        renovationCostsData.categories.forEach(category => {
            // Vérifier si la catégorie est sélectionnée
            if (selectedCategory === 'all' || selectedCategory === category.name) {
                category.items.forEach(item => {
                    // Vérifier si l'item est sélectionné
                    if (selectedItem === 'all' || selectedItem === category.name + '|' + item.name) {
                        // Ajouter les sous-items qui correspondent à la recherche
                        item.subItems.forEach(subItem => {
                            if (searchTerm === '' || 
                                subItem.description.toLowerCase().includes(searchTerm) || 
                                item.name.toLowerCase().includes(searchTerm)) {
                                filteredItems.push({
                                    category: category.name,
                                    item: item.name,
                                    subItem: subItem
                                });
                            }
                        });
                    }
                });
            }
        });
        
        // Afficher les résultats
        filteredItems.forEach(filteredItem => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${filteredItem.subItem.description}</td>
                <td>${filteredItem.subItem.unit}</td>
                <td>${formatCurrency(filteredItem.subItem.cost)}</td>
                <td>
                    <button class="btn-small btn-select" data-cost="${filteredItem.subItem.cost}" data-description="${filteredItem.item}: ${filteredItem.subItem.description}">
                        Sélectionner
                    </button>
                </td>
            `;
            
            resultsContainer.appendChild(row);
        });
        
        // Ajouter les événements pour sélectionner un coût
        resultsContainer.querySelectorAll('.btn-select').forEach(button => {
            button.addEventListener('click', function() {
                const cost = parseFloat(this.getAttribute('data-cost'));
                const description = this.getAttribute('data-description');
                const taskIndex = document.getElementById('cost-catalog-modal').getAttribute('data-task-index');
                
                // Mettre à jour le champ de coût et de description
                document.getElementById(`task-cost-${taskIndex}`).value = cost;
                document.getElementById(`task-name-${taskIndex}`).value = description;
                
                // Fermer la modale
                document.getElementById('cost-catalog-modal').style.display = 'none';
            });
        });
    }
    
    // Soumettre le formulaire d'ajout de pièce
    document.getElementById('add-room-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Récupérer les données de la pièce
        const roomData = {
            id: Date.now().toString(), // Identifiant unique
            name: document.getElementById('room-name').value,
            floor: document.getElementById('room-floor').value,
            area: parseFloat(document.getElementById('room-area').value) || 0,
            notes: document.getElementById('room-notes').value,
            tasks: []
        };
        
        // Récupérer les tâches
        const taskItems = document.querySelectorAll('.task-item');
        taskItems.forEach(item => {
            const nameInput = item.querySelector('.task-name');
            const categorySelect = item.querySelector('.task-category');
            const costInput = item.querySelector('.task-cost');
            
            if (nameInput.value && costInput.value) {
                roomData.tasks.push({
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
                    name: nameInput.value,
                    category: categorySelect.value,
                    cost: parseFloat(costInput.value) || 0
                });
            }
        });
        
        // Ajouter la pièce au projet
        currentProject.rooms.push(roomData);
        saveProject();
        
        // Mettre à jour l'affichage des pièces
        renderRooms();
        
        // Fermer la modale
        document.getElementById('add-room-modal').style.display = 'none';
        
        // Notification à l'utilisateur
        showNotification('Pièce ajoutée avec succès!');
    });
    
    // Fonction pour afficher les pièces
    function renderRooms() {
        const roomsContainer = document.getElementById('rooms-container');
        roomsContainer.innerHTML = '';
        
        if (currentProject.rooms.length === 0) {
            roomsContainer.innerHTML = '<p class="no-data">Aucune pièce n\'a encore été ajoutée. Cliquez sur "+ Ajouter une pièce" pour commencer.</p>';
            return;
        }
        
        currentProject.rooms.forEach(room => {
            // Calculer le coût total de la pièce
            const totalCost = room.tasks.reduce((sum, task) => sum + task.cost, 0);
            
            const roomCard = document.createElement('div');
            roomCard.className = 'room-card';
            roomCard.dataset.id = room.id;
            
            roomCard.innerHTML = `
                <div class="room-header">
                    <h3 class="room-title">${room.name}</h3>
                    <div class="room-actions">
                        <button class="room-action-btn edit-room" title="Modifier">✏️</button>
                        <button class="room-action-btn delete-room" title="Supprimer">🗑️</button>
                    </div>
                </div>
                <div class="room-info">
                    <p>Étage: ${getFloorName(room.floor)}</p>
                    ${room.area ? `<p>Superficie: ${room.area} pi²</p>` : ''}
                </div>
                ${room.tasks.length > 0 ? `
                    <h4>Travaux à effectuer:</h4>
                    <ul class="room-tasks">
                        ${room.tasks.map(task => `
                            <li class="room-task">
                                <span class="task-name">${task.name}</span>
                                <span class="task-cost">${formatCurrency(task.cost)}</span>
                            </li>
                        `).join('')}
                    </ul>
                    <div class="room-total">Total: ${formatCurrency(totalCost)}</div>
                ` : '<p class="no-data">Aucune tâche définie</p>'}
            `;
            
            roomsContainer.appendChild(roomCard);
            
            // Ajouter les événements pour les boutons d'action
            roomCard.querySelector('.edit-room').addEventListener('click', function() {
                editRoom(room.id);
            });
            
            roomCard.querySelector('.delete-room').addEventListener('click', function() {
                deleteRoom(room.id);
            });
        });
        
        // Mettre à jour le sélecteur de pièces dans le formulaire d'ajout de dépense
        updateRoomSelect();
    }
    
    // Fonction pour obtenir le nom de l'étage
    function getFloorName(floorCode) {
        const floorNames = {
            'basement': 'Sous-sol',
            'ground': 'Rez-de-chaussée',
            'first': '1er étage',
            'second': '2ème étage',
            'other': 'Autre'
        };
        return floorNames[floorCode] || floorCode;
    }
    
    // Fonction pour supprimer une pièce
    function deleteRoom(roomId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette pièce?')) {
            currentProject.rooms = currentProject.rooms.filter(room => room.id !== roomId);
            saveProject();
            renderRooms();
            showNotification('Pièce supprimée avec succès!');
        }
    }
    
    // Fonction pour éditer une pièce (à compléter)
    function editRoom(roomId) {
        // Cette fonction sera implémentée dans une version future
        alert('La fonctionnalité d\'édition de pièce sera disponible dans une prochaine mise à jour.');
    }
    
    // ------------------- GESTION DES DÉPENSES ------------------- //
    
    // Ouvrir la modale d'ajout de dépense
    document.getElementById('add-expense-btn').addEventListener('click', function() {
        const modal = document.getElementById('add-expense-modal');
        modal.style.display = 'block';
        
        // Réinitialiser le formulaire
        document.getElementById('add-expense-form').reset();
        
        // Définir la date du jour
        document.getElementById('expense-date').valueAsDate = new Date();
    });
    
    // Fermer la modale d'ajout de dépense
    document.querySelector('#add-expense-modal .close').addEventListener('click', function() {
        document.getElementById('add-expense-modal').style.display = 'none';
    });
    
    document.getElementById('cancel-expense-btn').addEventListener('click', function() {
        document.getElementById('add-expense-modal').style.display = 'none';
    });
    
    // Mettre à jour le sélecteur de pièces
    function updateRoomSelect() {
        const roomSelect = document.getElementById('expense-room');
        roomSelect.innerHTML = '<option value="">-- Sélectionnez une pièce --</option>';
        
        currentProject.rooms.forEach(room => {
            const option = document.createElement('option');
            option.value = room.id;
            option.textContent = room.name;
            roomSelect.appendChild(option);
        });
    }
    
    // Soumettre le formulaire d'ajout de dépense
    document.getElementById('add-expense-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Récupérer les données de la dépense
        const expenseData = {
            id: Date.now().toString(), // Identifiant unique
            date: document.getElementById('expense-date').value,
            roomId: document.getElementById('expense-room').value,
            category: document.getElementById('expense-category').value,
            description: document.getElementById('expense-description').value,
            estimatedAmount: parseFloat(document.getElementById('expense-estimated').value) || 0,
            actualAmount: parseFloat(document.getElementById('expense-actual').value) || 0,
            notes: document.getElementById('expense-notes').value
        };
        
        // Ajouter la dépense au projet
        currentProject.expenses.push(expenseData);
        saveProject();
        
        // Mettre à jour l'affichage des dépenses
        renderExpenses();
        
        // Mettre à jour le tableau de bord et les graphiques
        updateDashboard();
        updateBudgetCharts();
        
        // Fermer la modale
        document.getElementById('add-expense-modal').style.display = 'none';
        
        // Notification à l'utilisateur
        showNotification('Dépense ajoutée avec succès!');
    });
    
    // Fonction pour afficher les dépenses
    function renderExpenses() {
        const expensesList = document.getElementById('expenses-list');
        expensesList.innerHTML = '';
        
        if (currentProject.expenses.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="8" class="no-data">Aucune dépense n\'a encore été enregistrée.</td>';
            expensesList.appendChild(row);
            return;
        }
        
        // Trier les dépenses par date (plus récentes en premier)
        const sortedExpenses = [...currentProject.expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        sortedExpenses.forEach(expense => {
            const room = currentProject.rooms.find(r => r.id === expense.roomId) || { name: 'N/A' };
            const variance = expense.actualAmount ? expense.actualAmount - expense.estimatedAmount : 0;
            const varianceClass = variance > 0 ? 'negative' : variance < 0 ? 'positive' : '';
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formatDate(expense.date)}</td>
                <td>${room.name}</td>
                <td>${getCategoryName(expense.category)}</td>
                <td>${expense.description}</td>
                <td>${formatCurrency(expense.estimatedAmount)}</td>
                <td>${expense.actualAmount ? formatCurrency(expense.actualAmount) : '-'}</td>
                <td class="${varianceClass}">${expense.actualAmount ? formatCurrency(variance) : '-'}</td>
                <td class="action-cell">
                    <button class="edit-expense" data-id="${expense.id}">✏️</button>
                    <button class="delete-expense" data-id="${expense.id}">🗑️</button>
                </td>
            `;
            
            expensesList.appendChild(row);
        });
        
        // Ajouter les événements pour les boutons d'action
        document.querySelectorAll('.edit-expense').forEach(button => {
            button.addEventListener('click', function() {
                const expenseId = this.getAttribute('data-id');
                editExpense(expenseId);
            });
        });
        
        document.querySelectorAll('.delete-expense').forEach(button => {
            button.addEventListener('click', function() {
                const expenseId = this.getAttribute('data-id');
                deleteExpense(expenseId);
            });
        });
    }
    
    // Fonction pour obtenir le nom de la catégorie
    function getCategoryName(categoryCode) {
        const categoryNames = {
            'demolition': 'Démolition',
            'plumbing': 'Plomberie',
            'electrical': 'Électricité',
            'walls': 'Murs et cloisons',
            'floors': 'Planchers',
            'ceilings': 'Plafonds',
            'painting': 'Peinture',
            'windows': 'Fenêtres',
            'doors': 'Portes',
            'kitchen': 'Cuisine',
            'bathroom': 'Salle de bain',
            'hvac': 'Chauffage/Climatisation',
            'other': 'Autre'
        };
        return categoryNames[categoryCode] || categoryCode;
    }
    
    // Fonction pour supprimer une dépense
    function deleteExpense(expenseId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette dépense?')) {
            currentProject.expenses = currentProject.expenses.filter(expense => expense.id !== expenseId);
            saveProject();
            renderExpenses();
            updateDashboard();
            updateBudgetCharts();
            showNotification('Dépense supprimée avec succès!');
        }
    }
    
    // Fonction pour éditer une dépense (à compléter)
    function editExpense(expenseId) {
        // Cette fonction sera implémentée dans une version future
        alert('La fonctionnalité d\'édition de dépense sera disponible dans une prochaine mise à jour.');
    }
    
    // Exporter les dépenses en CSV
    document.getElementById('export-expenses-btn').addEventListener('click', function() {
        const expenses = currentProject.expenses;
        
        if (expenses.length === 0) {
            alert('Aucune dépense à exporter.');
            return;
        }
        
        // Entêtes du CSV
        let csvContent = 'Date,Pièce,Catégorie,Description,Montant Estimé,Montant Réel,Écart,Notes\n';
        
        // Données
        expenses.forEach(expense => {
            const room = currentProject.rooms.find(r => r.id === expense.roomId) || { name: 'N/A' };
            const variance = expense.actualAmount ? expense.actualAmount - expense.estimatedAmount : 0;
            
            // Échapper les virgules dans les descriptions
            const description = `"${expense.description.replace(/"/g, '""')}"`;
            const notes = expense.notes ? `"${expense.notes.replace(/"/g, '""')}"` : '';
            
            csvContent += `${expense.date},${room.name},${getCategoryName(expense.category)},${description},${expense.estimatedAmount},${expense.actualAmount || ''},${variance || ''},${notes}\n`;
        });
        
        // Créer un lien de téléchargement
        const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `${currentProject.info.name || 'projet'}_depenses.csv`);
        document.body.appendChild(link);
        
        // Déclencher le téléchargement
        link.click();
        
        // Nettoyer
        document.body.removeChild(link);
    });
    
    // ------------------- TABLEAU DE BORD ET GRAPHIQUES ------------------- //
    
    // Mettre à jour le tableau de bord
    function updateDashboard() {
        const totalBudget = currentProject.info.totalBudget || 0;
        const totalEstimated = currentProject.expenses.reduce((sum, expense) => sum + expense.estimatedAmount, 0);
        const totalActual = currentProject.expenses.reduce((sum, expense) => sum + (expense.actualAmount || 0), 0);
        const variance = totalActual - totalEstimated;
        
        document.getElementById('total-budget-display').textContent = formatCurrency(totalBudget);
        document.getElementById('total-estimated-display').textContent = formatCurrency(totalEstimated);
        document.getElementById('total-actual-display').textContent = formatCurrency(totalActual);
        
        const varianceElement = document.getElementById('total-variance-display');
        varianceElement.textContent = formatCurrency(variance);
        varianceElement.className = 'stats-value' + (variance > 0 ? ' negative' : variance < 0 ? ' positive' : '');
    }
    
    // Graphiques du budget
    let budgetChart = null;
    
    function updateBudgetCharts() {
        // Graphique de répartition par catégorie
        const expensesData = aggregateExpensesByCategory();
        
        const ctx = document.getElementById('budget-chart').getContext('2d');
        
        // Détruire le graphique existant s'il existe
        if (budgetChart) {
            budgetChart.destroy();
        }
        
        // Créer un nouveau graphique
        budgetChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: expensesData.categories,
                datasets: [
                    {
                        label: 'Montant Estimé',
                        data: expensesData.estimated,
                        backgroundColor: 'rgba(52, 152, 219, 0.7)',
                        borderColor: 'rgba(52, 152, 219, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Montant Réel',
                        data: expensesData.actual,
                        backgroundColor: 'rgba(46, 204, 113, 0.7)',
                        borderColor: 'rgba(46, 204, 113, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Montant ($)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Catégorie'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += formatCurrency(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Fonction pour agréger les dépenses par catégorie
    function aggregateExpensesByCategory() {
        // Obtenir toutes les catégories uniques
        const categories = [...new Set(currentProject.expenses.map(expense => expense.category))];
        
        // Préparer les données
        const categoryNames = categories.map(getCategoryName);
        const estimatedData = categories.map(category => {
            return currentProject.expenses
                .filter(expense => expense.category === category)
                .reduce((sum, expense) => sum + expense.estimatedAmount, 0);
        });
        
        const actualData = categories.map(category => {
            return currentProject.expenses
                .filter(expense => expense.category === category)
                .reduce((sum, expense) => sum + (expense.actualAmount || 0), 0);
        });
        
        return {
            categories: categoryNames,
            estimated: estimatedData,
            actual: actualData
        };
    }
    
    // ------------------- ONGLET SYNTHÈSE ------------------- //
    
    // Graphiques de la synthèse
    let roomCostsChart = null;
    let categoryCostsChart = null;
    
    // Mettre à jour la synthèse
    function updateSummary() {
        // Informations générales
        const summaryInfo = document.getElementById('summary-info');
        const projectInfo = currentProject.info;
        
        summaryInfo.innerHTML = `
            <div class="summary-item">
                <div class="summary-label">Nom du projet</div>
                <div class="summary-value">${projectInfo.name || 'Non défini'}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Type de projet</div>
                <div class="summary-value">${getProjectTypeName(projectInfo.type)}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Date de début</div>
                <div class="summary-value">${projectInfo.startDate ? formatDate(projectInfo.startDate) : 'Non définie'}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Date de fin estimée</div>
                <div class="summary-value">${projectInfo.endDate ? formatDate(projectInfo.endDate) : 'Non définie'}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Durée estimée</div>
                <div class="summary-value">${calculateDuration(projectInfo.startDate, projectInfo.endDate)}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Nombre de pièces</div>
                <div class="summary-value">${currentProject.rooms.length}</div>
            </div>
        `;
        
        // Avancement du projet
        updateProgressBar();
        
        // Résumé budgétaire
        updateBudgetSummary();
        
        // Graphiques
        updateSummaryCharts();
    }
    
    // Obtenir le nom du type de projet
    function getProjectTypeName(typeCode) {
        const typeNames = {
            'flip': 'Flip immobilier',
            'rental': 'Rénovation locative',
            'personal': 'Résidence personnelle'
        };
        return typeNames[typeCode] || typeCode || 'Non défini';
    }
    
    // Calculer la durée entre deux dates
    function calculateDuration(startDate, endDate) {
        if (!startDate || !endDate) return 'Non calculable';
        
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 30) {
            return `${diffDays} jours`;
        } else if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            const remainingDays = diffDays % 30;
            return `${months} mois${remainingDays > 0 ? ` et ${remainingDays} jours` : ''}`;
        } else {
            const years = Math.floor(diffDays / 365);
            const remainingMonths = Math.floor((diffDays % 365) / 30);
            return `${years} an${years > 1 ? 's' : ''}${remainingMonths > 0 ? ` et ${remainingMonths} mois` : ''}`;
        }
    }
    
    // Mettre à jour la barre de progression
    function updateProgressBar() {
        const progressBar = document.getElementById('progress-value');
        const projectInfo = currentProject.info;
        
        if (!projectInfo.startDate || !projectInfo.endDate) {
            progressBar.style.width = '0%';
            progressBar.textContent = 'Dates non définies';
            return;
        }
        
        const start = new Date(projectInfo.startDate);
        const end = new Date(projectInfo.endDate);
        const today = new Date();
        
        if (today < start) {
            progressBar.style.width = '0%';
            progressBar.textContent = 'Projet non commencé';
        } else if (today > end) {
            progressBar.style.width = '100%';
            progressBar.textContent = 'Projet terminé';
        } else {
            const totalDuration = end - start;
            const elapsed = today - start;
            const percentage = Math.round((elapsed / totalDuration) * 100);
            
            progressBar.style.width = `${percentage}%`;
            progressBar.textContent = `${percentage}%`;
        }
    }
    
    // Mettre à jour le résumé budgétaire
    function updateBudgetSummary() {
        const totalBudget = currentProject.info.totalBudget || 0;
        const totalEstimated = currentProject.expenses.reduce((sum, expense) => sum + expense.estimatedAmount, 0);
        const totalActual = currentProject.expenses.reduce((sum, expense) => sum + (expense.actualAmount || 0), 0);
        const variance = totalActual - totalEstimated;
        const budgetRemaining = totalBudget - totalActual;
        
        const summaryGrid = document.querySelector('.summary-grid');
        summaryGrid.innerHTML = `
            <div class="summary-item">
                <div class="summary-label">Budget total</div>
                <div class="summary-value">${formatCurrency(totalBudget)}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Coûts estimés</div>
                <div class="summary-value">${formatCurrency(totalEstimated)}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Coûts réels</div>
                <div class="summary-value">${formatCurrency(totalActual)}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Écart estimation/réel</div>
                <div class="summary-value ${variance > 0 ? 'negative' : variance < 0 ? 'positive' : ''}">${formatCurrency(variance)}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Budget restant</div>
                <div class="summary-value ${budgetRemaining < 0 ? 'negative' : 'positive'}">${formatCurrency(budgetRemaining)}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Pourcentage du budget utilisé</div>
                <div class="summary-value">${totalBudget > 0 ? Math.round((totalActual / totalBudget) * 100) : 0}%</div>
            </div>
        `;
    }
    
    // Mettre à jour les graphiques de la synthèse
    function updateSummaryCharts() {
        // Graphique des coûts par pièce
        updateRoomCostsChart();
        
        // Graphique des coûts par catégorie
        updateCategoryCostsChart();
    }
    
    // Graphique des coûts par pièce
    function updateRoomCostsChart() {
        const ctx = document.getElementById('room-costs-chart').getContext('2d');
        
        // Agréger les données par pièce
        const roomData = aggregateExpensesByRoom();
        
        // Détruire le graphique existant s'il existe
        if (roomCostsChart) {
            roomCostsChart.destroy();
        }
        
        // Créer un nouveau graphique
        roomCostsChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: roomData.rooms,
                datasets: [
                    {
                        data: roomData.costs,
                        backgroundColor: [
                            'rgba(52, 152, 219, 0.7)',
                            'rgba(46, 204, 113, 0.7)',
                            'rgba(155, 89, 182, 0.7)',
                            'rgba(52, 73, 94, 0.7)',
                            'rgba(241, 196, 15, 0.7)',
                            'rgba(230, 126, 34, 0.7)',
                            'rgba(231, 76, 60, 0.7)',
                            'rgba(236, 240, 241, 0.7)',
                            'rgba(149, 165, 166, 0.7)'
                        ],
                        borderColor: [
                            'rgba(52, 152, 219, 1)',
                            'rgba(46, 204, 113, 1)',
                            'rgba(155, 89, 182, 1)',
                            'rgba(52, 73, 94, 1)',
                            'rgba(241, 196, 15, 1)',
                            'rgba(230, 126, 34, 1)',
                            'rgba(231, 76, 60, 1)',
                            'rgba(236, 240, 241, 1)',
                            'rgba(149, 165, 166, 1)'
                        ],
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed !== null) {
                                    label += formatCurrency(context.parsed);
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Fonction pour agréger les dépenses par pièce
    function aggregateExpensesByRoom() {
        const roomsData = {};
        
        currentProject.expenses.forEach(expense => {
            const room = currentProject.rooms.find(r => r.id === expense.roomId);
            if (room) {
                if (!roomsData[room.name]) {
                    roomsData[room.name] = 0;
                }
                roomsData[room.name] += expense.actualAmount || expense.estimatedAmount;
            }
        });
        
        return {
            rooms: Object.keys(roomsData),
            costs: Object.values(roomsData)
        };
    }
    
    // Graphique des coûts par catégorie
    function updateCategoryCostsChart() {
        const ctx = document.getElementById('category-costs-chart').getContext('2d');
        
        // Agréger les données par catégorie
        const categoryData = aggregateExpensesByCategoryForChart();
        
        // Détruire le graphique existant s'il existe
        if (categoryCostsChart) {
            categoryCostsChart.destroy();
        }
        
        // Créer un nouveau graphique
        categoryCostsChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: categoryData.categories,
                datasets: [
                    {
                        data: categoryData.costs,
                        backgroundColor: [
                            'rgba(52, 152, 219, 0.7)',
                            'rgba(46, 204, 113, 0.7)',
                            'rgba(155, 89, 182, 0.7)',
                            'rgba(52, 73, 94, 0.7)',
                            'rgba(241, 196, 15, 0.7)',
                            'rgba(230, 126, 34, 0.7)',
                            'rgba(231, 76, 60, 0.7)',
                            'rgba(236, 240, 241, 0.7)',
                            'rgba(149, 165, 166, 0.7)',
                            'rgba(26, 188, 156, 0.7)',
                            'rgba(41, 128, 185, 0.7)',
                            'rgba(142, 68, 173, 0.7)',
                            'rgba(44, 62, 80, 0.7)'
                        ],
                        borderColor: [
                            'rgba(52, 152, 219, 1)',
                            'rgba(46, 204, 113, 1)',
                            'rgba(155, 89, 182, 1)',
                            'rgba(52, 73, 94, 1)',
                            'rgba(241, 196, 15, 1)',
                            'rgba(230, 126, 34, 1)',
                            'rgba(231, 76, 60, 1)',
                            'rgba(236, 240, 241, 1)',
                            'rgba(149, 165, 166, 1)',
                            'rgba(26, 188, 156, 1)',
                            'rgba(41, 128, 185, 1)',
                            'rgba(142, 68, 173, 1)',
                            'rgba(44, 62, 80, 1)'
                        ],
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed !== null) {
                                    label += formatCurrency(context.parsed);
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Fonction pour agréger les dépenses par catégorie pour le graphique
    function aggregateExpensesByCategoryForChart() {
        const categoriesData = {};
        
        currentProject.expenses.forEach(expense => {
            const categoryName = getCategoryName(expense.category);
            if (!categoriesData[categoryName]) {
                categoriesData[categoryName] = 0;
            }
            categoriesData[categoryName] += expense.actualAmount || expense.estimatedAmount;
        });
        
        return {
            categories: Object.keys(categoriesData),
            costs: Object.values(categoriesData)
        };
    }
    
    // Générer un rapport PDF
    document.getElementById('generate-report-btn').addEventListener('click', function() {
        alert('La fonctionnalité de génération de rapport PDF sera disponible dans une prochaine mise à jour.');
    });
    
    // ------------------- UTILITAIRES ------------------- //
    
    // Fonction pour sauvegarder le projet dans le stockage local
    function saveProject() {
        const projects = JSON.parse(localStorage.getItem('renovationProjects') || '{}');
        const projectId = currentProject.info.name || 'default';
        projects[projectId] = currentProject;
        localStorage.setItem('renovationProjects', JSON.stringify(projects));
    }
    
    // Fonction pour charger un projet du stockage local
    function loadProject(projectId) {
        const projects = JSON.parse(localStorage.getItem('renovationProjects') || '{}');
        return projects[projectId] || { info: {}, rooms: [], expenses: [] };
    }
    
    // Fonction pour formater les montants en dollars
    function formatCurrency(amount) {
        return new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' }).format(amount);
    }
    
    // Fonction pour formater les dates
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-CA', options);
    }
    
    // Fonction pour afficher une notification
    function showNotification(message, type = 'success') {
        // Créer l'élément de notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Ajouter la notification au corps du document
        document.body.appendChild(notification);
        
        // Afficher la notification avec un effet de fondu
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Supprimer la notification après 3 secondes
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Ajouter du CSS pour les notifications et les nouvelles fonctionnalités
    const additionalStyles = document.createElement('style');
    additionalStyles.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #2ecc71;
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.3s, transform 0.3s;
        }
        
        .notification.show {
            opacity: 1;
            transform: translateY(0);
        }
        
        .notification.error {
            background-color: #e74c3c;
        }
        
        .positive {
            color: #2ecc71;
        }
        
        .negative {
            color: #e74c3c;
        }
        
        /* Styles pour l'onglet de coûts de rénovation */
        .costs-container {
            margin-top: 20px;
        }
        
        .costs-category {
            margin-bottom: 15px;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            overflow: hidden;
        }
        
        .costs-category-header {
            background-color: #f5f5f5;
            padding: 10px 15px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .costs-category-header:hover {
            background-color: #e8e8e8;
        }
        
        .costs-category-content {
            padding: 0 15px;
            display: none;
        }
        
        .costs-item {
            margin: 15px 0;
        }
        
        .costs-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        
        .costs-table th, .costs-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        
        .costs-table th {
            background-color: #f5f5f5;
            font-weight: 500;
        }
        
        .costs-contingency {
            margin-top: 20px;
            padding: 15px;
            background-color: #f8f8f8;
            border-radius: 4px;
            border-left: 3px solid #3498db;
        }
        
        .disclaimer {
            color: #e74c3c;
            font-style: italic;
        }
        
        .last-updated {
            color: #7f8c8d;
            font-size: 0.9em;
        }
        
        /* Styles pour la modale de catalogue des coûts */
        .catalog-results {
            max-height: 400px;
            overflow-y: auto;
            margin-top: 15px;
        }
        
        .catalog-results table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .catalog-results th, .catalog-results td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        
        .catalog-results th {
            background-color: #f5f5f5;
            position: sticky;
            top: 0;
        }
        
        .filters {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 15px;
        }
        
        .filters .form-group {
            flex: 1;
            min-width: 200px;
        }
        
        .btn-small {
            padding: 5px 10px;
            font-size: 0.8em;
            background-color: #3498db;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }
        
        .btn-small:hover {
            background-color: #2980b9;
        }
        
        .btn-select-cost {
            margin-top: 22px;
        }
    `;
    document.head.appendChild(additionalStyles);
    
    // ------------------- INITIALISATION ------------------- //
    
    // Initialiser l'application
    function initApp() {
        // Ajouter l'onglet des coûts de rénovation
        addMaterialCostsTab();
        
        // Simuler le chargement d'un projet (dans une version réelle, cela proviendrait d'une base de données)
        currentProject = loadProject('default');
        
        // Remplir le formulaire d'information du projet
        if (currentProject.info.name) {
            document.getElementById('project-name').value = currentProject.info.name;
            document.getElementById('project-address').value = currentProject.info.address || '';
            document.getElementById('project-type').value = currentProject.info.type || 'flip';
            document.getElementById('start-date').value = currentProject.info.startDate || '';
            document.getElementById('end-date').value = currentProject.info.endDate || '';
            document.getElementById('total-budget').value = currentProject.info.totalBudget || '';
            document.getElementById('project-notes').value = currentProject.info.notes || '';
            
            // Mettre à jour l'affichage du budget total
            document.getElementById('total-budget-display').textContent = formatCurrency(currentProject.info.totalBudget || 0);
        }
        
        // Afficher les pièces et les dépenses si elles existent
        renderRooms();
        renderExpenses();
        updateDashboard();
    }
    
    // Démarrer l'application
    initApp();
});