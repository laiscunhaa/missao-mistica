// game.js - Lógica geral do jogo

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    // Configurar modal "Sobre" na página inicial
    const aboutModal = document.getElementById('aboutModal');
    const aboutBtn = document.getElementById('aboutBtn');
    const closeModal = document.querySelector('.close-modal');
    
    if (aboutBtn && aboutModal && closeModal) {
        aboutBtn.addEventListener('click', function() {
            aboutModal.style.display = 'block';
        });
        
        closeModal.addEventListener('click', function() {
            aboutModal.style.display = 'none';
        });
        
        window.addEventListener('click', function(event) {
            if (event.target === aboutModal) {
                aboutModal.style.display = 'none';
            }
        });
    }
    
    // Inicializar fase se estiver em uma página de fase
    if (document.querySelector('.phase-container')) {
        initializePhase();
    }
});

// Função para inicializar uma fase específica
function initializePhase() {
    // Esta função será sobrescrita por cada fase específica
    console.log('Fase inicializada');
    
    // Configurar botões de navegação se existirem
    const backBtn = document.getElementById('backBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            goToPreviousPhase();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            goToNextPhase();
        });
    }
}

// Navegação entre fases
function goToPreviousPhase() {
    const currentPhase = getCurrentPhase();
    let previousPhase = '';
    
    switch(currentPhase) {
        case 'tutorial':
            window.location.href = 'index.html';
            break;
        case 'fase1':
            window.location.href = 'tutorial.html';
            break;
        case 'fase2':
            window.location.href = 'fase1.html';
            break;
        case 'fase3':
            window.location.href = 'fase2.html';
            break;
        default:
            window.location.href = 'index.html';
    }
}

function goToNextPhase() {
    const currentPhase = getCurrentPhase();
    let nextPhase = '';
    
    switch(currentPhase) {
        case 'tutorial':
            window.location.href = 'fase1.html';
            break;
        case 'fase1':
            window.location.href = 'fase2.html';
            break;
        case 'fase2':
            window.location.href = 'fase3.html';
            break;
        case 'fase3':
            // Fim do jogo - voltar para a página inicial
            window.location.href = 'index.html';
            break;
        default:
            window.location.href = 'index.html';
    }
}

function getCurrentPhase() {
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf('/') + 1);
    
    if (page.includes('tutorial')) return 'tutorial';
    if (page.includes('fase1')) return 'fase1';
    if (page.includes('fase2')) return 'fase2';
    if (page.includes('fase3')) return 'fase3';
    
    return 'index';
}

// Sistema de cartas de tarot
const tarotCards = {
    'lua': { name: 'A Lua', power: 'Revela uma letra da mensagem', icon: 'fa-moon' },
    'estrela': { name: 'A Estrela', power: 'Revela o tipo de cifra', icon: 'fa-star' },
    'mago': { name: 'O Mago', power: 'Fornece uma dica completa', icon: 'fa-hat-wizard' },
    'sol': { name: 'O Sol', power: 'Ilumina a resposta correta', icon: 'fa-sun' },
    'morte': { name: 'A Morte', power: 'Reinicia o puzzle sem penalidade', icon: 'fa-skull' }
};

// Função para obter uma carta aleatória
function getRandomCard() {
    const cardKeys = Object.keys(tarotCards);
    const randomKey = cardKeys[Math.floor(Math.random() * cardKeys.length)];
    return { key: randomKey, ...tarotCards[randomKey] };
}

// Função para revelar uma carta
function revealCard(cardElement) {
    if (!cardElement.classList.contains('revealed')) {
        cardElement.classList.add('revealed');
        
        // Obter uma carta aleatória
        const card = getRandomCard();
        
        // Atualizar o ícone e tooltip
        const iconElement = cardElement.querySelector('i');
        if (iconElement) {
            iconElement.className = `fas ${card.icon}`;
        }
        
        cardElement.title = `${card.name}: ${card.power}`;
        
        // Mostrar feedback
        showFeedback(`Você encontrou ${card.name}! ${card.power}`, 'success');
        
        // Adicionar à coleção do jogador
        addCardToCollection(card);
    }
}

// Função para adicionar carta à coleção
function addCardToCollection(card) {
    let collectedCards = JSON.parse(localStorage.getItem('missaoMisticaCards')) || [];
    
    if (!collectedCards.find(c => c.key === card.key)) {
        collectedCards.push({ 
            key: card.key, 
            name: card.name, 
            power: card.power, 
            icon: card.icon 
        });
        localStorage.setItem('missaoMisticaCards', JSON.stringify(collectedCards));
    }
}

