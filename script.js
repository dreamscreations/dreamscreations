// Spin wheel configuration
const prizes = [
    "5% OFF on Any Order",
    "5% OFF on Any Order",
    "7% OFF on Any Order",
    "10% OFF on Orders Above ₹499",
    "Buy 1 Get 1 Bracelets",
    "6% OFF on Any Order",
    "15% OFF Digital Designs",
    "Better Luck Next Time"
];

// DOM elements
const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spin-btn');
const resultContainer = document.getElementById('result-container');
const resultTitle = document.getElementById('result-title');
const resultText = document.getElementById('result-text');
const prizeElement = document.getElementById('prize');
const whatsappBtn = document.getElementById('whatsapp-btn');

// Create wheel segments
function createWheelSegments() {
    const segmentAngle = 360 / prizes.length;
    
    prizes.forEach((prize, index) => {
        const segment = document.createElement('div');
        segment.className = 'segment';
        segment.classList.add(`segment-${index}`);
        segment.style.transform = `rotate(${index * segmentAngle}deg)`;
        
        const content = document.createElement('div');
        content.className = 'segment-content';
        content.textContent = prize;
        
        segment.appendChild(content);
        wheel.appendChild(segment);
    });
}

// Check if user has already spun
function hasUserSpun() {
    return localStorage.getItem('hasSpun') === 'true';
}

// Mark user as having spun
function markUserAsSpun() {
    localStorage.setItem('hasSpun', 'true');
}

// Initialize the wheel
function initWheel() {
    createWheelSegments();
    
    // Check if user has already spun
    if (hasUserSpun()) {
        spinBtn.disabled = true;
        spinBtn.textContent = '❌ You have already used your spin';
    }
    
    // Add spin button event listener
    spinBtn.addEventListener('click', spinWheel);
}

// Spin the wheel
function spinWheel() {
    if (hasUserSpun()) {
        return; // Prevent multiple spins
    }
    
    // Disable button during spin
    spinBtn.disabled = true;
    spinBtn.textContent = 'Spinning... 🎄';
    
    // Get the pointer element and add shake animation
    const pointer = document.querySelector('.pointer');
    pointer.classList.add('shaking');
    
    // Calculate random rotation (multiple spins + specific segment)
    const segmentAngle = 360 / prizes.length;
    const winningIndex = Math.floor(Math.random() * prizes.length);
    const extraSpins = 5; // Number of extra full rotations
    const rotation = (extraSpins * 360) + (360 - (winningIndex * segmentAngle)) - (segmentAngle / 2);
    
    // Apply rotation with smooth easing transition
    wheel.style.transition = 'transform 5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    wheel.style.transform = `rotate(${rotation}deg)`;
    
    // Add bounce effect when wheel stops
    setTimeout(() => {
        // Add bounce effect
        wheel.style.transition = 'transform 0.3s ease';
        wheel.style.transform = `rotate(${rotation + 5}deg)`;
        
        setTimeout(() => {
            wheel.style.transition = 'transform 0.2s ease';
            wheel.style.transform = `rotate(${rotation}deg)`;
        }, 300);
    }, 5000); // After main spin completes
    
    // Remove pointer shake after spin completes
    setTimeout(() => {
        pointer.classList.remove('shaking');
    }, 5500);
    
    // After spin completes
    setTimeout(() => {
        // Mark as spun
        markUserAsSpun();
        
        // Update button
        spinBtn.textContent = '❌ You have already used your spin';
        
        // Show result
        showResult(winningIndex);
        
        // Highlight winning section
        highlightWinningSection(winningIndex);
        
        // If it's a winning prize (not "Better Luck Next Time"), show confetti
        if (winningIndex !== 7) {
            showConfetti();
        }
    }, 5500); // Match the CSS transition duration + bounce effect
}

// Show result
function showResult(index) {
    const prize = prizes[index];
    const isWin = index !== 7; // "Better Luck Next Time" is at index 7
    
    if (isWin) {
        resultTitle.textContent = '🎉 You Won!';
        resultTitle.style.color = '#D4AF37';
        prizeElement.textContent = prize;
        whatsappBtn.style.display = 'inline-block';
        
        // Update WhatsApp button link with the prize
        const encodedPrize = encodeURIComponent(prize);
        whatsappBtn.href = `https://wa.me/7025362767?text=I%20won%20on%20the%20Spin%20&%20Win%20wheel!%20My%20prize:%20${encodedPrize}%0A%0A*Campaign%20Rules:%20One%20spin%20per%20device.%20Screenshot%20required.%20Offer%20valid%20for%2024%20hours.*`;
    } else {
        resultTitle.textContent = '😞 Better Luck Next Time!';
        resultTitle.style.color = '#ff6b6b';
        prizeElement.textContent = "No prize this time";
        whatsappBtn.style.display = 'none';
    }
    
    resultContainer.classList.remove('hidden');
}

