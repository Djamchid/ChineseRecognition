/**
 * model.js - Gestion du modèle de reconnaissance de caractères chinois
 * Utilise TensorFlow.js pour charger et exécuter un modèle pré-entraîné
 */

class ChineseCharacterRecognizer {
    constructor() {
        this.model = null;
        this.isModelLoaded = false;
        this.modelLoadingPromise = null;
        this.statusCallback = null;
        this.modelUrl = 'https://storage.googleapis.com/tfjs-models/tfjs/chinese_handwriting/model.json';
        // URL fictive, à remplacer par l'URL réelle d'un modèle pré-entraîné
    }
    
    // Définir une fonction de callback pour le statut
    setStatusCallback(callback) {
        this.statusCallback = callback;
    }
    
    // Mettre à jour le statut
    updateStatus(status) {
        if (this.statusCallback) {
            this.statusCallback(status);
        }
    }
    
    // Charger le modèle
    async loadModel() {
        if (this.isModelLoaded) {
            return this.model;
        }
        
        if (this.modelLoadingPromise) {
            return this.modelLoadingPromise;
        }
        
        this.updateStatus('Chargement du modèle...');
        
        try {
            this.modelLoadingPromise = tf.loadLayersModel(this.modelUrl);
            this.model = await this.modelLoadingPromise;
            this.isModelLoaded = true;
            this.updateStatus('Modèle chargé');
            return this.model;
        } catch (error) {
            this.updateStatus('Erreur de chargement du modèle: ' + error.message);
            console.error('Erreur de chargement du modèle:', error);
            
            // Pour les besoins de la démo, nous allons créer un modèle factice si le chargement échoue
            this.updateStatus('Utilisation du modèle de démonstration');
            this.isModelLoaded = true;
            return this.createDummyModel();
        }
    }
    
    // Créer un modèle factice pour la démonstration
    createDummyModel() {
        return {
            predict: (tensor) => {
                // Retourne un tenseur factice avec des prédictions simulées
                return {
                    data: () => Promise.resolve(new Float32Array(3755).fill(0.01))
                };
            }
        };
    }
    
    // Prétraiter l'image pour le modèle
    async preprocessImage(imageDataUrl) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                // Créer un tensor à partir de l'image
                const tensor = tf.tidy(() => {
                    // Convertir l'image en tensor
                    const imageTensor = tf.browser.fromPixels(img, 1); // Grayscale (1 canal)
                    
                    // Redimensionner à la taille attendue par le modèle (généralement 64x64)
                    const resized = tf.image.resizeBilinear(imageTensor, [64, 64]);
                    
                    // Normaliser les valeurs des pixels entre 0 et 1
                    const normalized = resized.toFloat().div(tf.scalar(255));
                    
                    // Inverser les couleurs si nécessaire (fond blanc, traits noirs -> fond noir, traits blancs)
                    const inverted = tf.scalar(1).sub(normalized);
                    
                    // Ajouter la dimension du batch
                    return inverted.expandDims(0);
                });
                
                resolve(tensor);
            };
            img.src = imageDataUrl;
        });
    }
    
    // Prédire le caractère à partir d'une image
    async recognizeCharacter(imageDataUrl) {
        try {
            // S'assurer que le modèle est chargé
            const model = await this.loadModel();
            
            // Prétraiter l'image
            this.updateStatus('Analyse de l\'image...');
            const tensor = await this.preprocessImage(imageDataUrl);
            
            // Faire la prédiction
            let predictions;
            
            if (this.isRealModelLoaded()) {
                // Si nous avons un vrai modèle
                const output = await model.predict(tensor);
                predictions = await output.data();
                output.dispose(); // Libérer la mémoire
            } else {
                // Si nous utilisons le modèle factice, générer des prédictions simulées
                predictions = this.generateDummyPredictions();
            }
            
            // Libérer le tenseur d'entrée
            tensor.dispose();
            
            // Obtenir les meilleurs résultats
            const results = this.getTopResults(predictions, 5);
            this.updateStatus('Prêt');
            
            return results;
        } catch (error) {
            this.updateStatus('Erreur de reconnaissance: ' + error.message);
            console.error('Erreur de reconnaissance:', error);
            return this.generateDummyResults();
        }
    }
    
    // Vérifier si nous utilisons un vrai modèle ou le modèle factice
    isRealModelLoaded() {
        return this.isModelLoaded && typeof this.model.predict === 'function' && !this.model.isDummy;
    }
    
    // Générer des prédictions simulées pour la démonstration
    generateDummyPredictions() {
        // Créer un tableau de prédictions aléatoires
        const predictions = new Float32Array(3755); // Supposons 3755 caractères chinois
        
        // Initialiser avec de petites valeurs
        for (let i = 0; i < predictions.length; i++) {
            predictions[i] = Math.random() * 0.01;
        }
        
        // Mettre quelques valeurs plus élevées pour les premiers caractères communs
        const commonIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        commonIndices.forEach(index => {
            predictions[index] = 0.1 + Math.random() * 0.9; // Valeurs entre 0.1 et 1.0
        });
        
        return predictions;
    }
    
    // Obtenir les N meilleurs résultats
    getTopResults(predictions, n = 5) {
        // Créer un tableau d'indices et de valeurs
        const indices = Array.from(predictions).map((value, index) => ({ index, value }));
        
        // Trier par valeur de confiance décroissante
        indices.sort((a, b) => b.value - a.value);
        
        // Prendre les N premiers résultats
        const topIndices = indices.slice(0, n);
        
        // Convertir les indices en caractères chinois avec pinyin
        return topIndices.map(({ index, value }) => {
            const charInfo = this.getCharacterInfo(index);
            return {
                character: charInfo.character,
                pinyin: charInfo.pinyin,
                confidence: value
            };
        });
    }
    
    // Générer des résultats simulés pour la démonstration
    generateDummyResults() {
        return [
            { character: '人', pinyin: 'rén', confidence: 0.92 },
            { character: '大', pinyin: 'dà', confidence: 0.84 },
            { character: '木', pinyin: 'mù', confidence: 0.78 },
            { character: '火', pinyin: 'huǒ', confidence: 0.71 },
            { character: '水', pinyin: 'shuǐ', confidence: 0.65 }
        ];
    }
    
    // Obtenir les informations d'un caractère chinois à partir de son indice
    getCharacterInfo(index) {
        // Dans une vraie application, cela proviendrait d'une base de données de caractères
        // Pour cette démo, nous utilisons un ensemble prédéfini de caractères communs
        
        const commonCharacters = [
            { character: '人', pinyin: 'rén', meaning: 'personne' },
            { character: '大', pinyin: 'dà', meaning: 'grand' },
            { character: '小', pinyin: 'xiǎo', meaning: 'petit' },
            { character: '山', pinyin: 'shān', meaning: 'montagne' },
            { character: '水', pinyin: 'shuǐ', meaning: 'eau' },
            { character: '木', pinyin: 'mù', meaning: 'arbre' },
            { character: '火', pinyin: 'huǒ', meaning: 'feu' },
            { character: '土', pinyin: 'tǔ', meaning: 'terre' },
            { character: '日', pinyin: 'rì', meaning: 'soleil' },
            { character: '月', pinyin: 'yuè', meaning: 'lune' }
        ];
        
        // Si l'indice est dans la plage des caractères communs, renvoyer ce caractère
        if (index < commonCharacters.length) {
            return commonCharacters[index];
        }
        
        // Sinon, générer un caractère aléatoire (pour la démo)
        const randomIndex = Math.floor(Math.random() * commonCharacters.length);
        return commonCharacters[randomIndex];
    }
}