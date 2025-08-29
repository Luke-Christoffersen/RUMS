import sound1 from "./assets/Cancel.mp3";
import sound2 from "./assets/Cursor-Move.mp3";
import sound3 from "./assets/SaveLoad.mp3";
import sound4 from "./assets/Select.mp3";
import Easy from "./Easy";
import Rotation from "./Rotation";
import Auditory from "./Auditory";
import logo from "./assets/logo.png";
import "./Container.css"
import React, {useState} from 'react';
export default function Container(){
    const [buttonState, setButtonState] = useState(1);
    const [repeats, setRepeats] = useState(5);

    function playSound(index){
            switch (index) {
                case 0: new window.Audio(sound1).play(); break;
                case 1: new window.Audio(sound2).play(); break;
                case 2: new window.Audio(sound3).play(); break;
                case 3: new window.Audio(sound4).play(); break;
            }
        }
    
    return(
        <div id="vertical-container">
            <div id="header">
                <img id="logo" src={logo}/>
                <h1 id="game-select">Game Select: &nbsp;</h1>
                <button className="button" id="button-1" onClick={() => setButtonState(1)}>Directional Reaction Test</button>
                <button className="button" id="button-2" onClick={() => setButtonState(2)}>Rotational Reaction Test</button>
                <button className="button" id="button-3" onClick={() => setButtonState(3)}>Auditory Reaction Test</button>
            </div>

            <div id="horizontal-container">
                <div id="left-container">
                    <div id="game-info">
                        {buttonState === 1 && (<div>
                            <h1 className="game-name">Directional Reaction Test</h1>
                            <p className="game-summary">Press the start button and then press the arrow key or WASD matching the arrow's direction.
                                The delay (in frames at 60 FPS) is how long the arrow takes to move after appearing.
                                For faster times, react to its direction, not movement.
                                Set how many reactions you want below. Good luck, have fun!</p>
                        </div>)}
                        {buttonState === 2 && (<div>
                            <h1 className="game-name">Rotational Reaction Test</h1>
                            <p className="game-summary">Press the start button and wait for the arrow to appear. After a short time, it rotates 90°.
                                First press the according arrow key or WASD for its original direction, then the arrow key or WASD for its 2nd direction.
                                Set how many reactions you want below. Good luck, have fun!</p>
                        </div>)}
                        {buttonState === 3 && (<div>
                            <h1 className="game-name">Auditory Reaction Test</h1>
                            <p id="special-game-summary">Press the start button and wait for the speaker icon. One of 4 sounds will play.
                                React to the sound and press the matching arrow key or WASD (see layout with sounds below).
                                Set how many reactions you want below. Good luck, have fun!</p>
                            <div id="arrow-keys">
                                <button className="key" id="Menu" onClick={() => playSound(1)}>Ping</button> {/*Up*/}
                                <div className="row">
                                    <button className="key" id="Cancel" onClick={() => playSound(0)}>Zip</button> {/*Left*/}
                                    <button className="key" id="Select" onClick={() => playSound(3)}>Click</button> {/*Down*/}
                                    <button className="key" id="Save" onClick={() => playSound(2)}>Glisten</button> {/*Right*/}
                                </div>
                            </div>
                        </div>)}
                        <div id="rounds-customizer">
                            <h2>Reactions per Round: </h2>
                            <input
                            id="rounds-input"
                            type="number"
                            value={repeats}
                            onChange={r => setRepeats(Number(r.target.value))}
                            min={1}
                            max={99}
                            />
                        </div>
                    </div>

                    <div id="footer">
                        <h1 id="about-name">About</h1>
                        <p id="about-summary">Reaction Time Under Mental Stack (RUMS) is a training tool and progress tracker for Esports that focuses on the ability to 
                            react while looking out for multiple different stimuli. In competitive gaming, it is often much more important to be 
                            able to quickly react to certain animations or sound queues rather than binary and obvious changes that are often used for reaction tests.</p>
                    </div>
                </div>

                <div id="game-holder">
                    {buttonState === 1 && (
                        <Easy repeats={repeats}/>
                    )}
                    {buttonState === 2 && ( 
                        <Rotation repeats={repeats}/>
                    )}
                    {buttonState === 3 && (
                        <Auditory repeats={repeats}/>
                    )}
                </div>
            </div>
        </div>
    );
}
