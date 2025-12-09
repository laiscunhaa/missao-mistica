// fase3.js - Lógica específica da fase 3 (reformulada)

// Matriz simplificada e mais acessível
const SIMPLE_MATRIX = [[2, 1], [1, 1]];
const INVERSE_MATRIX = [[1, -1], [-1, 2]]; // Inversa mod 26

// Mensagem cifrada: "aditrevni errot a" (sem espaços) cifrada com a matriz
const ENCRYPTED_MESSAGE = "JWHQWLQVRU"; // "aditrevnierrota" cifrada

// Inicializar fase 3
function initializePhase() {
    // Atualizar contador de cartas
    updateCardCount();
    
    // Configurar eventos para tecla Enter
    document.getElementById('decryptedText').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            checkDecryption();
        }
    });
    
    document.getElementById('finalMessage').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            checkFinalMessage();
        }
    });
    
    // Mostrar mensagem cifrada
    document.getElementById('encryptedText').textContent = ENCRYPTED_MESSAGE;
    
    // Configurar fallback para imagens
    setupImageFallbacks();
    
    console.log('Fase 3 inicializada (versão simplificada)');
    console.log('Matriz:', SIMPLE_MATRIX);
    console.log('Mensagem cifrada:', ENCRYPTED_MESSAGE);
}

// Configurar fallback para imagens
function setupImageFallbacks() {
    const sceneBg = document.getElementById('sceneBackground');
    const character = document.getElementById('character');
    const card = document.querySelector('.tarot-card-img');
    
    // Fallback para cenário
    if (sceneBg) {
        sceneBg.addEventListener('error', function() {
            this.style.background = 'linear-gradient(145deg, #0c0a1d, #1a112e)';
            this.innerHTML = '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #b57bfe; text-align: center;"><i class="fas fa-chess-board" style="font-size: 3rem;"></i><p>Câmara das Transformações</p></div>';
        });
    }
    
    // Fallback para personagem
    if (character) {
        character.addEventListener('error', function() {
            this.style.display = 'none';
            const fallbackChar = document.createElement('div');
            fallbackChar.style.position = 'absolute';
            fallbackChar.style.bottom = '20px';
            fallbackChar.style.left = '50%';
            fallbackChar.style.transform = 'translateX(-50%)';
            fallbackChar.style.width = '80px';
            fallbackChar.style.height = '120px';
            fallbackChar.style.background = 'linear-gradient(145deg, #5d3bad, #3d2a7a)';
            fallbackChar.style.borderRadius = '10px 10px 0 0';
            fallbackChar.innerHTML = '<div style="position: absolute; top: 15px; left: 50%; transform: translateX(-50%); width: 40px; height: 40px; background: rgba(255, 255, 255, 0.1); border-radius: 50%;"></div>';
            if (sceneBg) sceneBg.appendChild(fallbackChar);
        });
    }
    
    // Fallback para carta
    if (card) {
        card.addEventListener('error', function() {
            this.style.display = 'none';
            const cardSlot = document.getElementById('cardSlot');
            if (cardSlot) {
                const fallbackCard = document.createElement('div');
                fallbackCard.className = 'card-placeholder';
                fallbackCard.innerHTML = '<i class="fas fa-question"></i>';
                fallbackCard.onclick = function() { revealCard(this); };
                cardSlot.appendChild(fallbackCard);
            }
        });
    }
}

// Função simplificada para decifrar com matriz 2x2
function simpleMatrixDecrypt(text, matrix) {
    // Converter texto para números (A=0, B=1, ..., Z=25)
    const nums = [];
    for (let i = 0; i < text.length; i++) {
        const char = text[i].toUpperCase();
        if (char >= 'A' && char <= 'Z') {
            nums.push(char.charCodeAt(0) - 65);
        }
    }
    
    // Aplicar matriz inversa a cada par de números
    const resultNums = [];
    for (let i = 0; i < nums.length; i += 2) {
        if (i + 1 < nums.length) {
            const x = nums[i];
            const y = nums[i + 1];
            
            // Multiplicar pela matriz inversa
            const a = matrix[0][0];
            const b = matrix[0][1];
            const c = matrix[1][0];
            const d = matrix[1][1];
            
            let newX = (a * x + b * y) % 26;
            let newY = (c * x + d * y) % 26;
            
            // Ajustar para números positivos
            if (newX < 0) newX += 26;
            if (newY < 0) newY += 26;
            
            resultNums.push(newX, newY);
        }
    }
    
    // Converter números de volta para letras
    let result = '';
    for (const num of resultNums) {
        result += String.fromCharCode(num + 97); // minúsculas
    }
    
    return result;
}

// Verificar a decifração (Passo 1)
function checkDecryption() {
    const userAnswer = document.getElementById('decryptedText').value.toLowerCase().replace(/\s/g, '');
    const correctAnswer = 'aditrevnierrota'; // Sem espaços
    
    if (userAnswer === correctAnswer) {
        showFeedback('Excelente! Você decifrou a mensagem corretamente!', 'success');
        
        // Mostrar o passo 2
        document.getElementById('step2').style.display = 'block';
        document.getElementById('decryptionHint').classList.add('active');
        document.getElementById('decryptedResult').textContent = 'aditrevni errot a';
        
        // Rolar para o passo 2
        document.getElementById('step2').scrollIntoView({ behavior: 'smooth' });
        
        // Adicionar carta à coleção se ainda não tiver
        addCardIfNotExists({
            key: 'decryption_master',
            name: 'O Decifrador',
            power: 'Domina a arte da criptografia matricial',
            icon: 'fa-key'
        });
        
        updateCardCount();
    } else {
        showFeedback('Resposta incorreta. Tente novamente! Use a matriz inversa [[1, -1], [-1, 2]]', 'error');
        
        // Dar dica após alguns erros
        if (userAnswer.length >= 4) {
            const firstFour = userAnswer.substring(0, 4);
            if (firstFour !== 'adit') {
                showFeedback('Dica: As primeiras 4 letras são "adit"', 'error');
            }
        }
    }
}

