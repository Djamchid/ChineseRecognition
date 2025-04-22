/**
 * app.js - Application principale pour la reconnaissance de caractères chinois manuscrits
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les éléments du DOM
    const recognizeBtn = document.getElementById('recognizeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const characterResults = document.getElementById('characterResults');
    const historyList = document.getElementById('historyList');
    const statusText = document.getElementById('statusText');
    const loader = document.getElementById('loader');
    
    // Initialiser le canvas de dessin
    const drawingCanvas = new DrawingCanvas('drawingCanvas');
    
    // Initialiser la base de données de caractères chinois
    const charactersDB = new ChineseCharactersDB();
    
    // Initialiser le modèle de reconnaissance
    const recognizer = new ChineseCharacterRecognizer();
    
    // Historique des caractères reconnus
    const recognizedHistory = new Set();
    
    // Définir la fonction de callback pour le statut
    recognizer.setStatusCallback(updateStatus);
    
    // Fonction pour mettre à jour le statut
    function updateStatus(status) {
        statusText.textContent = status;
        if (status === 'Chargement du modèle...' || status === 'Analyse de l\'image...') {
            loader.style.display = 'inline-block';
            recognizeBtn.disabled = true;
        } else {
            loader.style.display = 'none';
            recognizeBtn.disabled = false;
        }
    }
    
    // Charger le modèle au démarrage
    recognizer.loadModel().catch(error => {
        console.error('Erreur lors du chargement initial du modèle:', error);
    });
    
    // Fonction pour reconnaître le caractère
    async function recognizeCharacter() {
        // Obtenir l'image normalisée du canvas
        const imageData = await drawingCanvas.getImageDataForModel();
        
        // Reconnaître le caractère
        const results = await recognizer.recognizeCharacter(imageData);
        
        // Afficher les résultats
        displayResults(results);
        
        // Ajouter à l'historique
        if (results.length > 0) {
            addToHistory(results[0].character);
        }
    }
    
    // Fonction pour afficher les résultats
    function displayResults(characters) {
        characterResults.innerHTML = '';
        
        if (characters.length === 0) {
            const noResults = document.createElement('p');
            noResults.textContent = 'Aucun caractère reconnu. Essayez de dessiner plus clairement.';
            characterResults.appendChild(noResults);
            return;
        }
        
        characters.forEach(char => {
            const charItem = document.createElement('div');
            charItem.className = 'character-item';
            
            const character = document.createElement('div');
            character.className = 'character';
            character.textContent = char.character;
            
            const pinyin = document.createElement('div');
            pinyin.className = 'pinyin';
            pinyin.textContent = char.pinyin;
            
            const confidence = document.createElement('div');
            confidence.className = 'confidence';
            confidence.textContent = `${Math.round(char.confidence * 100)}%`;
            
            charItem.appendChild(character);
            charItem.appendChild(pinyin);
            charItem.appendChild(confidence);
            
            // Ajouter un événement de clic pour afficher plus de détails
            charItem.addEventListener('click', () => {
                showCharacterDetails(char.character);
            });
            
            characterResults.appendChild(charItem);
        });
    }
    
    // Fonction pour ajouter à l'historique
    function addToHistory(character) {
        if (!recognizedHistory.has(character)) {
            recognizedHistory.add(character);
            
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.textContent = character;
            
            // Permettre de cliquer sur un caractère de l'historique pour plus d'informations
            historyItem.addEventListener('click', () => {
                showCharacterDetails(character);
            });
            
            historyList.appendChild(historyItem);
        }
    }
    
    // Fonction pour afficher les détails d'un caractère
    function showCharacterDetails(character) {
        // Obtenir les détails du caractère depuis la base de données
        const details = charactersDB.getCharacterDetails(character);
        
        if (!details) {
            alert(`Désolé, aucune information détaillée n'est disponible pour le caractère ${character}.`);
            return;
        }
        
        // Créer la modal de détails si elle n'existe pas déjà
        let detailsModal = document.getElementById('charDetailsModal');
        let overlay = document.getElementById('overlay');
        
        if (!detailsModal) {
            // Créer l'overlay
            overlay = document.createElement('div');
            overlay.id = 'overlay';
            overlay.className = 'overlay';
            document.body.appendChild(overlay);
            
            // Créer la modal
            detailsModal = document.createElement('div');
            detailsModal.id = 'charDetailsModal';
            detailsModal.className = 'char-details';
            
            document.body.appendChild(detailsModal);
        }
        
        // Remplir la modal avec les détails
        detailsModal.innerHTML = `
            <div class="char-details-header">
                <h2>Détails du caractère</h2>
                <span class="char-details-close">&times;</span>
            </div>
            <div class="char-big">${details.character}</div>
            <div class="char-info">
                <span class="char-info-label">Pinyin:</span> ${details.pinyin}
            </div>
            <div class="char-info">
                <span class="char-info-label">Signification:</span> ${details.meaning}
            </div>
            <div class="char-info">
                <span class="char-info-label">Nombre de traits:</span> ${details.strokes}
            </div>
            <div class="char-info">
                <span class="char-info-label">Étymologie:</span> ${details.etymology}
            </div>
            <div class="char-info">
                <span class="char-info-label">Prononciation:</span> ${details.pronunciationTips}
            </div>
            <div class="char-info">
                <span class="char-info-label">Mnémonique:</span> ${details.mnemonics}
            </div>
            <div class="char-info">
                <span class="char-info-label">Exemples:</span> ${details.examples ? details.examples.join(', ') : 'Aucun exemple disponible'}
            </div>
        `;
        
        // Afficher la modal et l'overlay
        detailsModal.style.display = 'block';
        overlay.style.display = 'block';
        
        // Ajouter un événement de clic pour fermer la modal
        const closeBtn = detailsModal.querySelector('.char-details-close');
        closeBtn.addEventListener('click', () => {
            detailsModal.style.display = 'none';
            overlay.style.display = 'none';
        });
        
        // Fermer la modal en cliquant sur l'overlay
        overlay.addEventListener('click', () => {
            detailsModal.style.display = 'none';
            overlay.style.display = 'none';
        });
    }
    
    // Ajouter des événements aux boutons
    recognizeBtn.addEventListener('click', recognizeCharacter);
    clearBtn.addEventListener('click', () => {
        drawingCanvas.clear();
        characterResults.innerHTML = '<p>Les caractères reconnus apparaîtront ici</p>';
    });
    
    // Ajouter un raccourci clavier pour la reconnaissance (Entrée) et l'effacement (Échap)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !recognizeBtn.disabled) {
            recognizeCharacter();
        } else if (e.key === 'Escape') {
            drawingCanvas.clear();
            characterResults.innerHTML = '<p>Les caractères reconnus apparaîtront ici</p>';
        }
    });
    
    // Fonction pour précharger des caractères communs dans l'historique
    function preloadCommonCharacters() {
        const commonChars = charactersDB.getMostCommonCharacters(5);
        commonChars.forEach(char => {
            addToHistory(char.character);
        });
    }
    
    // Précharger quelques caractères communs dans l'historique
    preloadCommonCharacters();
    
    // Détecter si l'appareil est tactile pour adapter l'interface
    function isTouchDevice() {
        return (('ontouchstart' in window) || 
                (navigator.maxTouchPoints > 0) || 
                (navigator.msMaxTouchPoints > 0));
    }
    
    // Ajuster l'interface pour les appareils tactiles
    if (isTouchDevice()) {
        const canvas = document.getElementById('drawingCanvas');
        canvas.classList.add('touch-canvas');
        
        // Augmenter la taille du trait pour les appareils tactiles
        const drawingCtx = canvas.getContext('2d');
        drawingCtx.lineWidth = 12;
    }
    
    // Fonction pour exporter les caractères reconnus
    function exportRecognizedCharacters() {
        if (recognizedHistory.size === 0) {
            alert('Aucun caractère à exporter. Veuillez d\'abord reconnaître quelques caractères.');
            return;
        }
        
        const charactersArray = Array.from(recognizedHistory);
        const charactersText = charactersArray.join('\n');
        
        // Créer un blob et un lien de téléchargement
        const blob = new Blob([charactersText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'caracteres_reconnus.txt';
        document.body.appendChild(a);
        a.click();
        
        // Nettoyer
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    }
    
    // Ajouter un bouton d'exportation (optionnel - à décommenter si nécessaire)
    /*
    const exportBtn = document.createElement('button');
    exportBtn.textContent = 'Exporter les caractères';
    exportBtn.id = 'exportBtn';
    exportBtn.addEventListener('click', exportRecognizedCharacters);
    document.querySelector('.button-group').appendChild(exportBtn);
    */
});
