import React, { useRef, useMemo } from "react";
import Keyboard from "react-simple-keyboard";

export default function NumPad(props) {
  const { inputName, onChangeAll, input, curInput, rowId } = props;
  const keyboard = useRef(null);
  const layoutName = "default";

  useMemo(() => {
    const k = keyboard.current;
    if (k) k.setInput(curInput, inputName);

  }, [curInput, inputName])
  useMemo(() => {
    const k = keyboard.current;
    if (k) {
      for (let key in k.input) {
        k.clearInput(key);
        // Use `key` and `value`
      }

    };
    console.log(k);
  }, [rowId])

  const commonKeyboardOptions = {
    onKeyPress: (button) => _onKeyPress(button),
    onChangeAll: (inputObj) => onChangeAll(inputObj),
    inputName: inputName,
    theme: "simple-keyboard hg-theme-default",
    physicalKeyboardHighlight: true,
    syncInstanceInputs: true,
    mergeDisplay: true,
    debug: true
  };

  const keyboardNumPadOptions = {
    ...commonKeyboardOptions,
    layout: {
      default: [
        "1 2 3",
        "4 5 6",
        "7 8 9",
        "000 0 {backspace}",
      ],
    },
    display: {
      "{backspace}": "⌫"
    }
  };

  const onChange = (e) => {
    console.log('inputu', e);
    
    // setState({
    //   input: input
    // });
    // console.log("Input changed", input);
    // onChangeAll({...input, ...[inputName] = input});
  };

  const _onKeyPress = async (e) => {
    // const k = keyboard.current;
    // const val = await vietIME.targetRun(e, k.getInput());
    // await k.setInput(val ? val : k.getInput());
    // if (val) k.setCaretPosition(val.length, val.length);
    // onChangeAll(k.input)
  };

  return (
    <div style={{ paddingTop: 20 }}>
      <div className={"numpadContainer single-numpad"}>
        <div className="numPad">
          <Keyboard
            keyboardRef={(r) => (keyboard.current = r)}
            baseClass={"simple-keyboard-numpad"}
            {...keyboardNumPadOptions}
          />
        </div>
      </div>
    </div>
  );
}