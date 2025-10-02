import { useState, useEffect, useCallback, useRef } from 'react';

const BASE_OBSTACLE_SPEED = 1.2;
const GAME_HEIGHT = 600;
const LANE_WIDTH = 200;

export const useGameLoop = (currentVotePosition, onObstacleCleared) => {
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

    // Update player position based on votes in real-time
    useEffect(() => {
        setGameState(prev => ({
            ...prev,
            position: currentVotePosition
        }));
    }, [currentVotePosition]);

    const spawnObstacle = useCallback(() => {
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

        setCurrentObstacle({
            id: obstacleId,
            lanes: occupiedLanes,
            y: -50,
            speed: speed,
            width: LANE_WIDTH - 20,
            height: 40
        });
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
        if (gameState.isGameOver || gameState.isPaused || !currentObstacle) return;

        const gameLoop = () => {
            setCurrentObstacle(prev => {
                if (!prev) return null;

                const newY = prev.y + prev.speed;

                // Check if we haven't checked this obstacle yet
                if (checkedObstacleIdRef.current !== prev.id && newY >= GAME_HEIGHT - 180 && newY <= GAME_HEIGHT - 20) {
                    checkedObstacleIdRef.current = prev.id;

                    // Use currentVotePosition directly instead of gameState.position
                    if (checkCollision({ ...prev, y: newY }, currentVotePosition)) {
                        const newLives = gameState.lives - 1;

                        setGameState(g => ({
                            ...g,
                            lives: newLives,
                            combo: 0,
                            isGameOver: newLives <= 0
                        }));

                        if (newLives <= 0) {
                            setTimeout(() => {
                                setGameState({
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

                        return null;
                    } else {
                        const newCombo = gameState.combo + 1;
                        const comboMultiplier = Math.floor(newCombo / 5) + 1;
                        const points = 10 * comboMultiplier;

                        setGameState(g => ({
                            ...g,
                            score: g.score + points,
                            combo: newCombo,
                            round: g.round + 1
                        }));

                        onObstacleCleared();
                        return null;
                    }
                }

                if (newY > GAME_HEIGHT + 100) {
                    onObstacleCleared();
                    return null;
                }

                return { ...prev, y: newY };
            });

            animationFrameRef.current = requestAnimationFrame(gameLoop);
        };

        animationFrameRef.current = requestAnimationFrame(gameLoop);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [gameState, currentObstacle, checkCollision, onObstacleCleared, currentVotePosition]);

    const resetGame = useCallback(() => {
        setGameState({
            position: 1,
            score: 0,
            lives: 3,
            combo: 0,
            isGameOver: false,
            isPaused: false,
            round: 0
        });
        setCurrentObstacle(null);
    }, []);

    const togglePause = useCallback(() => {
        setGameState(prev => ({
            ...prev,
            isPaused: !prev.isPaused
        }));
    }, []);

    return {
        gameState,
        currentObstacle,
        spawnObstacle,
        resetGame,
        togglePause,
        GAME_HEIGHT,
        LANE_WIDTH
    };
};