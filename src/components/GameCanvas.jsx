import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const GameCanvas = ({
    gameState,
    obstacles,
    powerUps,
    gameHeight = 600,
    laneWidth = 200
}) => {
    const { position, lives, combo } = gameState;

    const totalWidth = laneWidth * 3;

    const getPlayerX = () => {
        return position * laneWidth + laneWidth / 2 - 40;
    };

    const getObstacleX = (lane) => {
        return lane * laneWidth + 10;
    };

    const getPowerUpStyle = (type) => {
        if (type === 'shield') {
            return { bg: 'bg-[#7ceaaf]', icon: '🛡️' };
        }
        return { bg: 'bg-[#ffa5c5]', icon: '⭐' };
    };

    const shouldShake = lives !== gameState.lives;

    // Professional Black & White Rocket Component
    const Rocket = () => (
        <div className="relative w-full h-full">
            {/* Exhaust trail */}
            <motion.div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8"
                animate={{
                    height: [20, 35, 20],
                    opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                    repeat: Infinity,
                    duration: 0.3,
                    ease: "easeInOut"
                }}
            >
                <div className="w-full h-full bg-gradient-to-t from-white/50 via-white/30 to-transparent rounded-full blur-sm" />
            </motion.div>

            {/* Rocket body */}
            <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-[0_4px_12px_rgba(255,255,255,0.3)]">
                {/* Main body */}
                <ellipse cx="40" cy="45" rx="18" ry="28" fill="#ffffff" />

                {/* Nose cone */}
                <path d="M 40 10 Q 50 20 50 35 L 30 35 Q 30 20 40 10" fill="#e0e0e0" />

                {/* Window */}
                <circle cx="40" cy="35" r="6" fill="#333333" opacity="0.8" />
                <circle cx="40" cy="35" r="4" fill="#666666" opacity="0.6" />

                {/* Left fin */}
                <path d="M 22 50 L 15 70 L 28 60 Z" fill="#e0e0e0" />

                {/* Right fin */}
                <path d="M 58 50 L 65 70 L 52 60 Z" fill="#e0e0e0" />

                {/* Bottom stabilizers */}
                <rect x="32" y="68" width="5" height="8" rx="2" fill="#cccccc" />
                <rect x="43" y="68" width="5" height="8" rx="2" fill="#cccccc" />

                {/* Highlights */}
                <ellipse cx="35" cy="30" rx="3" ry="8" fill="#ffffff" opacity="0.5" />
            </svg>
        </div>
    );

    return (
        <div className="relative w-full max-w-4xl mx-auto">
            <motion.div
                className="relative bg-black overflow-hidden"
                style={{
                    width: totalWidth,
                    height: gameHeight,
                    margin: '0 auto'
                }}
                animate={shouldShake ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.3 }}
            >
                {/* Obstacles */}
                <AnimatePresence>
                    {obstacles.map((obstacle) => (
                        obstacle.lanes.map((lane, idx) => (
                            <motion.div
                                key={`${obstacle.id}-${lane}`}
                                className="absolute bg-orange-500 rounded-lg shadow-lg"
                                style={{
                                    left: getObstacleX(lane),
                                    top: obstacle.y,
                                    width: obstacle.width,
                                    height: obstacle.height,
                                }}
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="w-full h-full flex items-center justify-center text-white font-bold">
                                    🚧
                                </div>
                            </motion.div>
                        ))
                    ))}
                </AnimatePresence>

                {/* Power-ups */}
                <AnimatePresence>
                    {powerUps.map((powerUp) => {
                        const style = getPowerUpStyle(powerUp.type);
                        return (
                            <motion.div
                                key={powerUp.id}
                                className="absolute"
                                style={{
                                    left: getObstacleX(powerUp.lane) + 60,
                                    top: powerUp.y,
                                    width: 60,
                                    height: 60,
                                }}
                                initial={{ scale: 0, rotate: 0 }}
                                animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: 360
                                }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{
                                    scale: { repeat: Infinity, duration: 1 },
                                    rotate: { duration: 2, repeat: Infinity, ease: "linear" }
                                }}
                            >
                                <svg viewBox="0 0 60 60" className="w-full h-full drop-shadow-[0_0_12px_rgba(124,234,175,0.8)]">
                                    <circle cx="30" cy="30" r="25" fill={style.bg === 'bg-[#7ceaaf]' ? '#7ceaaf' : '#ffa5c5'} opacity="0.9" />
                                    <circle cx="30" cy="30" r="20" fill="white" opacity="0.3" />
                                    <circle cx="30" cy="30" r="15" fill={style.bg === 'bg-[#7ceaaf]' ? '#6cd99f' : '#ff8cb5'} />
                                    <text x="30" y="38" fontSize="20" textAnchor="middle" fill="white">
                                        {style.icon}
                                    </text>
                                </svg>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {/* Player rocket */}
                <motion.div
                    className="absolute bottom-20"
                    style={{
                        width: 80,
                        height: 80,
                    }}
                    animate={{
                        left: getPlayerX(),
                        scale: combo > 10 ? [1, 1.05, 1] : 1,
                    }}
                    transition={{
                        left: { duration: 0.3, ease: "easeOut" },
                        scale: { repeat: Infinity, duration: 0.5 }
                    }}
                >
                    <Rocket />
                </motion.div>

                {/* Game Over overlay */}
                <AnimatePresence>
                    {gameState.isGameOver && (
                        <motion.div
                            className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="text-center">
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", duration: 0.6 }}
                                >
                                    <div className="text-7xl font-black text-white mb-4 tracking-tight">
                                        GAME OVER
                                    </div>
                                    <div className="text-white/50 text-sm uppercase tracking-wider mb-2">
                                        Final Score
                                    </div>
                                    <div className="text-5xl font-bold text-white">
                                        {gameState.score}
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Lane position indicators */}
            <div className="flex justify-center mt-6 gap-3">
                {[0, 1, 2].map((lane) => (
                    <motion.div
                        key={lane}
                        animate={{
                            scale: position === lane ? 1 : 0.85
                        }}
                    >
                        <div
                            className={`w-20 h-1 rounded-full transition-all duration-300 ${position === lane ? 'bg-white' : 'bg-white/20'
                                }`}
                        />
                    </motion.div>
                ))}
            </div>
        </div>
    );
};