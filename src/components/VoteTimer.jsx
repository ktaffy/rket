import React from 'react';

export const VoteTimer = ({ timeRemaining, totalTime = 5000, isMoving }) => {
    const percentage = (timeRemaining / totalTime) * 100;
    const seconds = Math.ceil(timeRemaining / 1000);

    const getColor = () => {
        if (isMoving) return 'text-green-500';
        if (percentage > 60) return 'text-green-500';
        if (percentage > 30) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-gray-700"
                    />
                    <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - percentage / 100)}`}
                        className={`${getColor()} transition-all duration-100`}
                        strokeLinecap="round"
                    />
                </svg>

                <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`text-4xl font-bold ${getColor()}`}>
                        {isMoving ? '🎯' : seconds}
                    </div>
                </div>
            </div>

            <div className="mt-2 text-sm font-semibold text-gray-600">
                {isMoving ? 'EXECUTING...' : 'VOTE NOW'}
            </div>
        </div>
    );
};