/**
 * Mini-Projet JavaScript 2018 - Jeu de Tir sur Cibles
 * 
 * Ce fichier contient toute la logique du jeu de tir sur cibles.
 * Le joueur doit cliquer sur des cibles qui apparaissent aléatoirement
 * sur le terrain. Un chronomètre mesure le temps nécessaire pour
 * détruire toutes les cibles.
 */

// ============================================================================
// VARIABLES GLOBALES
// ============================================================================

// Dimensions des cibles (en pixels)
const targetWidth = 60;
const targetHeight = 60;

// Variables pour la gestion du chronomètre
let chronoTimer = null;  // Référence du timer (setInterval)
let time = 0;            // Temps écoulé en dixièmes de seconde

// Variables de jeu
let remainingTargets = 0;  // Nombre de cibles restantes
let gameInProgress = false; // Indique si une partie est en cours
let currentDifficulty = 'medium'; // Niveau de difficulté actuel

// Dimensions du terrain selon la difficulté
const terrainSizes = {
    easy: { width: 900, height: 550, targetSize: 70 },
    medium: { width: 800, height: 500, targetSize: 60 },
    hard: { width: 700, height: 450, targetSize: 45 }
};

// ============================================================================
// FONCTIONS DE GESTION DES CIBLES
// ============================================================================

/**
 * Crée un nouvel élément cible (div avec classe 'target')
 * @returns {HTMLElement} L'élément cible créé
 */
function createTarget() {
    const target = document.createElement('div');
    target.classList.add('target');
    target.classList.add(`difficulty-${currentDifficulty}`);

    // Ajouter l'événement de clic sur la cible
    target.addEventListener('click', handleTargetClick);

    return target;
}

/**
 * Positionne aléatoirement une cible dans le terrain
 * La position est calculée pour que la cible reste entièrement visible
 * @param {HTMLElement} target - L'élément cible à positionner
 */
function positionTarget(target) {
    const terrain = document.getElementById('terrain');
    const terrainRect = terrain.getBoundingClientRect();

    // Récupérer la taille de la cible selon la difficulté
    const targetSize = terrainSizes[currentDifficulty].targetSize;

    // Calculer les positions maximales pour que la cible reste dans le terrain
    const maxX = terrainRect.width - targetSize;
    const maxY = terrainRect.height - targetSize;

    // Générer des positions aléatoires
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    // Appliquer les positions
    target.style.left = randomX + 'px';
    target.style.top = randomY + 'px';
}

/**
 * Ajoute une cible au terrain et l'active
 * @param {HTMLElement} target - L'élément cible à ajouter
 */
function addTargetToField(target) {
    const terrain = document.getElementById('terrain');
    terrain.appendChild(target);

    // Petit délai pour permettre l'animation CSS
    setTimeout(() => {
        target.classList.add('on');
    }, 10);
}

/**
 * Gère le clic sur une cible
 * - Ajoute la classe 'hit' pour l'effet visuel
 * - Décrémente le compteur de cibles restantes
 * - Supprime la cible après 1 seconde
 * - Vérifie si le jeu est terminé
 * @param {Event} event - L'événement de clic
 */
function handleTargetClick(event) {
    const target = event.currentTarget;

    // Vérifier que la cible n'a pas déjà été cliquée
    if (target.classList.contains('hit')) {
        return;
    }

    // Ajouter la classe 'hit' pour l'effet visuel
    target.classList.add('hit');

    // Retirer l'événement de clic pour éviter les doubles clics
    target.removeEventListener('click', handleTargetClick);

    // Décrémenter le compteur de cibles restantes
    remainingTargets--;
    updateRemainingCount();

    console.log(`Cible cliquée ! Restantes: ${remainingTargets}, Jeu en cours: ${gameInProgress}`);

    // Supprimer la cible après 1 seconde
    setTimeout(() => {
        target.remove();
    }, 1000);

    // Vérifier si le jeu est terminé
    if (remainingTargets === 0 && gameInProgress) {
        console.log('Fin du jeu détectée ! Appel de endGame()');
        // Attendre un peu pour que l'animation de la dernière cible se termine
        setTimeout(() => {
            endGame();
        }, 1200);
    }
}

/**
 * Crée une seule cible (bouton "Une cible")
 */
function createSingleTarget() {
    const target = createTarget();
    positionTarget(target);
    addTargetToField(target);
}

/**
 * Supprime toutes les cibles du terrain
 */
function clearAllTargets() {
    const terrain = document.getElementById('terrain');
    const targets = terrain.querySelectorAll('.target');
    targets.forEach(target => target.remove());
}

// ============================================================================
// FONCTIONS DE GESTION DU CHRONOMÈTRE
// ============================================================================

/**
 * Démarre le chronomètre
 * Incrémente la variable 'time' toutes les 100ms et met à jour l'affichage
 */
function startChrono() {
    // Arrêter le chronomètre s'il est déjà en cours
    if (chronoTimer !== null) {
        stopChrono();
    }

    // Démarrer le timer (100ms = 1 dixième de seconde)
    chronoTimer = setInterval(() => {
        time++;
        updateChronoDisplay();
    }, 100);
}

