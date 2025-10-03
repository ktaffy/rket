import React from 'react';

export const ScoreMilestones = ({ currentScore }) => {
    const milestones = [
        {
            target: 2000,
            rewards: [
                '2 holders × 0.008 SOL'
            ]
        },
        {
            target: 5000,
            rewards: [
                '3 holders × 0.01 SOL'
            ]
        },
        {
            target: 10000,
            rewards: [
                '4 holders × 0.012 SOL'
            ]
        },
        {
            target: 20000,
            rewards: [
                '5 holders × 0.015 SOL'
            ]
        }
    ];

    const formatScore = (value) => {
        if (value >= 1000) {
            return `${(value / 1000).toFixed(1)}K`;
        }
        return value.toString();
    };

    const getProgress = (target) => {
        return Math.min((currentScore / target) * 100, 100);
    };

    const isCompleted = (target) => currentScore >= target;
    const isCurrent = (target, index) => {
        if (index === 0) return currentScore < target;
        const prevTarget = milestones[index - 1].target;
        return currentScore >= prevTarget && currentScore < target;
    };

    const GiftBoxIcon = ({ className }) => (
        <svg
            className={className}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="20 12 20 22 4 22 4 12" />
            <rect x="2" y="7" width="20" height="5" />
            <line x1="12" y1="22" x2="12" y2="7" />
            <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
            <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
        </svg>
    );

    return (
        <div className="w-72">
            {/* Header */}
            <div className="mb-12 text-right">
                <div className="text-white/40 text-xs uppercase tracking-widest font-medium mb-1">
                    Top Score
                </div>
                <div className="text-white text-2xl font-bold tracking-tight">
                    {formatScore(currentScore)}
                </div>
            </div>

            {/* Milestones */}
            <div className="space-y-10">
                {milestones.map((milestone, index) => {
                    const completed = isCompleted(milestone.target);
                    const current = isCurrent(milestone.target, index);
                    const progress = getProgress(milestone.target);

                    return (
                        <div key={milestone.target}>
                            {/* Target with status */}
                            <div className="flex items-baseline justify-between mb-3">
                                <div className={`text-2xl font-bold tracking-tight ${completed ? 'text-white/25 line-through' :
                                        current ? 'text-white' :
                                            'text-white/40'
                                    }`}>
                                    {formatScore(milestone.target)}
                                </div>
                                {completed && (
                                    <div className="text-white/25 text-sm font-medium">COMPLETED</div>
                                )}
                            </div>

                            {/* Progress Bar - only for current milestone */}
                            {!completed && current && (
                                <div className="mb-4">
                                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-white transition-all duration-300 ease-out"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <div className="text-white/40 text-xs mt-1.5 font-medium text-right">
                                        {progress.toFixed(1)}%
                                    </div>
                                </div>
                            )}

                            {/* Rewards List - Right Aligned */}
                            <div className="space-y-1.5">
                                {milestone.rewards.map((reward, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex items-center justify-end gap-2 text-sm leading-relaxed ${completed ? 'text-white/20' :
                                                current ? 'text-white/60' :
                                                    'text-white/35'
                                            }`}
                                    >
                                        <span>{reward}</span>
                                        <GiftBoxIcon className="flex-shrink-0" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};