// Confetti effect with sparkle animation
function showConfetti() {
    // Create canvas for confetti
    const canvas = document.createElement('canvas');
    canvas.id = 'confetti-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1000';
    
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Confetti particles
    const confettiPieces = [];
    const colors = ['#D4AF37', '#d22b2b', '#0a5a2a', '#ffffff', '#ff6b6b', '#4ecdc4'];
    
    // Create confetti pieces
    for (let i = 0; i < 150; i++) {
        confettiPieces.push({
            x: Math.random() * canvas.width,
            y: -20,
            width: Math.random() * 10 + 5,
            height: Math.random() * 10 + 5,
            speed: Math.random() * 3 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 5 - 2.5,
            sparkles: [],
            lastSparkle: 0
        });
    }
    
    // Create sparkle particles
    const sparkleParticles = [];
    
    // Animation function
    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let activePieces = 0;
        
        confettiPieces.forEach(piece => {
            // Update position
            piece.y += piece.speed;
            piece.rotation += piece.rotationSpeed;
            
            // Draw confetti piece
            ctx.save();
            ctx.translate(piece.x, piece.y);
            ctx.rotate(piece.rotation * Math.PI / 180);
            ctx.fillStyle = piece.color;
            ctx.fillRect(-piece.width/2, -piece.height/2, piece.width, piece.height);
            ctx.restore();
            
            // Add sparkles occasionally
            const now = Date.now();
            if (now - piece.lastSparkle > 100) { // Add sparkles every 100ms
                if (Math.random() > 0.7) { // 30% chance to create a sparkle
                    const sparkle = {
                        x: piece.x,
                        y: piece.y,
                        size: Math.random() * 3 + 1,
                        color: '#FFFFFF',
                        life: 30, // frames
                        maxLife: 30,
                        vx: (Math.random() - 0.5) * 2,
                        vy: (Math.random() - 0.5) * 2
                    };
                    sparkleParticles.push(sparkle);
                    piece.lastSparkle = now;
                }
            }
            
            // Count active pieces
            if (piece.y < canvas.height) {
                activePieces++;
            }
        });
        
        // Update and draw sparkles
        for (let i = sparkleParticles.length - 1; i >= 0; i--) {
            const sparkle = sparkleParticles[i];
            
            // Update position
            sparkle.x += sparkle.vx;
            sparkle.y += sparkle.vy;
            sparkle.life--;
            
            // Draw sparkle
            const alpha = sparkle.life / sparkle.maxLife;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = sparkle.color;
            ctx.beginPath();
            ctx.arc(sparkle.x, sparkle.y, sparkle.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
            
            // Remove dead sparkles
            if (sparkle.life <= 0) {
                sparkleParticles.splice(i, 1);
            }
        }
        
        // Continue animation if there are active pieces
        if (activePieces > 0 || sparkleParticles.length > 0) {
            requestAnimationFrame(animateConfetti);
        } else {
            // Remove canvas when animation is done
            setTimeout(() => {
                if (canvas.parentNode) {
                    canvas.parentNode.removeChild(canvas);
                }
            }, 500);
        }
    }
    
    // Start animation
    animateConfetti();
    
    // Remove canvas after a while as a fallback
    setTimeout(() => {
        if (canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
        }
    }, 8000); // Extended time to allow all sparkles to finish
}

// Handle window resize
window.addEventListener('resize', () => {
    // Recreate confetti canvas if needed
});

// Highlight winning section with gold glow
function highlightWinningSection(index) {
    // Remove any existing highlights
    const segments = document.querySelectorAll('.segment');
    segments.forEach(segment => {
        segment.style.boxShadow = 'none';
    });
    
    // Highlight the winning segment
    const winningSegment = segments[index];
    winningSegment.style.boxShadow = 'inset 0 0 20px 5px #D4AF37, 0 0 20px 5px #D4AF37';
    
    // Add a subtle pulse animation to the winning segment
    const pulseAnimation = [
        { filter: 'brightness(1) drop-shadow(0 0 5px #D4AF37)' },
        { filter: 'brightness(1.3) drop-shadow(0 0 15px #D4AF37)' },
        { filter: 'brightness(1) drop-shadow(0 0 5px #D4AF37)' }
    ];
    
    winningSegment.animate(pulseAnimation, {
        duration: 1000,
        iterations: 3
    });
}

// Initialize the wheel when the page loads
document.addEventListener('DOMContentLoaded', initWheel);