import React from 'react';

export const GameStats = ({ score, lives, combo }) => {
    const getComboColor = () => {
        if (combo >= 20) return 'text-purple-500';
        if (combo >= 10) return 'text-yellow-500';
        if (combo >= 5) return 'text-green-500';
        return 'text-gray-400';
    };

    const getComboMultiplier = () => {
        return Math.floor(combo / 5) + 1;
    };

    return (
        <div className="flex justify-between items-center w-full max-w-4xl mx-auto p-4 bg-gray-800 rounded-lg shadow-lg">
            <div className="flex flex-col items-center">
                <div className="text-sm text-gray-400 uppercase tracking-wide">Score</div>
                <div className="text-3xl font-bold text-white">{score}</div>
            </div>

            <div className="flex flex-col items-center">
                <div className="text-sm text-gray-400 uppercase tracking-wide">Combo</div>
                <div className={`text-3xl font-bold ${getComboColor()} transition-colors duration-300`}>
                    {combo}x
                </div>
                {combo >= 5 && (
                    <div className="text-xs text-yellow-400 animate-pulse">
                        {getComboMultiplier()}x Multiplier! 🔥
                    </div>
                )}
            </div>

            <div className="flex flex-col items-center">
                <div className="text-sm text-gray-400 uppercase tracking-wide">Lives</div>
                <div className="flex gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className={`w-8 h-8 rounded-full transition-all duration-300 ${i < lives
                                    ? 'bg-red-500 shadow-lg shadow-red-500/50 scale-100'
                                    : 'bg-gray-700 scale-75'
                                }`}
                        >
                            {i < lives && (
                                <div className="w-full h-full flex items-center justify-center text-white">
                                    ❤️
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};