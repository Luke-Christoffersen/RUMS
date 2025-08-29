
import sound1 from "./assets/Cancel.mp3";
import sound2 from "./assets/Cursor-Move.mp3";
import sound3 from "./assets/SaveLoad.mp3";
import sound4 from "./assets/Select.mp3";
import start from './assets/startButton.png';
import speaker from "./assets/audio.png";
import pause from "./assets/pauseButton.png";
import './Auditory.css'
import React, {useState, useEffect, useRef} from 'react'

export default function Auditory({repeats = 5}) {
    const [played, setPlayed] = useState(false);
    const [arrowVisible, setArrowVisible] = useState(false);
    const [sounded, setSounded] = useState(false);
    const [reactionTime, setReactionTime] = useState(null);
    const [average, setAverage] = useState([]);
    const [displayAverage,setDisplayAverage] = useState(0);
    const [paused, setPaused] = useState(false);

    const startTimeRef = useRef(null);
    const listenerRef1 = useRef(null);
    const listenerRef2 = useRef(null);
    const didRecordRef = useRef(false);
    const roundsLeftRef = useRef(repeats);

    let size = window.innerWidth > window.innerHeight ? window.innerHeight-145 : window.innerWidth-145;

    function handleStart() {
    setPlayed(true);
    setPaused(true);
    didRecordRef.current = false;

    const randomIndex = Math.floor(Math.random() * 4);
    const gameDelay = Math.random() * 3 + 1;

    switch (randomIndex) {
        case 0:
            listenerRef1.current = "ArrowLeft";
            listenerRef2.current = "KeyA";
            break;
        case 1:
            listenerRef1.current = "ArrowUp";
            listenerRef2.current = "KeyW";
            break;
        case 2:
            listenerRef1.current = "ArrowRight";
            listenerRef2.current = "KeyD";
            break;
        case 3:
            listenerRef1.current = "ArrowDown";
            listenerRef2.current = "KeyS";
            break;
    }

        setTimeout(() => {
            setPaused(false);
            setSounded(true);
            playSound(randomIndex);
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
                    handleSoundComplete();
                } else if (startTimeRef.current) {
                    setReactionTime(2000);
                    setAverage(a => [...a, 2000]);
                    didRecordRef.current = true;
                    handleSoundComplete();
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

    function handleSoundComplete(){
        setPlayed(false);
        setSounded(false);
        startTimeRef.current = null; 

        console.log((roundsLeftRef.current));

        
        if (roundsLeftRef.current-1 > 0) {
                --roundsLeftRef.current;
                 if (!didRecordRef.current) {
                    setReactionTime(2000);
                    setAverage(a => [...a, 2000]);
                }
                handleStart();
            } else {
                roundsLeftRef.current = 0;
            }
    }

    function startSequence() {
        roundsLeftRef.current = repeats;
        handleStart();
    }

    function playSound(index){
        switch (index) {
            case 0: new window.Audio(sound1).play(); break;
            case 1: new window.Audio(sound2).play(); break;
            case 2: new window.Audio(sound3).play(); break;
            case 3: new window.Audio(sound4).play(); break;
        }
        
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
               <h3 id='rounds'>{roundsLeftRef.current}</h3>
            </div>
            </div>
            {/* Start Button */}
            {!played && (
                <img
                    id='start'
                    src={start}
                    alt='start'
                    style={{cursor: 'pointer'}}
                    onClick={() => startSequence()}
                />
            )}
            {/* Paused Button */}
            { paused && (
                <img
                    id="pause"
                    src={pause}
                    alt="pause"
                />
            )}
            {/* Speaker Button */}
            {sounded && (
                <img
                    id='speaker'
                    src={speaker}
                    alt='speaker'
                />
            )}
        </div>
    );
}
