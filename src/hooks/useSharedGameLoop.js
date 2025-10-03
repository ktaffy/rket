import { useState, useEffect, useCallback, useRef } from 'react';
import { ref, set, onValue, runTransaction } from 'firebase/database';
import { database } from '../firebase';

const BASE_OBSTACLE_SPEED = 1.2;
const GAME_HEIGHT = 600;
const LANE_WIDTH = 200;
const GAME_REF = 'game/current';

// Check if this instance is the official game master
const IS_OFFICIAL_GAME_MASTER = process.env.REACT_APP_OFFICIAL_GAME_MASTER === 'true';

export const useSharedGameLoop = (currentVotePosition, onObstacleCleared) => {
    const [gameState, setGameState] = useState({
        position: 1,
        score: 0,
        lives: 3,
        combo: 0,
        isGameOver: false,
        isPaused: false,
        round: 0
    });

    const [currentObstacle, setCurrentObstacle] = useState(null);
    const animationFrameRef = useRef(null);
    const checkedObstacleIdRef = useRef(null);
    const isGameMasterRef = useRef(false);

    useEffect(() => {
        const gameStateRef = ref(database, `${GAME_REF}/state`);

        const unsubscribe = onValue(gameStateRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setGameState(data);
            } else {
                // Initialize game state
                const initialState = {
                    position: 1,
                    score: 0,
                    lives: 3,
                    combo: 0,
                    isGameOver: false,
                    isPaused: false,
                    round: 0
                };
                set(gameStateRef, initialState);
                setGameState(initialState);
            }
        });

        // Game master selection logic
        const gameMasterRef = ref(database, `${GAME_REF}/gameMaster`);

        if (IS_OFFICIAL_GAME_MASTER) {
            // This is the official deployed instance - always claim game master
            console.log('🚀 Official Game Master - Taking control');
            set(gameMasterRef, {
                timestamp: Date.now(),
                isOfficial: true
            });
            isGameMasterRef.current = true;
        } else {
            // Regular client - only become game master if official one doesn't exist
            onValue(gameMasterRef, (snapshot) => {
                const data = snapshot.val();

                if (!data) {
                    // No game master exists at all
                    set(gameMasterRef, {
                        timestamp: Date.now(),
                        isOfficial: false
                    });
                    isGameMasterRef.current = true;
                    console.log('📡 Temporary Game Master - Waiting for official');
                } else if (data.isOfficial) {
                    // Official game master exists - stay as observer
                    isGameMasterRef.current = false;
                    console.log('👀 Observer mode - Official game master active');
                } else if (Date.now() - data.timestamp > 10000) {
                    // Temporary game master is stale - take over temporarily
                    set(gameMasterRef, {
                        timestamp: Date.now(),
                        isOfficial: false
                    });
                    isGameMasterRef.current = true;
                    console.log('📡 Temporary Game Master - Taking over from stale master');
                } else {
                    // Another temporary master exists and is active
                    isGameMasterRef.current = false;
                }
            });
        }

        // Heartbeat to maintain game master status
        const heartbeatInterval = setInterval(() => {
            if (isGameMasterRef.current) {
                set(gameMasterRef, {
                    timestamp: Date.now(),
                    isOfficial: IS_OFFICIAL_GAME_MASTER
                });
            }
        }, 5000);

        return () => {
            unsubscribe();
            clearInterval(heartbeatInterval);
        };
    }, []);

    useEffect(() => {
        const obstacleRef = ref(database, `${GAME_REF}/obstacle`);

        const unsubscribe = onValue(obstacleRef, (snapshot) => {
            const data = snapshot.val();
            setCurrentObstacle(data);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (isGameMasterRef.current) {
            const gameStateRef = ref(database, `${GAME_REF}/state`);
            runTransaction(gameStateRef, (current) => {
                if (current) {
                    return { ...current, position: currentVotePosition };
                }
                return current;
            });
        }
    }, [currentVotePosition]);

    const updateGameState = useCallback((updates) => {
        if (!isGameMasterRef.current) return;

        const gameStateRef = ref(database, `${GAME_REF}/state`);
        runTransaction(gameStateRef, (current) => {
            if (current) {
                return { ...current, ...updates };
            }
            return current;
        });
    }, []);

    const spawnObstacle = useCallback(() => {
        if (!isGameMasterRef.current) return;

        const lanes = [0, 1, 2];
        const occupiedLanes = [];

        const numObstacles = Math.random() > 0.6 ? 2 : 1;

        for (let i = 0; i < numObstacles; i++) {
            const availableLanes = lanes.filter(l => !occupiedLanes.includes(l));
            if (availableLanes.length > 0) {
                const lane = availableLanes[Math.floor(Math.random() * availableLanes.length)];
                occupiedLanes.push(lane);
            }
        }
        const difficultyMultiplier = 1 + (gameState.round / 20);
        const speed = BASE_OBSTACLE_SPEED * Math.min(difficultyMultiplier, 1.8);

        const obstacleId = Date.now();

        const newObstacle = {
            id: obstacleId,
            lanes: occupiedLanes,
            y: -50,
            speed: speed,
            width: LANE_WIDTH - 20,
            height: 40
        };

        const obstacleRef = ref(database, `${GAME_REF}/obstacle`);
        set(obstacleRef, newObstacle);
    }, [gameState.round]);

    const checkCollision = useCallback((obstacle, playerPosition) => {
        const playerY = GAME_HEIGHT - 100;

        if (obstacle.lanes.includes(playerPosition) &&
            obstacle.y >= playerY - 120 &&
            obstacle.y <= playerY + 120) {
            return true;
        }
        return false;
    }, []);

    useEffect(() => {
        if (!isGameMasterRef.current || gameState.isGameOver || gameState.isPaused || !currentObstacle) {
            return;
        }

        const gameLoop = () => {
            if (!currentObstacle) return;

            const newY = currentObstacle.y + currentObstacle.speed;

            if (checkedObstacleIdRef.current !== currentObstacle.id &&
                newY >= GAME_HEIGHT - 180 &&
                newY <= GAME_HEIGHT - 20) {

                checkedObstacleIdRef.current = currentObstacle.id;

                if (checkCollision({ ...currentObstacle, y: newY }, currentVotePosition)) {
                    const newLives = gameState.lives - 1;

                    updateGameState({
                        lives: newLives,
                        combo: 0,
                        isGameOver: newLives <= 0
                    });

                    if (newLives <= 0) {
                        setTimeout(() => {
                            updateGameState({
                                position: 1,
                                score: 0,
                                lives: 3,
                                combo: 0,
                                isGameOver: false,
                                isPaused: false,
                                round: 0
                            });
                            onObstacleCleared();
                        }, 2000);
                    } else {
                        onObstacleCleared();
                    }

                    const obstacleRef = ref(database, `${GAME_REF}/obstacle`);
                    set(obstacleRef, null);
                } else {
                    const newCombo = gameState.combo + 1;
                    const comboMultiplier = Math.floor(newCombo / 5) + 1;
                    const points = 10 * comboMultiplier;

                    updateGameState({
                        score: gameState.score + points,
                        combo: newCombo,
                        round: gameState.round + 1
                    });

                    onObstacleCleared();
                    const obstacleRef = ref(database, `${GAME_REF}/obstacle`);
                    set(obstacleRef, null);
                }
            } else if (newY > GAME_HEIGHT + 50) {
                const obstacleRef = ref(database, `${GAME_REF}/obstacle`);
                set(obstacleRef, null);
            } else {
                const obstacleRef = ref(database, `${GAME_REF}/obstacle`);
                set(obstacleRef, { ...currentObstacle, y: newY });
            }

            animationFrameRef.current = requestAnimationFrame(gameLoop);
        };

        animationFrameRef.current = requestAnimationFrame(gameLoop);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [currentObstacle, gameState, currentVotePosition, checkCollision, updateGameState, onObstacleCleared]);

    const resetGame = useCallback(() => {
        if (!isGameMasterRef.current) return;

        updateGameState({
            position: 1,
            score: 0,
            lives: 3,
            combo: 0,
            isGameOver: false,
            isPaused: false,
            round: 0
        });
    }, [updateGameState]);

    const togglePause = useCallback(() => {
        if (!isGameMasterRef.current) return;

        updateGameState({ isPaused: !gameState.isPaused });
    }, [gameState.isPaused, updateGameState]);

    return {
        gameState,
        currentObstacle,
        spawnObstacle,
        resetGame,
        togglePause,
        GAME_HEIGHT,
        LANE_WIDTH,
        isGameMaster: isGameMasterRef.current
    };
}