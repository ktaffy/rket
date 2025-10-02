import React from 'react';

export const VotingPanel = ({
    votes,
    percentages,
    totalVotes,
    votingActive,
    onVote
}) => {
    const getButtonStyle = (direction) => {
        if (!votingActive) {
            return "flex-1 p-4 rounded-lg font-medium text-lg bg-white/5 text-white/30 cursor-not-allowed border border-white/10";
        }
        return "flex-1 p-4 rounded-lg font-medium text-lg bg-white/10 text-white hover:bg-white/20 active:bg-white/30 cursor-pointer border border-white/20 transition-all";
    };

    const getDirectionIcon = (direction) => {
        if (direction === 'left') return '←';
        if (direction === 'right') return '→';
        return '●';
    };

    return (
        <div className="w-full">
            {/* Voting Buttons */}
            <div className="flex gap-3">
                <button
                    className={getButtonStyle('left')}
                    onClick={() => votingActive && onVote('left')}
                    disabled={!votingActive}
                >
                    <div className="text-2xl mb-1">{getDirectionIcon('left')}</div>
                    <div className="text-xs uppercase opacity-70">Left</div>
                    <div className="text-lg font-bold mt-1">{votes.left}</div>
                </button>

                <button
                    className={getButtonStyle('stay')}
                    onClick={() => votingActive && onVote('stay')}
                    disabled={!votingActive}
                >
                    <div className="text-2xl mb-1">{getDirectionIcon('stay')}</div>
                    <div className="text-xs uppercase opacity-70">Stay</div>
                    <div className="text-lg font-bold mt-1">{votes.stay}</div>
                </button>

                <button
                    className={getButtonStyle('right')}
                    onClick={() => votingActive && onVote('right')}
                    disabled={!votingActive}
                >
                    <div className="text-2xl mb-1">{getDirectionIcon('right')}</div>
                    <div className="text-xs uppercase opacity-70">Right</div>
                    <div className="text-lg font-bold mt-1">{votes.right}</div>
                </button>
            </div>

            {/* Percentage bars */}
            <div className="flex gap-3 mt-3">
                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-white transition-all" style={{ width: `${percentages.left}%` }} />
                </div>
                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-white transition-all" style={{ width: `${percentages.stay}%` }} />
                </div>
                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-white transition-all" style={{ width: `${percentages.right}%` }} />
                </div>
            </div>
        </div>
    );
};