import React from 'react';

export const GameStats = ({ score, lives, combo }) => {
    return (
        <div className="flex justify-between items-center w-full px-4">
            {/* Score */}
            <div className="flex flex-col items-start">
                <div className="text-white/50 text-xs uppercase tracking-wider">Score</div>
                <div className="text-white text-2xl font-bold">{score}</div>
            </div>

            {/* Combo */}
            <div className="flex flex-col items-center">
                <div className="text-white/50 text-xs uppercase tracking-wider">Combo</div>
                <div className="text-white text-2xl font-bold">
                    {combo}x
                </div>
            </div>

            {/* Lives */}
            <div className="flex flex-col items-end">
                <div className="text-white/50 text-xs uppercase tracking-wider">Lives</div>
                <div className="flex gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-all ${i < lives ? 'bg-white' : 'bg-white/20'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};