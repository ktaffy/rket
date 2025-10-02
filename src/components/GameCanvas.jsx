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
            return { bg: 'bg-blue-400', icon: '🛡️' };
        }
        return { bg: 'bg-yellow-400', icon: '⭐' };
    };

    const shouldShake = lives !== gameState.lives;

    return (
        <div className="relative w-full max-w-4xl mx-auto">
            <motion.div
                className="relative bg-gray-900 rounded-lg overflow-hidden shadow-2xl border-4 border-gray-700"
                style={{
                    width: totalWidth,
                    height: gameHeight,
                    margin: '0 auto'
                }}
                animate={shouldShake ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.3 }}
            >
                <div className="absolute inset-0 flex">
                    {[0, 1, 2].map((lane) => (
                        <div
                            key={lane}
                            className="flex-1 border-r-2 border-gray-800 border-dashed"
                            style={{ width: laneWidth }}
                        />
                    ))}
                </div>

                <div className="absolute top-4 left-0 right-0 flex">
                    {['LEFT', 'CENTER', 'RIGHT'].map((label, idx) => (
                        <div
                            key={idx}
                            className="flex-1 text-center text-gray-600 font-bold text-sm"
                            style={{ width: laneWidth }}
                        >
                            {label}
                        </div>
                    ))}
                </div>

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

                <AnimatePresence>
                    {powerUps.map((powerUp) => {
                        const style = getPowerUpStyle(powerUp.type);
                        return (
                            <motion.div
                                key={powerUp.id}
                                className={`absolute ${style.bg} rounded-full shadow-lg border-4 border-white`}
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
                                <div className="w-full h-full flex items-center justify-center text-2xl">
                                    {style.icon}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                <motion.div
                    className="absolute bottom-20 bg-gradient-to-br from-green-400 to-green-600 rounded-lg shadow-2xl"
                    style={{
                        width: 80,
                        height: 80,
                    }}
                    animate={{
                        left: getPlayerX(),
                        scale: combo > 10 ? [1, 1.1, 1] : 1,
                    }}
                    transition={{
                        left: { duration: 0.3, ease: "easeInOut" },
                        scale: { duration: 0.5, repeat: combo > 10 ? Infinity : 0 }
                    }}
                >
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                        🚀
                    </div>

                    {lives > 3 && (
                        <motion.div
                            className="absolute inset-0 rounded-lg border-4 border-blue-400"
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1, repeat: Infinity }}
                        />
                    )}

                    {combo >= 10 && (
                        <motion.div
                            className="absolute inset-0 rounded-lg bg-yellow-400 opacity-30 blur-xl"
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                        />
                    )}
                </motion.div>

                <AnimatePresence>
                    {combo >= 5 && (
                        <motion.div
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                        >
                            <div className="text-6xl font-bold text-yellow-400 drop-shadow-2xl animate-pulse">
                                {combo}x COMBO! 🔥
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {gameState.isGameOver && (
                        <motion.div
                            className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="text-center">
                                <motion.div
                                    className="text-6xl font-bold text-red-500 mb-4"
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", duration: 0.5 }}
                                >
                                    GAME OVER
                                </motion.div>
                                <div className="text-3xl text-white mb-2">
                                    Final Score: {gameState.score}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            <div className="flex justify-center mt-4 gap-4">
                {[0, 1, 2].map((lane) => (
                    <div
                        key={lane}
                        className={`w-16 h-2 rounded-full transition-all duration-300 ${position === lane
                                ? 'bg-green-500 shadow-lg shadow-green-500/50'
                                : 'bg-gray-700'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};