// Função para mostrar feedback
function showFeedback(message, type) {
    // Criar ou reutilizar elemento de feedback
    let feedbackElement = document.querySelector('.feedback-message');
    
    if (!feedbackElement) {
        feedbackElement = document.createElement('div');
        feedbackElement.className = 'feedback-message';
        document.querySelector('.game-controls').appendChild(feedbackElement);
    }
    
    feedbackElement.textContent = message;
    feedbackElement.className = `feedback-message ${type}`;
    
    // Remover após alguns segundos
    setTimeout(() => {
        feedbackElement.style.opacity = '0';
        setTimeout(() => {
            feedbackElement.style.display = 'none';
            feedbackElement.style.opacity = '1';
        }, 500);
    }, 3000);
}

// Cifra de César
function caesarCipher(text, shift, decrypt = false) {
    shift = decrypt ? (26 - shift) % 26 : shift;
    
    return text.split('').map(char => {
        if (char.match(/[A-Z]/i)) {
            const code = char.charCodeAt(0);
            const isUpperCase = char === char.toUpperCase();
            const offset = isUpperCase ? 65 : 97;
            return String.fromCharCode(((code - offset + shift) % 26 + 26) % 26 + offset);
        }
        return char;
    }).join('');
}

// Criptografia com matriz 2x2 (Cifra de Hill)
function hillCipher(text, matrix, decrypt = false) {
    // Converter texto para números (A=0, B=1, ..., Z=25)
    const textUpper = text.toUpperCase().replace(/[^A-Z]/g, '');
    const n = matrix.length;
    
    // Garantir que o texto tenha comprimento par
    let paddedText = textUpper;
    if (paddedText.length % n !== 0) {
        paddedText += 'X'.repeat(n - (paddedText.length % n));
    }
    
    // Converter texto em vetores numéricos
    const vectors = [];
    for (let i = 0; i < paddedText.length; i += n) {
        const vector = [];
        for (let j = 0; j < n; j++) {
            vector.push(paddedText.charCodeAt(i + j) - 65);
        }
        vectors.push(vector);
    }
    
    // Se for decriptação, calcular matriz inversa
    let useMatrix = matrix;
    if (decrypt) {
        useMatrix = invertMatrix(matrix);
    }
    
    // Multiplicar cada vetor pela matriz
    const resultVectors = vectors.map(vector => {
        const result = [];
        for (let i = 0; i < n; i++) {
            let sum = 0;
            for (let j = 0; j < n; j++) {
                sum += useMatrix[i][j] * vector[j];
            }
            result.push(sum % 26);
        }
        return result;
    });
    
    // Converter vetores de volta para texto
    let result = '';
    for (const vector of resultVectors) {
        for (const num of vector) {
            result += String.fromCharCode(num + 65);
        }
    }
    
    return result;
}

// Função para inverter matriz 2x2 (mod 26)
function invertMatrix(matrix) {
    const [[a, b], [c, d]] = matrix;
    
    // Determinante mod 26
    let det = (a * d - b * c) % 26;
    if (det < 0) det += 26;
    
    // Encontrar inverso multiplicativo do determinante mod 26
    let detInv = -1;
    for (let i = 0; i < 26; i++) {
        if ((det * i) % 26 === 1) {
            detInv = i;
            break;
        }
    }
    
    // Se não tem inverso, retornar matriz original (não deve acontecer para matrizes válidas)
    if (detInv === -1) return matrix;
    
    // Matriz adjunta mod 26
    const adj = [
        [d, -b],
        [-c, a]
    ].map(row => row.map(val => {
        let result = val % 26;
        if (result < 0) result += 26;
        return result;
    }));
    
    // Multiplicar adjunta pelo inverso do determinante
    return adj.map(row => row.map(val => (val * detInv) % 26));
}

// game.js - Atualização da função caesarCipher

