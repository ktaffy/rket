import React from 'react';

export const VotingPanel = ({
    votes,
    percentages,
    totalVotes,
    votingActive,
    onVote
}) => {
    const getButtonStyle = (direction) => {
        const baseStyle = "flex-1 p-6 rounded-lg font-bold text-xl transition-all duration-100 relative overflow-hidden";

        if (!votingActive) {
            return `${baseStyle} bg-gray-400 text-gray-600 cursor-not-allowed opacity-50`;
        }

        const colors = {
            left: 'bg-blue-500 hover:bg-blue-600 active:scale-95 active:bg-blue-700',
            stay: 'bg-purple-500 hover:bg-purple-600 active:scale-95 active:bg-purple-700',
            right: 'bg-red-500 hover:bg-red-600 active:scale-95 active:bg-red-700',
        };

        return `${baseStyle} ${colors[direction]} text-white shadow-lg hover:shadow-xl cursor-pointer`;
    };

    const renderVoteBar = (direction) => {
        const percentage = percentages[direction];
        return (
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-black bg-opacity-20">
                <div
                    className="h-full bg-white bg-opacity-60 transition-all duration-200"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        );
    };

    const getDirectionIcon = (direction) => {
        if (direction === 'left') return '←';
        if (direction === 'right') return '→';
        return '●';
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6">
            {/* Vote Status */}
            <div className="text-center mb-4">
                <div className="text-2xl font-semibold text-white">
                    Total Votes: {totalVotes}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                    Keep spamming to control the rocket!
                </div>
            </div>

            {/* Voting Buttons */}
            <div className="flex gap-4">
                {['left', 'stay', 'right'].map(direction => (
                    <button
                        key={direction}
                        onClick={() => onVote(direction)}
                        disabled={!votingActive}
                        className={getButtonStyle(direction)}
                    >
                        <div className="relative z-10">
                            <div className="text-3xl mb-2">
                                {getDirectionIcon(direction)}
                            </div>
                            <div className="text-lg">{direction.toUpperCase()}</div>
                            <div className="text-sm mt-2 opacity-80">
                                {votes[direction]} ({percentages[direction]}%)
                            </div>
                        </div>
                        {renderVoteBar(direction)}
                    </button>
                ))}
            </div>

            {/* Instructions */}
            {votingActive && (
                <div className="text-center mt-4 text-gray-400">
                    Click rapidly to increase your direction's votes! 🚀
                </div>
            )}
        </div>
    );
};