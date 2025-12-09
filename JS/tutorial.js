// tutorial.js - Lógica específica do tutorial (atualizada)

// Inicializar fase tutorial
function initializePhase() {
    // Atualizar contador de cartas
    updateCardCount();
    
    // Configurar evento para a tecla Enter no campo de resposta
    document.getElementById('decryptedText').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            checkCaesarSolution();
        }
    });
    
    // Mostrar mensagem cifrada (TUTORIAL com deslocamento 3)
    const encryptedText = caesarCipher('TUTORIAL', true); // true = criptografar
    document.getElementById('encryptedText').textContent = encryptedText;
    
    // Configurar fallback para imagens (caso não carreguem)
    setupImageFallbacks();
    
    console.log('Tutorial inicializado. Mensagem cifrada:', encryptedText);
}

// Configurar fallback para imagens
function setupImageFallbacks() {
    const sceneBg = document.getElementById('sceneBackground');
    const character = document.getElementById('character');
    const card = document.querySelector('.tarot-card-img');
    
    // Fallback para cenário
    sceneBg.addEventListener('error', function() {
        this.style.background = 'linear-gradient(145deg, #1a1630, #0c0a1d)';
        this.innerHTML = '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #b57bfe; text-align: center;"><i class="fas fa-mountain" style="font-size: 3rem;"></i><p>Cenário Tutorial</p></div>';
    });
    
    // Fallback para personagem
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
        sceneBg.appendChild(fallbackChar);
    });
    
    // Fallback para carta
    if (card) {
        card.addEventListener('error', function() {
            this.style.display = 'none';
            const cardSlot = document.getElementById('cardSlot');
            const fallbackCard = document.createElement('div');
            fallbackCard.className = 'card-placeholder';
            fallbackCard.innerHTML = '<i class="fas fa-question"></i>';
            fallbackCard.onclick = function() { revealCard(this); };
            cardSlot.appendChild(fallbackCard);
        });
    }
}

// Verificar solução da Cifra de César
function checkCaesarSolution() {
    const userAnswer = document.getElementById('decryptedText').value.toUpperCase().replace(/\s/g, '');
    const correctAnswer = 'TUTORIAL';
    
    if (userAnswer === correctAnswer) {
        showFeedback('Parabéns! Você decifrou corretamente a mensagem!', 'success');
        document.getElementById('nextBtn').disabled = false;
        
        // Mostrar animação de confetes
        createConfetti();
        
        // Mostrar mensagem decifrada
        document.getElementById('encryptedText').innerHTML = `
            <div style="color: #a3f7b8; font-size: 1.5rem;">
                <span style="text-decoration: line-through; opacity: 0.6;">${caesarCipher('TUTORIAL', true)}</span>
                <br>
                <span style="color: #f0e6ff; font-size: 2rem;">${correctAnswer}</span>
            </div>
        `;
    } else {
        showFeedback('Resposta incorreta. Tente novamente! Lembre-se: volte 3 posições no alfabeto.', 'error');
        
        // Mostrar primeira letra como dica após erro
        if (userAnswer.length > 0 && userAnswer[0] !== 'T') {
            showFeedback(`Dica: A primeira letra é T (W volta 3 posições: W → T)`, 'error');
        }
    }
}

// Mostrar dica (alfabeto)
function showHint() {
    const hintBox = document.getElementById('hintBox');
    hintBox.classList.toggle('active');
    
    // Se a dica estiver visível, esconder após 10 segundos
    if (hintBox.classList.contains('active')) {
        setTimeout(() => {
            hintBox.classList.remove('active');
        }, 10000);
    }
}

// Revelar carta (atualizada para trabalhar com imagens)
function revealCard(cardElement) {
    if (!cardElement.classList.contains('revealed')) {
        cardElement.classList.add('revealed');
        
        // Obter uma carta (no tutorial, sempre a mesma)
        const card = {
            key: 'tutorial',
            name: 'O Aprendiz',
            power: 'Revela a primeira letra da próxima mensagem',
            icon: 'fa-graduation-cap'
        };
        
        // Adicionar efeito visual
        cardElement.style.transform = 'rotateY(360deg) scale(1.1)';
        cardElement.style.transition = 'transform 0.8s ease';
        cardElement.style.boxShadow = '0 0 25px rgba(181, 123, 254, 0.8)';
        
        // Atualizar tooltip
        cardElement.title = `${card.name}: ${card.power}`;
        
        // Mostrar feedback
        showFeedback(`Você encontrou ${card.name}! ${card.power}`, 'success');
        
        // Adicionar à coleção do jogador
        addCardToCollection(card);
        
        // Atualizar contador de cartas
        updateCardCount();
        
        // Resetar transformação após animação
        setTimeout(() => {
            cardElement.style.transform = '';
        }, 800);
    }
}

// Atualizar contador de cartas
function updateCardCount() {
    const collectedCards = JSON.parse(localStorage.getItem('missaoMisticaCards')) || [];
    document.getElementById('cardCount').textContent = `${collectedCards.length}/5`;
}

// Criar efeito de confetes
function createConfetti() {
    const colors = ['#b57bfe', '#5d3bad', '#f0e6ff', '#c9b2f0', '#3d2a7a'];
    const container = document.querySelector('.game-area');
    
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
        
        // Animar confete
        const animation = confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: 2000 + Math.random() * 2000,
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
        });
        
        // Remover confete após animação
        animation.onfinish = () => {
            confetti.remove();
        };
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    initializePhase();
});