/**
 * Arrête le chronomètre
 */
function stopChrono() {
    if (chronoTimer !== null) {
        clearInterval(chronoTimer);
        chronoTimer = null;
    }
}

/**
 * Remet le chronomètre à zéro
 */
function resetChrono() {
    stopChrono();
    time = 0;
    updateChronoDisplay();
}

/**
 * Met à jour l'affichage du chronomètre
 * Format: MM:SS:D (minutes:secondes:dixièmes)
 */
function updateChronoDisplay() {
    // Calculer les minutes, secondes et dixièmes
    const tenths = time % 10;
    const totalSeconds = Math.floor(time / 10);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60);

    // Formater avec des zéros devant si nécessaire
    const minutesStr = String(minutes).padStart(2, '0');
    const secondsStr = String(seconds).padStart(2, '0');
    const tenthsStr = String(tenths);

    // Mettre à jour l'affichage
    document.getElementById('chrono-minutes').textContent = minutesStr;
    document.getElementById('chrono-seconds').textContent = secondsStr;
    document.getElementById('chrono-tenths').textContent = tenthsStr;
}

/**
 * Retourne le temps formaté en chaîne de caractères
 * @returns {string} Le temps au format MM:SS:D
 */
function getFormattedTime() {
    const tenths = time % 10;
    const totalSeconds = Math.floor(time / 10);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60);

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${tenths}`;
}

// ============================================================================
// FONCTIONS DE GESTION DU JEU
// ============================================================================

/**
 * Met à jour l'affichage du nombre de cibles restantes
 */
function updateRemainingCount() {
    document.getElementById('remaining-count').textContent = remainingTargets;
}

/**
 * Démarre une nouvelle partie
 * - Supprime toutes les cibles existantes
 * - Réinitialise le chronomètre
 * - Crée le nombre de cibles demandé
 * - Démarre le chronomètre
 */
function startGame() {
    // Récupérer le nombre de cibles demandé
    const targetCountInput = document.getElementById('target-count');
    const targetCount = parseInt(targetCountInput.value);

    // Valider le nombre de cibles
    if (isNaN(targetCount) || targetCount < 1) {
        alert('Veuillez entrer un nombre de cibles valide (minimum 1)');
        return;
    }

    // Supprimer toutes les cibles existantes
    clearAllTargets();

    // Réinitialiser le chronomètre
    resetChrono();

    // Initialiser le compteur de cibles restantes
    remainingTargets = targetCount;
    updateRemainingCount();

    // Marquer le jeu comme en cours
    gameInProgress = true;

    // Créer les cibles
    for (let i = 0; i < targetCount; i++) {
        const target = createTarget();
        positionTarget(target);
        addTargetToField(target);
    }

    // Démarrer le chronomètre
    startChrono();
}

/**
 * Termine le jeu
 * - Arrête le chronomètre
 * - Affiche le temps final
 * - Sauvegarde le score dans le Hall of Fame
 */
function endGame() {
    console.log('endGame() appelée !');

    // Arrêter le chronomètre
    stopChrono();

    // Marquer le jeu comme terminé
    gameInProgress = false;

    // Récupérer le nombre de cibles
    const targetCount = parseInt(document.getElementById('target-count').value);

    // Afficher le temps final
    const finalTime = getFormattedTime();

    console.log(`Temps final: ${finalTime}, Nombre de cibles: ${targetCount}`);

    // Afficher le modal personnalisé au lieu du prompt natif
    const modal = document.getElementById('name-modal');
    const finalTimeDisplay = document.getElementById('final-time-modal');
    const playerNameInput = document.getElementById('player-name-input');

    if (modal && finalTimeDisplay && playerNameInput) {
        finalTimeDisplay.textContent = `Vous avez terminé en ${finalTime}`;
        playerNameInput.value = 'Joueur';
        modal.style.display = 'flex';

        // Focus sur l'input pour faciliter la saisie
        setTimeout(() => {
            playerNameInput.focus();
            playerNameInput.select();
        }, 100);

        console.log('Modal affiché');
    } else {
        console.error('Éléments du modal introuvables !');
    }
}

// ============================================================================
// FONCTIONS DE GESTION DE LA DIFFICULTÉ
// ============================================================================

/**
 * Change le niveau de difficulté
 * Ajuste la taille du terrain et des cibles
 */
function changeDifficulty() {
    const difficultySelect = document.getElementById('difficulty');
    currentDifficulty = difficultySelect.value;

    const terrain = document.getElementById('terrain');

    // Retirer toutes les classes de difficulté
    terrain.classList.remove('difficulty-easy', 'difficulty-medium', 'difficulty-hard');

    // Ajouter la nouvelle classe de difficulté
    terrain.classList.add(`difficulty-${currentDifficulty}`);
}

// ============================================================================
// FONCTIONS DE GESTION DU HALL OF FAME (localStorage)
// ============================================================================

/**
 * Sauvegarde un score dans le localStorage
 * @param {string} playerName - Nom du joueur
 * @param {number} targetCount - Nombre de cibles
 * @param {number} timeValue - Temps en dixièmes de seconde
 * @param {string} difficulty - Niveau de difficulté
 */
function saveScore(playerName, targetCount, timeValue, difficulty) {
    // Récupérer les scores existants
    const scores = loadScores();

    // Créer le nouveau score
    const newScore = {
        playerName: playerName,
        targetCount: targetCount,
        time: timeValue,
        difficulty: difficulty,
        formattedTime: getFormattedTime(),
        date: new Date().toISOString()
    };

    // Ajouter le nouveau score
    scores.push(newScore);

    // Trier les scores par temps (du plus rapide au plus lent)
    scores.sort((a, b) => {
        // D'abord par nombre de cibles (décroissant)
        if (a.targetCount !== b.targetCount) {
            return b.targetCount - a.targetCount;
        }
        // Ensuite par temps (croissant)
        return a.time - b.time;
    });

    // Garder seulement les 10 meilleurs scores
    const topScores = scores.slice(0, 10);

    // Sauvegarder dans localStorage
    localStorage.setItem('targetGameScores', JSON.stringify(topScores));
}

/**
 * Charge les scores depuis le localStorage
 * @returns {Array} Tableau des scores
 */
function loadScores() {
    const scoresJson = localStorage.getItem('targetGameScores');

    if (scoresJson) {
        try {
            return JSON.parse(scoresJson);
        } catch (e) {
            console.error('Erreur lors du chargement des scores:', e);
            return [];
        }
    }

    return [];
}

/**
 * Met à jour l'affichage du Hall of Fame
 */
function updateHallOfFame() {
    const scoresContainer = document.getElementById('scores-container');
    const scores = loadScores();

    // Vider le conteneur
    scoresContainer.innerHTML = '';

    // Si aucun score, afficher un message
    if (scores.length === 0) {
        scoresContainer.innerHTML = '<p class="no-scores">Aucun score enregistré. Jouez pour établir un record !</p>';
        return;
    }

    // Afficher chaque score
    scores.forEach((score, index) => {
        const scoreEntry = document.createElement('div');
        scoreEntry.classList.add('score-entry');

        // Icônes pour les médailles
        const medals = ['🥇', '🥈', '🥉'];
        const rankIcon = index < 3 ? medals[index] : `#${index + 1}`;

        // Emoji pour la difficulté
        const difficultyEmojis = {
            easy: '😊',
            medium: '😐',
            hard: '😰'
        };
        const difficultyEmoji = difficultyEmojis[score.difficulty] || '';

        scoreEntry.innerHTML = `
            <div class="score-info">
                <span class="score-rank">${rankIcon}</span>
                <div>
                    <div class="score-player">${score.playerName}</div>
                    <div class="score-details">${score.targetCount} cibles ${difficultyEmoji}</div>
                </div>
            </div>
            <div class="score-time">${score.formattedTime}</div>
        `;

        scoresContainer.appendChild(scoreEntry);
    });
}

