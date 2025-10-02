import React, { useCallback, useRef, useEffect } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { GameCanvas } from './GameCanvas';
import { VotingPanel } from './VotingPanel';
import { GameStats } from './GameStats';
import { useGameLoop } from '../hooks/useGameLoop';
import { useVoting } from '../hooks/useVoting';

export const Game = () => {
    const { width, height } = useWindowSize();
    const spawnObstacleRef = useRef();

    const {
        votes,
        percentages,
        totalVotes,
        currentPosition,
        addVote,
        resetVotes,
    } = useVoting();

    const {
        gameState,
        currentObstacle,
        spawnObstacle,
        resetGame,
        togglePause,
        GAME_HEIGHT,
        LANE_WIDTH
    } = useGameLoop(currentPosition, () => {
        // When obstacle is cleared, reset votes and spawn new obstacle
        setTimeout(() => {
            resetVotes();
            if (spawnObstacleRef.current) {
                spawnObstacleRef.current();
            }
        }, 300);
    });

    useEffect(() => {
        spawnObstacleRef.current = spawnObstacle;
    }, [spawnObstacle]);

    useEffect(() => {
        spawnObstacle();
    }, [spawnObstacle]);

    const shouldShowConfetti = useCallback(() => {
        const { score, combo } = gameState;
        return combo >= 20 || (score % 500 === 0 && score > 0);
    }, [gameState]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8">
            {shouldShowConfetti() && !gameState.isGameOver && (
                <Confetti
                    width={width}
                    height={height}
                    recycle={false}
                    numberOfPieces={200}
                    gravity={0.3}
                />
            )}

            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
                        Obstacle Dodger
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Spam votes to control the rocket!
                    </p>
                </div>

                <div className="mb-6">
                    <GameStats
                        score={gameState.score}
                        lives={gameState.lives}
                        combo={gameState.combo}
                    />
                </div>

                <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
                    <div className="lg:w-48 flex justify-center lg:justify-end">
                        <div className="bg-gray-800 rounded-lg p-4 text-center">
                            <div className="text-sm text-gray-400 uppercase tracking-wide mb-2">
                                Current Leader
                            </div>
                            <div className="text-4xl font-bold text-green-400">
                                {currentPosition === 0 ? '←' : currentPosition === 2 ? '→' : '●'}
                            </div>
                            <div className="text-lg font-semibold text-white mt-2">
                                {currentPosition === 0 ? 'LEFT' : currentPosition === 2 ? 'RIGHT' : 'CENTER'}
                            </div>
                        </div>
                    </div>

                    <div className="flex-shrink-0">
                        <GameCanvas
                            gameState={gameState}
                            obstacles={currentObstacle ? [{
                                id: 1,
                                lanes: currentObstacle.lanes,
                                y: currentObstacle.y,
                                width: currentObstacle.width,
                                height: currentObstacle.height
                            }] : []}
                            powerUps={[]}
                            gameHeight={GAME_HEIGHT}
                            laneWidth={LANE_WIDTH}
                        />
                    </div>

                    <div className="lg:w-48 space-y-4">
                        <div className="bg-gray-800 rounded-lg p-4 text-gray-300 text-sm">
                            <h3 className="font-bold text-white mb-2">🎮 How to Play</h3>
                            <ul className="space-y-2">
                                <li>• SPAM your direction!</li>
                                <li>• Most votes = rocket moves there</li>
                                <li>• Real-time control</li>
                                <li>• Dodge obstacles</li>
                                <li>• Build combos!</li>
                            </ul>
                        </div>

                        <div className="space-y-2">
                            {!gameState.isGameOver && (
                                <button
                                    onClick={togglePause}
                                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                                >
                                    {gameState.isPaused ? '▶️ Resume' : '⏸️ Pause'}
                                </button>
                            )}

                            {gameState.isGameOver && (
                                <button
                                    onClick={resetGame}
                                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors text-lg"
                                >
                                    🔄 Play Again
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <VotingPanel
                        votes={votes}
                        percentages={percentages}
                        totalVotes={totalVotes}
                        votingActive={!gameState.isGameOver && !gameState.isPaused}
                        onVote={addVote}
                    />
                </div>

                {gameState.combo >= 10 && gameState.combo % 10 === 0 && (
                    <div className="fixed top-20 right-8 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-4 rounded-lg shadow-2xl animate-bounce">
                        <div className="text-xl font-bold">🔥 {gameState.combo}x COMBO!</div>
                        <div className="text-sm">You're on fire!</div>
                    </div>
                )}

                {gameState.score > 0 && gameState.score % 100 === 0 && (
                    <div className="fixed top-20 left-8 bg-gradient-to-r from-purple-400 to-pink-500 text-white px-6 py-4 rounded-lg shadow-2xl animate-bounce">
                        <div className="text-xl font-bold">🎯 {gameState.score} Points!</div>
                        <div className="text-sm">Milestone reached!</div>
                    </div>
                )}
            </div>
        </div>
    );
};