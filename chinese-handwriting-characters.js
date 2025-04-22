/**
 * chinese_characters.js - Base de données de caractères chinois
 * Contient des informations sur les caractères chinois les plus courants
 */

class ChineseCharactersDB {
    constructor() {
        // Initialiser la base de données des caractères
        this.characters = this.loadCharactersData();
        this.charactersMap = this.createCharactersMap();
    }
    
    // Créer une map pour un accès rapide par caractère
    createCharactersMap() {
        const map = new Map();
        this.characters.forEach(char => {
            map.set(char.character, char);
        });
        return map;
    }
    
    // Charger les données des caractères
    loadCharactersData() {
        return [
            // Les 100 caractères chinois les plus fréquents avec pinyin et signification
            { 
                character: '的', 
                pinyin: 'de', 
                meaning: 'particule possessive', 
                strokes: 8,
                examples: ['我的书', '他的朋友'],
                radicals: '白' 
            },
            { 
                character: '一', 
                pinyin: 'yī', 
                meaning: 'un', 
                strokes: 1,
                examples: ['一个人', '第一'],
                radicals: '一' 
            },
            { 
                character: '是', 
                pinyin: 'shì', 
                meaning: 'être', 
                strokes: 9,
                examples: ['我是学生', '这是书'],
                radicals: '日' 
            },
            { 
                character: '不', 
                pinyin: 'bù', 
                meaning: 'non', 
                strokes: 4,
                examples: ['不好', '不是'],
                radicals: '一' 
            },
            { 
                character: '了', 
                pinyin: 'le', 
                meaning: 'particule d\'aspect accompli', 
                strokes: 2,
                examples: ['吃了饭', '看了书'],
                radicals: '了' 
            },
            { 
                character: '在', 
                pinyin: 'zài', 
                meaning: 'à, dans, en train de', 
                strokes: 6,
                examples: ['在家', '在学习'],
                radicals: '土' 
            },
            { 
                character: '人', 
                pinyin: 'rén', 
                meaning: 'personne', 
                strokes: 2,
                examples: ['中国人', '好人'],
                radicals: '人' 
            },
            { 
                character: '我', 
                pinyin: 'wǒ', 
                meaning: 'je, moi', 
                strokes: 7,
                examples: ['我是', '我的'],
                radicals: '戈' 
            },
            { 
                character: '有', 
                pinyin: 'yǒu', 
                meaning: 'avoir', 
                strokes: 6,
                examples: ['有钱', '有时间'],
                radicals: '月' 
            },
            { 
                character: '他', 
                pinyin: 'tā', 
                meaning: 'il, lui', 
                strokes: 5,
                examples: ['他是', '他的'],
                radicals: '人' 
            },
            // Caractères élémentaires pour les débutants
            { 
                character: '大', 
                pinyin: 'dà', 
                meaning: 'grand', 
                strokes: 3,
                examples: ['大学', '大人'],
                radicals: '大' 
            },
            { 
                character: '小', 
                pinyin: 'xiǎo', 
                meaning: 'petit', 
                strokes: 3,
                examples: ['小学', '小人'],
                radicals: '小' 
            },
            { 
                character: '中', 
                pinyin: 'zhōng', 
                meaning: 'milieu, centre', 
                strokes: 4,
                examples: ['中国', '中间'],
                radicals: '丨' 
            },
            { 
                character: '上', 
                pinyin: 'shàng', 
                meaning: 'dessus, monter', 
                strokes: 3,
                examples: ['上面', '上学'],
                radicals: '一' 
            },
            { 
                character: '下', 
                pinyin: 'xià', 
                meaning: 'dessous, descendre', 
                strokes: 3,
                examples: ['下面', '下午'],
                radicals: '一' 
            },
            // Éléments naturels
            { 
                character: '水', 
                pinyin: 'shuǐ', 
                meaning: 'eau', 
                strokes: 4,
                examples: ['水果', '喝水'],
                radicals: '水' 
            },
            { 
                character: '火', 
                pinyin: 'huǒ', 
                meaning: 'feu', 
                strokes: 4,
                examples: ['火车', '生火'],
                radicals: '火' 
            },
            { 
                character: '木', 
                pinyin: 'mù', 
                meaning: 'bois, arbre', 
                strokes: 4,
                examples: ['木头', '树木'],
                radicals: '木' 
            },
            { 
                character: '土', 
                pinyin: 'tǔ', 
                meaning: 'terre, sol', 
                strokes: 3,
                examples: ['土地', '泥土'],
                radicals: '土' 
            },
            { 
                character: '金', 
                pinyin: 'jīn', 
                meaning: 'or, métal', 
                strokes: 8,
                examples: ['金子', '金属'],
                radicals: '金' 
            },
            // Corps humain
            { 
                character: '口', 
                pinyin: 'kǒu', 
                meaning: 'bouche', 
                strokes: 3,
                examples: ['口水', '入口'],
                radicals: '口' 
            },
            { 
                character: '手', 
                pinyin: 'shǒu', 
                meaning: 'main', 
                strokes: 4,
                examples: ['手机', '洗手'],
                radicals: '手' 
            },
            { 
                character: '心', 
                pinyin: 'xīn', 
                meaning: 'cœur', 
                strokes: 4,
                examples: ['开心', '小心'],
                radicals: '心' 
            },
            { 
                character: '目', 
                pinyin: 'mù', 
                meaning: 'œil', 
                strokes: 5,
                examples: ['目标', '眼目'],
                radicals: '目' 
            },
            { 
                character: '耳', 
                pinyin: 'ěr', 
                meaning: 'oreille', 
                strokes: 6,
                examples: ['耳朵', '听耳'],
                radicals: '耳' 
            },
            // Chiffres
            { 
                character: '二', 
                pinyin: 'èr', 
                meaning: 'deux', 
                strokes: 2,
                examples: ['二十', '第二'],
                radicals: '二' 
            },
            { 
                character: '三', 
                pinyin: 'sān', 
                meaning: 'trois', 
                strokes: 3,
                examples: ['三个', '第三'],
                radicals: '一' 
            },
            { 
                character: '四', 
                pinyin: 'sì', 
                meaning: 'quatre', 
                strokes: 5,
                examples: ['四月', '四个'],
                radicals: '囗' 
            },
            { 
                character: '五', 
                pinyin: 'wǔ', 
                meaning: 'cinq', 
                strokes: 4,
                examples: ['五月', '五次'],
                radicals: '二' 
            },
            { 
                character: '六', 
                pinyin: 'liù', 
                meaning: 'six', 
                strokes: 4,
                examples: ['六月', '六个'],
                radicals: '八' 
            }
            // Ajoutez plus de caractères ici selon vos besoins
        ];
    }
    
