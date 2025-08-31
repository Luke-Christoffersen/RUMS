import arrow from './assets/arrow.png';
// arrow is left facing default
import start from './assets/startButton.png';
import pause from './assets/pauseButton.png';
import './Rotation.css'
import { motion } from "motion/react";
import React, {useState, useEffect, useRef} from 'react'

export default function Rotation({repeats = 5}) {
    const [played, setPlayed] = useState(false);
    const [arrowVisible, setArrowVisible] = useState(false);
    const [paused, setPaused] = useState(false);
    const [reactionTime, setReactionTime] = useState(null);
    const [average, setAverage] = useState([]);
    const [displayAverage,setDisplayAverage] = useState(0);
    const [baseRotation, setBaseRotation] = useState(0);
    const [targetRotation, setTargetRotation] = useState(0);
    const [roundsLeft, setRoundsLeft] = useState(repeats);

    const startTimeRef = useRef(null);
    const listenerRef1 = useRef(null);
    const listenerRef2 = useRef(null);
    const endListener1 = useRef(null);
    const endListener2 = useRef(null);
    const initialPressedRef = useRef(false);
    const didRecordRef = useRef(false);
    
    
    const size = window.innerWidth > window.innerHeight ? window.innerHeight-145 : window.innerWidth-145;
    const arrowDelay = 7;

   function handleStart() {
    setPlayed(true);
    setPaused(true);
    initialPressedRef.current = false;
    didRecordRef.current = false;


    const randMult = Math.random() < 0.5 ? -1 : 1;
    const dir = Math.floor(Math.random() * 4); 
    const gameDelay = Math.random() * 3 + 1;

    let baseRotation = 0;
        switch (dir) {
            case 0: 
                baseRotation = 0; 
                listenerRef1.current = "ArrowLeft";
                listenerRef2.current = "KeyA";
                break;     // Left
            case 1: 
                baseRotation = 90; 
                listenerRef1.current = "ArrowUp";
                listenerRef2.current = "KeyW";
                break;    // Up
            case 2: 
                baseRotation = 180; 
                listenerRef1.current = "ArrowRight";
                listenerRef2.current = "KeyD";
                break;   // Right
            case 3: 
                baseRotation = 270; 
                listenerRef1.current = "ArrowDown";
                listenerRef2.current = "KeyS";
                break;   // Down
    }


        setBaseRotation(baseRotation);

        // 2. Calculate raw target rotation
        let rawTarget = baseRotation + randMult * 90;

        // 3. Adjust to force shortest path in correct direction
        if (randMult === 1 && rawTarget < baseRotation) {
            rawTarget += 360;  // force +90
        } else if (randMult === -1 && rawTarget > baseRotation) {
            rawTarget -= 360;  // force -90
        }

        setTargetRotation(rawTarget);

        // 4. For key listener matching, normalize to [0, 360)
        const normalizedTarget = ((rawTarget % 360) + 360) % 360;
        switch (normalizedTarget) {
            case 0:
                endListener1.current = "ArrowLeft";
                endListener2.current = "KeyA";
                break;
            case 90:
                endListener1.current = "ArrowUp";
                endListener2.current = "KeyW";
                break;
            case 180:
                endListener1.current = "ArrowRight";
                endListener2.current = "KeyD";
                break;
            case 270:
                endListener1.current = "ArrowDown";
                endListener2.current = "KeyS";
                break;
        }


            console.log(`Expected ${listenerRef1.current}/${baseRotation} to ${endListener1.current}/${targetRotation} with rotation ${randMult}`);
            setTimeout(() => {
                setPaused(false);
                setArrowVisible(true);
                startTimeRef.current = performance.now();
            }, gameDelay * 1000);
        }

        
    useEffect(() => {
        function handleKeyDown(e) {
            if (e.repeat) return;

            // First input check
            if (!initialPressedRef.current && (e.code === listenerRef1.current || e.code === listenerRef2.current)) {
                initialPressedRef.current = true;
                return;
            }

            // Second input check (only after first is valid)
            if (initialPressedRef.current && (e.code === endListener1.current || e.code === endListener2.current) && startTimeRef.current) {
                const reaction = performance.now() - startTimeRef.current;
                setReactionTime(reaction);
                setAverage(a => [...a, reaction]);
                initialPressedRef.current = false;
                startTimeRef.current = null;
                didRecordRef.current = true;
            }
        }

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    },[]);

    useEffect(() => {
        if (average.length === 0) {
            setDisplayAverage(0);
        } else {
            const total = average.reduce((acc, val) => acc + val, 0);
            setDisplayAverage(total / average.length);
        }
    }, [average]);

    function handleAnimationComplete(){
        setTimeout(() => {
            setArrowVisible(false);
            setPlayed(false);
            setPaused(false);
            startTimeRef.current = null; 
            initialPressedRef.current = false;
            if (roundsLeft-1 > 0) {
                setRoundsLeft(r => r-1);
                if (!didRecordRef.current) {
                    setReactionTime(1500);
                    setAverage(a => [...a, 1500]);
                }
                handleStart();
            } else {
                if (!didRecordRef.current) {
                    setReactionTime(1500);
                    setAverage(a => [...a, 1500]);
                }
                setRoundsLeft(0);
            }
        }, 750);
    }

    function startSequence() {
        setReactionTime(null);
        setAverage([]);
        setRoundsLeft(repeats);  // 1. Store how many rounds we want to play
        handleStart();           // 2. Start the first round
    }


    return (
        <div 
        id='game-container'
        className='visible-border'
        style={{ width: `${size}px`, height:  `${size}px`}}
        >
            {/* Game Info */}
            <div id='info-container'>
            <h3 id='times'>Time: {(reactionTime / 1000).toFixed(3)}s  Average: {(displayAverage / 1000).toFixed(3)}s</h3>
            <div id='repeats-container'>
               <h3>Reactions left in round:</h3>
               <h3 id='rounds'>{roundsLeft}</h3>
            </div>
            </div>
            {/* Start Button */}
            {!played && (
                <motion.img
                    id='start'
                    src={start}
                    alt='start'
                    style={{cursor: 'pointer'}}
                    onClick={() => startSequence()}
                />
            )}
            {/* Pause Button */}
            {paused && (
                <motion.img
                    id='pause'
                    src={pause}
                    alt='pause'
                />
            )}
            {/* Arrow */}
            {arrowVisible && (<motion.img
                id='arrow'
                src={arrow}
                alt="Arrow"
                initial={{rotate: baseRotation }}
                style={{ width: 250, height: 250 }}
                animate={played && {rotate: targetRotation }}
                onAnimationComplete={() => handleAnimationComplete()}
                transition={{delay: arrowDelay*0.016,  ease: "linear", duration: 0.3 }}
            />  )}
        </div>
    );
}
