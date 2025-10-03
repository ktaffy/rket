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
        <div className="min-h-screen bg-black py-8">
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
                <div className="flex gap-8 items-start justify-center">
                    {/* LEFT SIDEBAR - Market Cap Milestones */}
                    <div className="hidden xl:block pt-20 ">
                        <MarketCapMilestones contractAddress="BJTkv1hk9pxRjVgFvEruxV7YHZKmSifJEdm7fCTspump" />
                    </div>

                    {/* CENTER - Main Game */}
                    <div className="max-w-4xl w-full">
                        {/* Header */}
                        <div className="text-center mb-6">
                                <h1 className="text-5xl font-black text-white tracking-tighter">
                                    $RKET
                                </h1>
                        </div>

                        {/* Stats */}
                        <div className="mb-6">
                            <GameStats
                                score={gameState.score}
                                lives={gameState.lives}
                                combo={gameState.combo}
                            />
                        </div>

                        {/* Game Canvas */}
                        <div className="mb-6">
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
                        <div className="text-center mb-4">
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

                    {/* RIGHT SIDEBAR - Score Milestones (placeholder) */}
                    <div className="hidden xl:block w-48 pt-20">
                        <ScoreMilestones currentScore={gameState.score} />
                    </div>
                </div>
            </div>
        </div>
    );
};