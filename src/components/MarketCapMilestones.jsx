import React, { useState, useEffect } from 'react';

export const MarketCapMilestones = ({ contractAddress }) => {
    const [currentMarketCap, setCurrentMarketCap] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    const milestones = [
        {
            target: 30000,
            rewards: [
                'DEX Fee Paid',
                '3 holders x 0.01 SOL'
            ]
        },
        {
            target: 50000,
            rewards: [
                'Face Reveal',
                '5 holders x 0.01 SOL'
            ]
        },
        {
            target: 75000,
            rewards: [
                '8 holders x 0.015 SOL'
            ]
        },
        {
            target: 100000,
            rewards: [
                'Buyback & Lock',
                '10 holders x 0.02 SOL'
            ]
        }
    ];

    useEffect(() => {
        if (!contractAddress) {
            setIsLoading(false);
            return;
        }

        const fetchMarketCap = async () => {
            console.log('Fetching market cap...', new Date().toLocaleTimeString());

            try {
                const response = await fetch(
                    `https://api.dexscreener.com/latest/dex/tokens/${contractAddress}`
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch market cap');
                }

                const data = await response.json();
                console.log('API Response:', data);

                if (data.pairs && data.pairs.length > 0) {
                    const marketCap = parseFloat(data.pairs[0].marketCap || 0);
                    console.log('New market cap:', marketCap);
                    setCurrentMarketCap(marketCap);
                    setLastUpdated(new Date().toLocaleTimeString());
                    setError(null);
                } else {
                    setError('No trading pairs found');
                }
            } catch (err) {
                console.error('Error fetching market cap:', err);
                setError('Failed to load market cap');
            } finally {
                setIsLoading(false);
            }
        };

        // Fetch immediately
        fetchMarketCap();

        // Update every 5 seconds
        const interval = setInterval(() => {
            console.log('Interval tick');
            fetchMarketCap();
        }, 5000);

        console.log('Interval started');

        return () => {
            console.log('Cleaning up interval');
            clearInterval(interval);
        };
    }, [contractAddress]);

    const formatMarketCap = (value) => {
        if (value >= 1000000) {
            return `$${(value / 1000000).toFixed(2)}M`;
        }
        if (value >= 1000) {
            return `$${(value / 1000).toFixed(0)}K`;
        }
        return `$${value.toFixed(0)}`;
    };

    const getProgress = (target) => {
        return Math.min((currentMarketCap / target) * 100, 100);
    };

    const isCompleted = (target) => currentMarketCap >= target;
    const isCurrent = (target, index) => {
        if (index === 0) return currentMarketCap < target;
        const prevTarget = milestones[index - 1].target;
        return currentMarketCap >= prevTarget && currentMarketCap < target;
    };

    return (
        <div className="w-72">
            {/* Header */}
            <div className="mb-12">
                <div className="text-white/40 text-xs uppercase tracking-widest font-medium mb-1">
                    Market Cap
                </div>
                <div className="text-white text-2xl font-bold tracking-tight">
                    {isLoading ? (
                        <span className="text-white/40">Loading...</span>
                    ) : error ? (
                        <span className="text-white/40 text-sm">{error}</span>
                    ) : (
                        formatMarketCap(currentMarketCap)
                    )}
                </div>
                {/* Debug info - remove this later */}
                {lastUpdated && (
                    <div className="text-white/20 text-xs mt-1">
                        Updated: {lastUpdated}
                    </div>
                )}
            </div>

            {/* Milestones */}
            <div className="space-y-10">
                {milestones.map((milestone, index) => {
                    const completed = isCompleted(milestone.target);
                    const current = isCurrent(milestone.target, index);
                    const progress = getProgress(milestone.target);

                    return (
                        <div key={milestone.target}>
                            <div className="flex items-baseline justify-between mb-3">
                                <div className={`text-2xl font-bold tracking-tight ${completed ? 'text-white/25 line-through' : current ? 'text-white' : 'text-white/40'
                                    }`}>
                                    {formatMarketCap(milestone.target)}
                                </div>
                                {completed && (
                                    <div className="text-white/25 text-sm font-medium">COMPLETED</div>
                                )}
                            </div>

                            {!completed && current && (
                                <div className="mb-4">
                                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-white transition-all duration-500 ease-out"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <div className="text-white/40 text-xs mt-1.5 font-medium">
                                        {progress.toFixed(1)}%
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1.5 ml-0.5">
                                {milestone.rewards.map((reward, idx) => (
                                    <div
                                        key={idx}
                                        className={`text-sm leading-relaxed ${completed ? 'text-white/20' : current ? 'text-white/60' : 'text-white/35'
                                            }`}
                                    >
                                        {reward}
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