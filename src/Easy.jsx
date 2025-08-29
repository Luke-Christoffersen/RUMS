import arrow from './assets/arrow.png';
// arrow is left facing default
import start from './assets/startButton.png';
import pause from './assets/pauseButton.png';
import './Easy.css'
import { motion } from "motion/react";
import React, {useState, useEffect, useRef} from 'react'

export default function Easy({repeats = 5}) {
    const [played, setPlayed] = useState(false);
    const [arrowVisible, setArrowVisible] = useState(false);
    const [paused, setPaused] = useState(false);
    const [arrowDelay, setArrowDelay] = useState(7);
    const [reactionTime, setReactionTime] = useState(null);
    const [average, setAverage] = useState([]);
    const [displayAverage,setDisplayAverage] = useState(0);
    const [rotation, setRotation] = useState(0);
    const [movementX, setMovementX] = useState(0);
    const [movementY, setMovementY] = useState(0);
    const [roundsLeft, setRoundsLeft] = useState(repeats);
   

    const startTimeRef = useRef(null);
    const listenerRef1 = useRef(null);
    const listenerRef2 = useRef(null);
    const didRecordRef = useRef(false);
    
    let size = window.innerWidth > window.innerHeight ? window.innerHeight-145 : window.innerWidth-145;

    function handleStart() {
    setPlayed(true);
    setPaused(true);
    didRecordRef.current = false;

    const dir = Math.floor(Math.random() * 4); 
    const gameDelay = Math.random() * 3 + 1;

    const arrowDistance = size * 0.5 - 50;

    switch (dir) {
        case 0:
            setRotation(0);
            setMovementX(-arrowDistance);
            setMovementY(0);
            listenerRef1.current = "ArrowLeft";
            listenerRef2.current = "KeyA";
            break;
        case 1:
            setRotation(90);
            setMovementX(0);
            setMovementY(-arrowDistance);
            listenerRef1.current = "ArrowUp";
            listenerRef2.current = "KeyW";
            break;
        case 2:
            setRotation(180);
            setMovementX(arrowDistance);
            setMovementY(0);
            listenerRef1.current = "ArrowRight";
            listenerRef2.current = "KeyD";
            break;
        case 3:
            setRotation(270);
            setMovementX(0);
            setMovementY(arrowDistance);
            listenerRef1.current = "ArrowDown";
            listenerRef2.current = "KeyS";
            break;
    }

        setTimeout(() => {
            setPaused(false);
            setArrowVisible(true);
            startTimeRef.current = performance.now();
        }, gameDelay * 1000);
    }


    useEffect(() => {
        function handleKeyDown(e) {
            if (e.repeat) return; // This is here so that if the key is held it wont continually increase the time
                if ((e.code === listenerRef1.current || e.code === listenerRef2.current) && startTimeRef.current) {
                    const reaction = performance.now() - startTimeRef.current;
                    setReactionTime(reaction);
                    setAverage(a => [...a, reaction]);
                    didRecordRef.current = true;
                } else  if (startTimeRef.current) {
                    setReactionTime(1000);
                    setAverage(a => [...a, 1000]);
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
        setArrowVisible(false);
        setPlayed(false);
        setPaused(false);
        startTimeRef.current = null; 
        if (roundsLeft-1 > 0) {
                setRoundsLeft(r => r-1);
                 if (!didRecordRef.current) {
                    setReactionTime(1000);
                    setAverage(a => [...a, 1000]);
                }
                handleStart();
            } else {
                setRoundsLeft(0);
            }
    }

    function startSequence() {
        setRoundsLeft(repeats);
        handleStart();
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
            <div id='delay-container'>
               <h3>Delay (60 FPS):</h3>
                <input 
                    type="number" 
                    value={arrowDelay} 
                    max={99}
                    min={0}
                    id='delay-input'
                    onChange={d => setArrowDelay(Number(d.target.value))}
                />
                <h3>frames</h3>
            </div>
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
                id='arrow-directional'
                src={arrow}
                alt="Arrow"
                style={{ rotate: `${rotation}deg`, width: 100, height: 100 }}
                animate={played ? { x: movementX, y: movementY } : { x: 0, y: 0 }}
                onAnimationComplete={() => handleAnimationComplete()}
                transition={{delay: arrowDelay*0.016,  ease: "linear", duration: 0.6 }}
            />  )}
        </div>
    );
}
