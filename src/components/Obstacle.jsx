import React from 'react';
import { motion } from 'framer-motion';

export const Obstacle = ({ obstacle, laneWidth }) => {
    const getObstacleX = (lane) => {
        return lane * laneWidth + 10;
    };

    const getColor = (type) => {
        return type === 'fast' ? 'bg-red-600' : 'bg-orange-500';
    };

    return (
        <motion.div
            className={`absolute ${getColor(obstacle.type)} rounded-lg shadow-lg`}
            style={{
                left: getObstacleX(obstacle.lane),
                top: obstacle.y,
                width: obstacle.width,
                height: obstacle.height,
            }}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
        >
            <div className="w-full h-full flex items-center justify-center text-white font-bold">
                {obstacle.type === 'fast' ? '⚡' : '🚧'}
            </div>
        </motion.div>
    );
};