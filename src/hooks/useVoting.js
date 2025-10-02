import { useState, useCallback, useRef } from 'react';

export const useVoting = () => {
    const [votes, setVotes] = useState({ left: 0, stay: 0, right: 0 });
    const [totalVotes, setTotalVotes] = useState(0);
    const lastPositionRef = useRef(1); // Remember last position (start at center)

    const getPercentages = useCallback(() => {
        if (totalVotes === 0) return { left: 0, stay: 0, right: 0 };
        return {
            left: Math.round((votes.left / totalVotes) * 100),
            stay: Math.round((votes.stay / totalVotes) * 100),
            right: Math.round((votes.right / totalVotes) * 100),
        };
    }, [votes, totalVotes]);

    const addVote = useCallback((direction) => {
        setVotes(prev => ({
            ...prev,
            [direction]: prev[direction] + 1
        }));
        setTotalVotes(prev => prev + 1);
    }, []);

    const getCurrentWinner = useCallback(() => {
        // If no votes yet, stay at last position
        if (totalVotes === 0) {
            return lastPositionRef.current;
        }

        const { left, stay, right } = votes;

        let newPosition;
        if (left >= stay && left >= right) {
            newPosition = 0; // left lane
        } else if (right >= stay && right >= left) {
            newPosition = 2; // right lane
        } else {
            newPosition = 1; // stay/center lane
        }

        lastPositionRef.current = newPosition; // Remember this position
        return newPosition;
    }, [votes, totalVotes]);

    const resetVotes = useCallback(() => {
        setVotes({ left: 0, stay: 0, right: 0 });
        setTotalVotes(0);
        // Don't reset lastPositionRef - keep the last position!
    }, []);

    return {
        votes,
        percentages: getPercentages(),
        totalVotes,
        currentPosition: getCurrentWinner(),
        addVote,
        resetVotes,
    };
};