// Verificar mensagem final (Passo 2)
function checkFinalMessage() {
    const userAnswer = document.getElementById('finalMessage').value.toUpperCase();
    const correctAnswer = 'A TORRE INVERTIDA';
    
    // Aceitar várias formas de escrever
    const normalizedAnswer = userAnswer
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remover acentos
        .replace(/\s+/g, ' ') // Normalizar espaços
        .trim();
    
    const normalizedCorrect = correctAnswer
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, ' ')
        .trim();
    
    if (normalizedAnswer === normalizedCorrect || 
        normalizedAnswer === 'ATORREINVERTIDA' ||
        normalizedAnswer === 'A TORRE INVERTIDA') {
        
        showFeedback('INCRÍVEL! Você descobriu o segredo final!', 'success');
        
        // Mostrar mensagem de conclusão
        document.getElementById('finalMessageBox').classList.add('active');
        document.getElementById('finalHint').classList.remove('active');
        
        // Adicionar carta final à coleção
        addCardIfNotExists({
            key: 'torre_invertida',
            name: 'A Torre Invertida',
            power: 'Revela que a verdade está nas aparências invertidas',
            icon: 'fa-tower'
        });
        
        updateCardCount();
        
        // Rolar para mensagem final
        document.getElementById('finalMessageBox').scrollIntoView({ behavior: 'smooth' });
    } else {
        showFeedback('Ainda não é a mensagem final correta. Observe bem a frase decifrada!', 'error');
        
        // Dicas progressivas
        if (userAnswer.includes('TORRE')) {
            showFeedback('Você está quente! "TORRE" faz parte da resposta!', 'error');
        } else if (userAnswer.includes('INVERT')) {
            showFeedback('Boa! "INVERT" também faz parte!', 'error');
        }
    }
}

// Mostrar dica final
function showFinalHint() {
    const hintBox = document.getElementById('finalHint');
    hintBox.classList.toggle('active');
    
    if (hintBox.classList.contains('active')) {
        setTimeout(() => {
            hintBox.classList.remove('active');
        }, 10000);
    }
}

// Adicionar carta se não existir
function addCardIfNotExists(card) {
    let collectedCards = JSON.parse(localStorage.getItem('missaoMisticaCards')) || [];
    
    if (!collectedCards.find(c => c.key === card.key)) {
        collectedCards.push(card);
        localStorage.setItem('missaoMisticaCards', JSON.stringify(collectedCards));
        return true;
    }
    return false;
}

// Revelar carta
function revealCard(cardElement) {
    if (!cardElement.classList.contains('revealed')) {
        cardElement.classList.add('revealed');
        
        const card = {
            key: 'revelacao_final',
            name: 'A Revelação',
            power: 'Mostra que "aditrevni errot a" está invertido',
            icon: 'fa-eye'
        };
        
        // Efeito visual
        cardElement.style.transform = 'rotateY(360deg) scale(1.1)';
        cardElement.style.transition = 'transform 0.8s ease';
        cardElement.style.boxShadow = '0 0 25px rgba(181, 123, 254, 0.8)';
        
        cardElement.title = `${card.name}: ${card.power}`;
        
        showFeedback(`Você encontrou ${card.name}! ${card.power}`, 'success');
        
        addCardIfNotExists(card);
        updateCardCount();
        
        setTimeout(() => {
            cardElement.style.transform = '';
        }, 800);
    }
}

// Completar o jogo
function completeGame() {
    // Marcar jogo como completo
    localStorage.setItem('missaoMisticaCompleted', 'true');
    localStorage.setItem('missaoMisticaCompletionDate', new Date().toISOString());
    
    // Mostrar mensagem final
    alert('🎉 MISSÃO MÍSTICA CONCLUÍDA! 🎉\n\n' +
          'Você provou ser um verdadeiro Mestre da Criptografia!\n\n' +
          'Habilidades dominadas:\n' +
          '✓ Cifra de César\n' +
          '✓ Criptografia com Matrizes 2x2\n' +
          '✓ Decifração de mensagens invertidas\n' +
          '✓ Percepção de padrões ocultos\n\n' +
          'Voltando ao menu principal...');
    
    // Redirecionar para página inicial
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

// Atualizar contador de cartas
function updateCardCount() {
    const collectedCards = JSON.parse(localStorage.getItem('missaoMisticaCards')) || [];
    const cardCountElement = document.getElementById('cardCount');
    if (cardCountElement) {
        cardCountElement.textContent = `${collectedCards.length}/5`;
    }
}

// Criar efeito de confetes
function createConfetti() {
    const colors = ['#b57bfe', '#5d3bad', '#f0e6ff', '#c9b2f0', '#3d2a7a'];
    const container = document.querySelector('.game-area');
    
    if (!container) return;
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = '50%';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-20px';
        confetti.style.opacity = '0.8';
        confetti.style.zIndex = '9999';
        
        container.appendChild(confetti);
        
        const animation = confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: 2000 + Math.random() * 2000,
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
        });
        
        animation.onfinish = () => {
            confetti.remove();
        };
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    initializePhase();
});