// Cifra de César FIXA com 3 posições
function caesarCipher(text, encrypt = true) {
    const shift = 3; // DESLOCAMENTO FIXO DE 3 POSIÇÕES
    
    return text.split('').map(char => {
        if (char.match(/[A-Z]/i)) {
            const code = char.charCodeAt(0);
            const isUpperCase = char === char.toUpperCase();
            const offset = isUpperCase ? 65 : 97;
            
            if (encrypt) {
                // Criptografar: mover 3 posições para frente
                return String.fromCharCode(((code - offset + shift) % 26) + offset);
            } else {
                // Descriptografar: mover 3 posições para trás
                return String.fromCharCode(((code - offset - shift + 26) % 26) + offset);
            }
        }
        // Manter espaços e outros caracteres
        return char;
    }).join('');
}

// game.js - Adicionar estas funções após a cifra de César

// Função para converter texto em números (A=0, B=1, ..., Z=25, Espaço=26)
function textToNumbers(text) {
    const upperText = text.toUpperCase();
    const numbers = [];
    
    for (let i = 0; i < upperText.length; i++) {
        const char = upperText[i];
        
        if (char >= 'A' && char <= 'Z') {
            numbers.push(char.charCodeAt(0) - 65);
        } else if (char === ' ') {
            numbers.push(26); // Espaço = 26
        } else {
            // Para outros caracteres, manter como estão
            numbers.push(char);
        }
    }
    
    return numbers;
}

// Função para converter números em texto
function numbersToText(numbers) {
    let text = '';
    
    for (let i = 0; i < numbers.length; i++) {
        const num = numbers[i];
        
        if (typeof num === 'number' && num >= 0 && num <= 25) {
            text += String.fromCharCode(num + 65);
        } else if (num === 26) {
            text += ' '; // Espaço
        } else {
            text += num; // Manter outros caracteres
        }
    }
    
    return text;
}

// Função para criptografar com matriz 2x2 (Cifra de Hill simplificada)
function encryptWithMatrix(text, matrix) {
    const numbers = textToNumbers(text);
    const encryptedNumbers = [];
    
    // Garantir que o comprimento seja par
    if (numbers.length % 2 !== 0) {
        numbers.push(26); // Adicionar espaço se necessário
    }
    
    // Aplicar a matriz a cada par de números
    for (let i = 0; i < numbers.length; i += 2) {
        const x = numbers[i];
        const y = numbers[i + 1];
        
        // Multiplicação de matriz: [a b; c d] * [x; y]
        const newX = (matrix[0][0] * x + matrix[0][1] * y) % 27;
        const newY = (matrix[1][0] * x + matrix[1][1] * y) % 27;
        
        encryptedNumbers.push(newX, newY);
    }
    
    return numbersToText(encryptedNumbers);
}

// Função para descriptografar com matriz 2x2
function decryptWithMatrix(text, matrix) {
    // Primeiro precisamos encontrar a matriz inversa mod 27
    const inverseMatrix = findInverseMatrix(matrix, 27);
    
    if (!inverseMatrix) {
        return "ERRO: Matriz não tem inversa!";
    }
    
    return encryptWithMatrix(text, inverseMatrix);
}

// Função para encontrar matriz inversa módulo m
function findInverseMatrix(matrix, m) {
    const [[a, b], [c, d]] = matrix;
    
    // Determinante mod m
    let det = (a * d - b * c) % m;
    if (det < 0) det += m;
    
    // Encontrar inverso multiplicativo do determinante mod m
    let detInv = -1;
    for (let i = 0; i < m; i++) {
        if ((det * i) % m === 1) {
            detInv = i;
            break;
        }
    }
    
    // Se não tem inverso, retornar null
    if (detInv === -1) return null;
    
    // Matriz adjunta mod m
    const adj = [
        [d, -b],
        [-c, a]
    ].map(row => row.map(val => {
        let result = val % m;
        if (result < 0) result += m;
        return result;
    }));
    
    // Multiplicar adjunta pelo inverso do determinante mod m
    return adj.map(row => row.map(val => (val * detInv) % m));
}

// Tabela de referência alfabeto-números (para exibição)
const alphabetTable = [
    ['A', 0], ['B', 1], ['C', 2], ['D', 3], ['E', 4],
    ['F', 5], ['G', 6], ['H', 7], ['I', 8], ['J', 9],
    ['K', 10], ['L', 11], ['M', 12], ['N', 13], ['O', 14],
    ['P', 15], ['Q', 16], ['R', 17], ['S', 18], ['T', 19],
    ['U', 20], ['V', 21], ['W', 22], ['X', 23], ['Y', 24],
    ['Z', 25], ['Espaço', 26]
];