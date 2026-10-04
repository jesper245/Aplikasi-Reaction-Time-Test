'use client';

import { Session } from 'next-auth';
import { useState, useRef } from 'react';
import { useAlert, AlertTypes } from '@/app/context/AlertContext';

const totalTargets = 10; // Number of targets
const outerCircleSize = 100; // Diameter of the outer circle

interface AimTrainerBoxProps {
  session: Session | null;
  saveScore: (session: Session, startTime: number, endTime: number) => Promise<void>;
}

export default function AimTrainerBox(props: AimTrainerBoxProps) {
  const { show: showAlert } = useAlert();
  const [gameStarted, setGameStarted] = useState(false);
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
  const [clickCount, setClickCount] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null); // Unix timestamp in milliseconds
  const [endTime, setEndTime] = useState<number | null>(null); // Unix timestamp in milliseconds
  const [nextTargetCenter, setNextTargetCenter] = useState(true); // Track if the next target should be at the center
  const [targetHitTimes, setTargetHitTimes] = useState<number[]>([]); // Timestamps of each target hit
  const blueBackgroundRef = useRef<HTMLDivElement | null>(null); // Reference to the blue container

  // Generate random position within the blue container
  const randomPosition = (center = false) => {
    if (!blueBackgroundRef.current) return { x: 0, y: 0 };

    if (center) {
      // Return the center position
      const { width, height } = blueBackgroundRef.current.getBoundingClientRect();
      return { x: width / 2, y: height / 2 };
    }

    // Get the bounding rectangle of the blue background
    const { width, height } = blueBackgroundRef.current.getBoundingClientRect();

    // Safe area for the target to stay within the container
    const safeX = width - outerCircleSize; // Exclude the circle's size horizontally
    const safeY = height - outerCircleSize; // Exclude the circle's size vertically

    // Generate random positions within the safe area
    const x = Math.random() * safeX + outerCircleSize / 2; // Center alignment horizontally
    const y = Math.random() * safeY + outerCircleSize / 2; // Center alignment vertically

    return { x, y };
  };

  // Start the game
  const startGame = () => {
    setGameStarted(true);
    setClickCount(0);
    setEndTime(null);
    setStartTime(Date.now()); // Set start time as Unix timestamp in milliseconds
    setNextTargetCenter(true); // Start with the center target
    setTargetPosition(randomPosition(true)); // First target at the center
    setTargetHitTimes([]); // Reset target hit times
  };

  // Handle target click
  const handleTargetClick = async () => {
    const currentTime = Date.now(); // Timestamp of the current click
    setTargetHitTimes((prev) => [...prev, currentTime]); // Record the hit time

    if (clickCount + 1 >= totalTargets) {
      const gameEndTime = currentTime; // Use the current time as the end time
      setGameStarted(false);
      setEndTime(gameEndTime); // Set end time as Unix timestamp in milliseconds

      if (props.session && startTime) {
        try {
          await props.saveScore(props.session, startTime, gameEndTime);
          const timeInSeconds = ((gameEndTime - startTime) / 1000).toFixed(2);
          showAlert(AlertTypes.SUCCESS, `Score saved! Completed in ${timeInSeconds} seconds.`);
        } catch (error) {
          showAlert(AlertTypes.ERROR, 'Failed to save score. Please try again.');
          console.error('Error saving score:', error);
        }
      } else if (!props.session) {
        const timeInSeconds = ((gameEndTime - startTime!) / 1000).toFixed(2);
        showAlert(AlertTypes.INFO, `Great job! Completed in ${timeInSeconds} seconds. Login to save your scores.`);
      }
    } else {
      setClickCount((prev) => prev + 1);
      setNextTargetCenter((prev) => !prev); // Toggle between center and random
      setTargetPosition(randomPosition(!nextTargetCenter)); // Set next target position
    }
  };

  // Calculate total time taken in seconds
  const timeTaken =
    endTime && startTime ? ((endTime - startTime) / 1000).toFixed(2) : null; // Convert milliseconds to seconds

  // Calculate time taken for each target
  const calculateTargetTimes = () => {
    if (!startTime || targetHitTimes.length === 0) return [];

    return targetHitTimes.map((hitTime, index) => {
      const previousHitTime = index === 0 ? startTime : targetHitTimes[index - 1];
      return ((hitTime - previousHitTime) / 1000).toFixed(2); // Convert to seconds
    });
  };

  const targetTimes = calculateTargetTimes();

  return (
    <div className="">
      {/* Message for mobile users */}
      <div className="md:hidden flex items-center justify-center h-full">
        <p className="text-xl text-center">
          This game is not available on mobile devices. Please use a desktop or tablet.
        </p>
      </div>

      {/* Game Area */}
      <div
        ref={blueBackgroundRef}
        className="h-[550px] flex-1 flex-col items-center justify-center bg-blue-500 text-white relative hidden md:flex"
      >
        {!gameStarted && (
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Reaction Time Test</h1>
            <p className="mb-4 text-lg">Hit {totalTargets} targets as quickly as you can.</p>
            <button
              className="px-6 py-3 bg-green-500 rounded-sm hover:bg-green-600 cursor-pointer"
              onClick={startGame}
            >
              Start Game
            </button>
            {timeTaken && (
              <div className="mt-4">
                <p className="text-xl">You completed in {timeTaken} seconds!</p>
                {props.session && (
                  <div className="mt-4">
                    <a
                      href="/me/stats"
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 inline-block"
                    >
                      View My Stats
                    </a>
                  </div>
                )}
                <div className="mt-2">
                  <h2 className="text-lg font-semibold">Time per Target:</h2>
                  <ul>
                    {targetTimes.map((time, index) => (
                      <li key={index}>
                        Target {index + 1}: {time} seconds
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {gameStarted && (
          <>
            {/* Progress indicator */}
            <div className="absolute top-4 left-4 text-white bg-black bg-opacity-50 px-3 py-2 rounded">
              Target {clickCount + 1} of {totalTargets}
            </div>

            <div
              data-aim-target="true"
              className="absolute"
              style={{
                top: `${targetPosition.y}px`,
                left: `${targetPosition.x}px`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {/* Main Container */}
              <div className="relative flex items-center justify-center">
                {/* Outer Blue Circle */}
                {/* <div className="absolute border border-black rounded-full w-[100px] h-[100px]"></div> */}
                {/* Middle Blue Circle */}
                {/* <div className="absolute border border-black rounded-full w-[66.667px] h-[66.667px]"></div> */}
                {/* Vertical Line */}
                {/* <div className="absolute bg-black w-[2px] h-[100px]"></div> */}
                {/* Horizontal Line */}
                {/* <div className="absolute bg-black h-[2px] w-[100px]"></div> */}
                {/* Inner Red Circle (Clickable) */}
                <div
                  className="absolute bg-red-500 rounded-full w-[33.333px] h-[33.333px] cursor-pointer hover:bg-red-600 transition-colors"
                  onClick={handleTargetClick}
                ></div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}