    // Obtenir les informations d'un caractère par son caractère
    getCharacterInfo(character) {
        return this.charactersMap.get(character) || null;
    }
    
    // Obtenir les informations d'un caractère par son indice
    getCharacterByIndex(index) {
        if (index >= 0 && index < this.characters.length) {
            return this.characters[index];
        }
        return null;
    }
    
    // Rechercher des caractères par pinyin
    searchByPinyin(pinyin) {
        pinyin = pinyin.toLowerCase();
        return this.characters.filter(char => 
            char.pinyin.toLowerCase().includes(pinyin)
        );
    }
    
    // Rechercher des caractères par signification
    searchByMeaning(meaning) {
        meaning = meaning.toLowerCase();
        return this.characters.filter(char => 
            char.meaning.toLowerCase().includes(meaning)
        );
    }
    
    // Obtenir tous les caractères
    getAllCharacters() {
        return this.characters;
    }
    
    // Obtenir les N caractères les plus couramment utilisés
    getMostCommonCharacters(n = 10) {
        return this.characters.slice(0, Math.min(n, this.characters.length));
    }
    
    // Obtenir des caractères aléatoires
    getRandomCharacters(n = 5) {
        const result = [];
        const indices = new Set();
        
        while (indices.size < Math.min(n, this.characters.length)) {
            const randomIndex = Math.floor(Math.random() * this.characters.length);
            if (!indices.has(randomIndex)) {
                indices.add(randomIndex);
                result.push(this.characters[randomIndex]);
            }
        }
        
        return result;
    }
    
    // Obtenir les détails complets d'un caractère
    getCharacterDetails(character) {
        const charInfo = this.getCharacterInfo(character);
        if (!charInfo) return null;
        
        // Ajouter plus d'informations détaillées ici si nécessaire
        return {
            ...charInfo,
            etymology: this.getEtymology(character),
            pronunciationTips: this.getPronunciationTips(charInfo.pinyin),
            mnemonics: this.getMnemonics(character)
        };
    }
    
    // Obtenir l'étymologie d'un caractère (simulé pour la démo)
    getEtymology(character) {
        // Dans une vraie application, ceci viendrait d'une base de données
        const etymologies = {
            '人': 'À l\'origine, il représentait une personne vue de côté, marchant.',
            '大': 'Représente une personne avec les bras étendus, signifiant "grand".',
            '水': 'Pictogramme représentant l\'eau qui coule.',
            '火': 'Pictogramme représentant des flammes montantes.'
        };
        
        return etymologies[character] || 'Information étymologique non disponible.';
    }
    
    // Obtenir des conseils de prononciation (simulé pour la démo)
    getPronunciationTips(pinyin) {
        // Dans une vraie application, ceci viendrait d'une base de données
        const tips = {
            'rén': 'Prononcez comme "ren" avec un ton montant.',
            'dà': 'Prononcez comme "da" avec un ton descendant.',
            'shuǐ': 'Prononcez "shway" avec un ton descendant puis montant.',
            'huǒ': 'Prononcez "hwo" avec un ton descendant puis montant.'
        };
        
        return tips[pinyin] || 'Conseils de prononciation non disponibles.';
    }
    
    // Obtenir des moyens mnémotechniques (simulé pour la démo)
    getMnemonics(character) {
        // Dans une vraie application, ceci viendrait d'une base de données
        const mnemonics = {
            '人': 'Ressemble à une personne vue de côté, comme quelqu\'un qui marche.',
            '大': 'Ressemble à une personne avec les bras écartés, comme pour montrer quelque chose de grand.',
            '水': 'Imaginez des gouttes d\'eau qui coulent sur les traits du caractère.',
            '火': 'Les traits représentent des flammes qui montent, comme un feu de camp.'
        };
        
        return mnemonics[character] || 'Moyens mnémotechniques non disponibles.';
    }
}
