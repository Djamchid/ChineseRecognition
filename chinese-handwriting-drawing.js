/**
 * drawing.js - Gestion du dessin sur le canvas
 */

class DrawingCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;
        
        this.init();
    }
    
    init() {
        // Initialisation du canvas
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Configuration du contexte
        this.ctx.lineWidth = 8;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.strokeStyle = 'black';
        
        // Ajout des écouteurs d'événements
        this.addEventListeners();
    }
    
    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        // Réinitialiser les paramètres du contexte après redimensionnement
        this.ctx.lineWidth = 8;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.strokeStyle = 'black';
    }
    
    addEventListeners() {
        // Événements souris
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());
        
        // Événements tactiles
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startDrawing(e);
        });
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.draw(e);
        });
        this.canvas.addEventListener('touchend', () => this.stopDrawing());
    }
    
    startDrawing(e) {
        this.isDrawing = true;
        const pos = this.getPosition(e);
        [this.lastX, this.lastY] = [pos.x, pos.y];
    }
    
    draw(e) {
        if (!this.isDrawing) return;
        
        const pos = this.getPosition(e);
        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(pos.x, pos.y);
        this.ctx.stroke();
        [this.lastX, this.lastY] = [pos.x, pos.y];
    }
    
    stopDrawing() {
        this.isDrawing = false;
    }
    
    getPosition(e) {
        let x, y;
        if (e.type.includes('touch')) {
            x = e.touches[0].clientX - this.canvas.getBoundingClientRect().left;
            y = e.touches[0].clientY - this.canvas.getBoundingClientRect().top;
        } else {
            x = e.offsetX;
            y = e.offsetY;
        }
        return { x, y };
    }
    
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    getImageData() {
        // Récupérer les données de l'image pour le traitement
        return this.canvas.toDataURL('image/png');
    }
    
    // Obtenir une image normalisée pour le modèle ML
    async getImageDataForModel() {
        return new Promise((resolve) => {
            const imageData = this.getImageData();
            const img = new Image();
            img.onload = () => {
                // Créer un canvas temporaire pour normaliser l'image
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = 64;  // Taille attendue par le modèle
                tempCanvas.height = 64;
                const tempCtx = tempCanvas.getContext('2d');
                
                // Trouver les limites du dessin pour le centrer
                const bounds = this.findDrawingBounds();
                if (bounds) {
                    const { minX, minY, maxX, maxY } = bounds;
                    const width = maxX - minX;
                    const height = maxY - minY;
                    const size = Math.max(width, height);
                    
                    // Dessiner le caractère centré et mis à l'échelle sur le canvas temporaire
                    tempCtx.fillStyle = 'white';
                    tempCtx.fillRect(0, 0, 64, 64);
                    tempCtx.fillStyle = 'black';
                    
                    // Calculer le facteur d'échelle et la position
                    const scale = Math.min(56 / size, 56 / size); // Marge de 4px
                    const offsetX = (64 - width * scale) / 2;
                    const offsetY = (64 - height * scale) / 2;
                    
                    tempCtx.drawImage(
                        this.canvas,
                        minX, minY, width, height,
                        offsetX, offsetY, width * scale, height * scale
                    );
                    
                    resolve(tempCanvas.toDataURL('image/png'));
                } else {
                    // Si pas de dessin, retourner une image vide
                    tempCtx.fillStyle = 'white';
                    tempCtx.fillRect(0, 0, 64, 64);
                    resolve(tempCanvas.toDataURL('image/png'));
                }
            };
            img.src = imageData;
        });
    }
    
    findDrawingBounds() {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        let minX = this.canvas.width;
        let minY = this.canvas.height;
        let maxX = 0;
        let maxY = 0;
        let found = false;
        
        // Parcourir les pixels pour trouver les limites du dessin
        for (let y = 0; y < this.canvas.height; y++) {
            for (let x = 0; x < this.canvas.width; x++) {
                const idx = (y * this.canvas.width + x) * 4;
                // Si le pixel n'est pas blanc (dessin présent)
                if (data[idx + 3] > 0) {  // Vérifier l'alpha
                    minX = Math.min(minX, x);
                    minY = Math.min(minY, y);
                    maxX = Math.max(maxX, x);
                    maxY = Math.max(maxY, y);
                    found = true;
                }
            }
        }
        
        return found ? { minX, minY, maxX, maxY } : null;
    }
}
