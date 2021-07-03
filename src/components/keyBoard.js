import React, { useRef, useMemo } from "react";
import Keyboard from "react-simple-keyboard";
// import "react-simple-keyboard/build/css/index.css";
// import "./index.css";
import VietIME from '../utils/vietuni';
const vietIME = new VietIME();

export default function KeyBoard(props) {
    const { inputName, onChangeAll, input, rowId } = props;
    const keyboard = useRef(null);
    const layoutName = "default";

    useMemo(() => {
      const k = keyboard.current;
      delete input.ngaycamchuoc;
      if (k) k.setInput(input[inputName]);
      console.log('inputt', input);
      // keyboard.setInput(input);

    }, [input])
    useMemo(() => {
      console.log('RTTRTTTRRT');
      const k = keyboard.current;
      if (k) {
        // k.clearInput('tenkhach');
        // k.clearInput('dienthoai');
        // k.clearInput('monhang');
        // k.clearInput('loaivang');
        // k.clearInput('tongtrongluong');
        // k.clearInput('trongluonghot');
        // k.clearInput('tiencam');
        for (let key in k.input) {
          k.clearInput(key);
          // Use `key` and `value`
      }

      };
      console.log(k);
    }, [rowId])
    
    const commonKeyboardOptions = {
        onChange: (input) => onChange(input),
        onKeyPress: (button) => _onKeyPress(button),
        // onChangeAll: (inputObj) => onChangeAll(inputObj),
        inputName: inputName, 
        theme: "simple-keyboard hg-theme-default hg-layout-default",
        physicalKeyboardHighlight: true,
        syncInstanceInputs: true,
        mergeDisplay: true,
        debug: true
    };

    const keyboardOptions = {
        ...commonKeyboardOptions,
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
        },
        theme: "hg-theme-default myTheme1"
      };
    
      const keyboardNumPadOptions = {
        ...commonKeyboardOptions,
        layout: {
          default: [
            "1 2 3 L N",
            "4 5 6 K V",
            "7 8 9 B D",
            "000 0 . M T",
            "{space}"
          ]
        },
        buttonTheme: [
          {
            class: "hg-green",
            buttons: "L N K V B M D T"
          },
          {
            class: "hg-highlight",
            buttons: "Q q"
          }
        ]
      };

    const onChange = (input) => {
        // setState({
        //   input: input
        // });
        // console.log("Input changed", input);
    };

    const _onKeyPress = async (e) => {
        const k = keyboard.current;
        const val = await vietIME.targetRun(e, k.getInput());
        await k.setInput(val ? val : k.getInput());
        if (val) k.setCaretPosition(val.length, val.length);
        onChangeAll(k.input)
    };

    return (
        // <div>
        //     <Keyboard
        //         keyboardRef={(r) => (keyboard.current = r)}
        //         inputName={inputName}
        //         onChangeAll={(inputObj) => onChangeAll(inputObj)}
        //         onKeyPress={(button) => onKeyPress(button)}
        //     />
        // </div>
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
                    keyboardRef={(r) => (keyboard.current = r)}
                    layoutName={layoutName}
                    {...keyboardOptions}
                />
            </div>
        </div>
    );
}