// ============================================================================
// INITIALISATION
// ============================================================================

/**
 * Initialise le jeu au chargement de la page
 */
function init() {
    // Récupérer les éléments du DOM
    const btnSingleTarget = document.getElementById('btn-single-target');
    const btnStart = document.getElementById('btn-start');
    const difficultySelect = document.getElementById('difficulty');

    // Ajouter les événements
    btnSingleTarget.addEventListener('click', createSingleTarget);
    btnStart.addEventListener('click', startGame);
    difficultySelect.addEventListener('change', changeDifficulty);

    // Initialiser l'affichage
    updateRemainingCount();
    updateChronoDisplay();
    updateHallOfFame();
    changeDifficulty(); // Appliquer la difficulté par défaut

    // Ajouter les événements pour le modal
    const submitScoreBtn = document.getElementById('submit-score-btn');
    const cancelScoreBtn = document.getElementById('cancel-score-btn');
    const playerNameInput = document.getElementById('player-name-input');
    const modal = document.getElementById('name-modal');

    if (submitScoreBtn && cancelScoreBtn && playerNameInput && modal) {
        // Bouton "Enregistrer"
        submitScoreBtn.addEventListener('click', () => {
            const playerName = playerNameInput.value;
            const targetCountInput = document.getElementById('target-count');
            const targetCount = parseInt(targetCountInput.value);

            if (playerName && playerName.trim() !== '') {
                saveScore(playerName.trim(), targetCount, time, currentDifficulty);
                updateHallOfFame();
                console.log('Score sauvegardé et Hall of Fame mis à jour');
            } else {
                console.log('Aucun nom fourni, score non sauvegardé');
            }

            modal.style.display = 'none';
        });

        // Bouton "Annuler"
        cancelScoreBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            console.log('Sauvegarde annulée');
        });

        // Permettre de valider avec la touche Entrée
        playerNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                submitScoreBtn.click();
            }
        });
    }

    console.log('🎯 Jeu de Tir sur Cibles initialisé !');
}

// Lancer l'initialisation quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
