import React, { useRef, useEffect } from "react";
import Keyboard from "react-simple-keyboard";
// import "react-simple-keyboard/build/css/index.css";
import VietIME from '../utils/vietuni';
const vietIME = new VietIME();
console.log(vietIME);

export default function KeyBoad(props: any) {
    //   state = {
    //     layoutName: "default",
    //     input: "",
    //     keyboad: React.createRef()
    //   };
    const { value, onKeyBChange } = props

    const keyboard = useRef(null)
    const layoutName = "default";

    useEffect(() => {
        console.log(value);

    }, [value])

    const commonKeyboardOptions = {
        onChange: (input: any) => onChange(input),
        onKeyPress: (button: any) => _onKeyPress(button),
        theme: "simple-keyboard hg-theme-default hg-layout-default",
        physicalKeyboardHighlight: true,
        syncInstanceInputs: true,
        mergeDisplay: true,
        debug: true
    };

    const keyboardOptions = {
        ...commonKeyboardOptions,
        /**
         * Layout by:
         * Sterling Butters (https://github.com/SterlingButters)
         */
        layout: {
            default: [
                "` 1 2 3 4 5 6 7 8 9 0 - = {backspace}",
                "{tab} Q W E R T Y U I O P { } |",
                '{capslock} A S D F G H J K L : " {enter}',
                "{shiftleft} Z X C V B N M < > ? {shiftright}",
                "{controlleft} {altleft} {metaleft} {space} {metaright} {altright}"
            ],
            shift: [
                "~ ! @ # $ % ^ & * ( ) _ + {backspace}",
                "{tab} Q W E R T Y U I O P { } |",
                '{capslock} A S D F G H J K L : " {enter}',
                "{shiftleft} Z X C V B N M < > ? {shiftright}",
                "{controlleft} {altleft} {metaleft} {space} {metaright} {altright}"
            ]
        },
        display: {
            "{escape}": "esc ⎋",
            "{tab}": "tab ⇥",
            "{backspace}": "backspace ⌫",
            "{enter}": "enter ↵",
            "{capslock}": "caps lock ⇪",
            "{shiftleft}": "shift ⇧",
            "{shiftright}": "shift ⇧",
            "{controlleft}": "ctrl ⌃",
            "{controlright}": "ctrl ⌃",
            "{altleft}": "alt ⌥",
            "{altright}": "alt ⌥",
            "{metaleft}": "cmd ⌘",
            "{metaright}": "cmd ⌘"
        }
    };

    const keyboardControlPadOptions = {
        ...commonKeyboardOptions,
        layout: {
            default: [
                "{prtscr} {scrolllock} {pause}",
                "{insert} {home} {pageup}",
                "{delete} {end} {pagedown}"
            ]
        }
    };

    const keyboardArrowsOptions = {
        ...commonKeyboardOptions,
        layout: {
            default: ["{arrowup}", "{arrowleft} {arrowdown} {arrowright}"]
        }
    };

    const keyboardNumPadOptions = {
        ...commonKeyboardOptions,
        layout: {
            default: [
                "1 2 3 L N",
                "4 5 6 K V",
                "7 8 9 B D",
                "000 0 . M T",
            ]
        },
        // display: {
        //     "{bksp}": "⌫",
        // }
    };

    const keyboardNumPadEndOptions = {
        ...commonKeyboardOptions,
        layout: {
            default: ["{numpadsubtract}", "{numpadadd}", "{numpadenter}"]
        }
    };

    const onChange = (input: any) => {
        // setState({
        //   input: input
        // });
        // console.log("Input changed", input);
    };

    const _onKeyPress = async (e: any) => {
        const k: any = keyboard.current;
        const val = await vietIME.targetRun(e, k.getInput());
        k.setInput(val ? val : k.getInput());
        onKeyBChange(k.getInput());
    };
    return (
        <div style={{ paddingLeft: 50 }}>
            <div className={"keyboardContainer"}>
                <div className="numPad">
                    <Keyboard
                        baseClass={"simple-keyboard-numpad"}
                        {...keyboardNumPadOptions}
                    />
                </div>
                <Keyboard
                    baseClass={"simple-keyboard-main"}
                    keyboardRef={(r: any) => (keyboard.current = r)}
                    layoutName={layoutName}
                    {...keyboardOptions}
                />


            </div>
        </div>
    );
}
