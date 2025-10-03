import { useState, useEffect, useCallback, useRef } from 'react';
import { ref, set, onValue, runTransaction } from 'firebase/database'
import { database } from '../firebase'

const GAME_REF = 'game/current'

export const useSharedVoting = () => {
    const [votes, setVotes] = useState({ left: 0, stay: 0, right: 0});
    const [totalVotes, setTotalVotes] = useState(0);
    const lastPositionRef = useRef(1)
    const [isConnected, setIsConnected] = useState(false)

    // Listen to Firebase votes in real-time
    useEffect(() => {
        const votesRef = ref(database, `${GAME_REF}/votes`);

        const unsubscribe = onValue(votesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setVotes({
                    left: data.left || 0,
                    stay: data.stay || 0,
                    right: data.right || 0
                });
                const total = (data.left || 0) + (data.stay || 0) + (data.right || 0);
                setTotalVotes(total);
                setIsConnected(true);
            } else {
                // Initialize if doesn't exist
                set(votesRef, { left: 0, stay: 0, right: 0 });
            }
        });

        return () => unsubscribe();
    }, []);

    const getPercentages = useCallback(() => {
        if (totalVotes === 0) return { left: 0, stay: 0, right: 0 };
        return {
            left: Math.round((votes.left / totalVotes) * 100),
            stay: Math.round((votes.stay / totalVotes) * 100),
            right: Math.round((votes.right / totalVotes) * 100),
        };
    }, [votes, totalVotes]);
    
    const addVote = useCallback((direction) => {
        const voteRef = ref(database, `${GAME_REF}/votes/${direction}`);

        // Use transaction to prevent race conditions
        runTransaction(voteRef, (currentValue) => {
            return (currentValue || 0) + 1;
        });
    }, []);
    
    const getCurrentWinner = useCallback(() => {
        if (totalVotes === 0) {
            return lastPositionRef.current;
        }

        const { left, stay, right } = votes;

        let newPosition;
        if (left >= stay && left >= right) {
            newPosition = 0;
        } else if (right >= stay && right >= left) {
            newPosition = 2;
        } else {
            newPosition = 1;
        }

        lastPositionRef.current = newPosition;
        return newPosition;
    }, [votes, totalVotes]);
    

    const resetVotes = useCallback(() => {
        const votesRef = ref(database, `${GAME_REF}/votes`);
        set(votesRef, { left: 0, stay: 0, right: 0 });
    }, []);
    
    return {
        votes,
        percentages: getPercentages(),
        totalVotes,
        currentPosition: getCurrentWinner(),
        addVote,
        resetVotes,
        isConnected
    };    
}

