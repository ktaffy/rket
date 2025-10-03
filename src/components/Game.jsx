import React, { useCallback, useRef, useEffect } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { GameCanvas } from './GameCanvas';
import { VotingPanel } from './VotingPanel';
import { GameStats } from './GameStats';
import { useGameLoop } from '../hooks/useGameLoop';
import { useVoting } from '../hooks/useVoting';
import { MarketCapMilestones } from './MarketCapMilestones';
import { ScoreMilestones } from './ScoreMilestones';

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
        <div className="h-screen bg-black overflow-hidden flex items-center">
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
                <div className="flex gap-6 items-center justify-center max-w-[1600px] mx-auto">
                    {/* LEFT SIDEBAR - Market Cap Milestones */}
                    <div className="hidden xl:block w-64 flex-shrink-0">
                        <MarketCapMilestones contractAddress="BJTkv1hk9pxRjVgFvEruxV7YHZKmSifJEdm7fCTspump" />
                    </div>

                    {/* CENTER - Main Game */}
                    <div className="w-full max-w-4xl flex-shrink-0">
                        {/* Header */}
                        <div className="text-center mt-6 mb-4 relative">
                            <h1 className="text-5xl font-black text-white tracking-tighter">
                                $RKET
                            </h1>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-3">
                                <a
                                    href="https://github.com/ktaffy/rket"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:opacity-70 transition-opacity"
                                >
                                    <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                </a>
                                <a
                                    href="https://x.com/i/communities/1234567890"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:opacity-70 transition-opacity"
                                >
                                    <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="mb-4">
                            <GameStats
                                score={gameState.score}
                                lives={gameState.lives}
                                combo={gameState.combo}
                            />
                        </div>

                        {/* Game Canvas */}
                        <div className="mb-4">
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

                        {/* Instructions */}
                        <div className="text-center mb-3">
                            <p className="text-white/50 text-sm">
                                Spam to vote where rocket goes
                            </p>
                        </div>

                        {/* Voting Panel */}
                        <div>
                            <VotingPanel
                                votes={votes}
                                percentages={percentages}
                                totalVotes={totalVotes}
                                votingActive={!gameState.isGameOver && !gameState.isPaused}
                                onVote={addVote}
                            />
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR - Score Milestones */}
                    <div className="hidden xl:block w-64 flex-shrink-0">
                        <ScoreMilestones currentScore={gameState.score} />
                    </div>
                </div>
            </div>
        </div>
    );
};