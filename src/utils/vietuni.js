/*
    VietIMEW: an implementation of Vietnamese Input Method Editor for web browsers.
    It efficiently works with IE, FireFox. It also works with Opera, Netscape Navigator and Safari.
    	
    Copyright (C) 2007, by Conbodien ( http://www.nue.ci.i.u-tokyo.ac.jp/~duc/vime/ )
	
    Licensed under the Apache License, Version 2.0 (the "License"); 
    you may not use this file except in compliance with the License. 
    You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 
	
    Unless required by applicable law or agreed to in writing, software distributed 
    under the License is distributed on an "AS IS" BASIS, 
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
    See the License for the specific language governing permissions and limitations under the License. 
*/


var g_arrVnVowel = new Array(
    new Array(0x41, 0xC0, 0xC1, 0x1EA2, 0xC3, 0x1EA0),              // A    0
    new Array(0xC2, 0x1EA6, 0x1EA4, 0x1EA8, 0x1EAA, 0x1EAC),        // AA   1
    new Array(0x102, 0x1EB0, 0x1EAE, 0x1EB2, 0x1EB4, 0x1EB6),      //  AW   2
    new Array(0x61, 0xE0, 0xE1, 0x1EA3, 0xE3, 0x1EA1),             //  a    3
    new Array(0xE2, 0x1EA7, 0x1EA5, 0x1EA9, 0x1EAB, 0x1EAD),       //  aa   4
    new Array(0x103, 0x1EB1, 0x1EAF, 0x1EB3, 0x1EB5, 0x1EB7),       // aw   5 
    new Array(0x45, 0xC8, 0xC9, 0x1EBA, 0x1EBC, 0x1EB8),           //  E    6 
    new Array(0xCA, 0x1EC0, 0x1EBE, 0x1EC2, 0x1EC4, 0x1EC6),       //  EE   7
    new Array(0x65, 0xE8, 0xE9, 0x1EBB, 0x1EBD, 0x1EB9),           //  e    8
    new Array(0xEA, 0x1EC1, 0x1EBF, 0x1EC3, 0x1EC5, 0x1EC7),       //  ee   9
    new Array(0x49, 0xCC, 0xCD, 0x1EC8, 0x128, 0x1ECA),            //  I    10
    new Array(0x69, 0xEC, 0xED, 0x1EC9, 0x129, 0x1ECB),            //  i    11
    new Array(0x4F, 0xD2, 0xD3, 0x1ECE, 0xD5, 0x1ECC),             //  O    12
    new Array(0xD4, 0x1ED2, 0x1ED0, 0x1ED4, 0x1ED6, 0x1ED8),       //  OO   13 
    new Array(0x1A0, 0x1EDC, 0x1EDA, 0x1EDE, 0x1EE0, 0x1EE2),      //  OW   14
    new Array(0x6F, 0xF2, 0xF3, 0x1ECF, 0xF5, 0x1ECD),             //  o    15
    new Array(0xF4, 0x1ED3, 0x1ED1, 0x1ED5, 0x1ED7, 0x1ED9),       //  oo   16  
    new Array(0x1A1, 0x1EDD, 0x1EDB, 0x1EDF, 0x1EE1, 0x1EE3),      //  ow   17 
    new Array(0x55, 0xD9, 0xDA, 0x1EE6, 0x168, 0x1EE4),				//  U    18 
    new Array(0x1AF, 0x1EEA, 0x1EE8, 0x1EEC, 0x1EEE, 0x1EF0),      //  UW   19
    new Array(0x75, 0xF9, 0xFA, 0x1EE7, 0x169, 0x1EE5),            //  u    20
    new Array(0x1B0, 0x1EEB, 0x1EE9, 0x1EED, 0x1EEF, 0x1EF1),      //  uw   21
    new Array(0x59, 0x1EF2, 0xDD, 0x1EF6, 0x1EF8, 0x1EF4),         //  Y    22
    new Array(0x79, 0x1EF3, 0xFD, 0x1EF7, 0x1EF9, 0x1EF5)         //  y    23
);

function GetVnVowelIndex(nCode) {
    console.log('nCode', nCode);
    var i, j;
    i = 0;
    j = 0;
    for (var ii in g_arrVnVowel) {
        j = 0;
        for (var jj in g_arrVnVowel[ii]) {
            if (g_arrVnVowel[ii][jj] === nCode) {
                return i * 10 + j;
            }
            j++;
        }
        i++;
    }
    return -1;
}


// var KEY_ESC = 27;
// var KEY_UP_ARROW = 38;
// var KEY_DOWN_ARROW = 40;
// var KEY_RETURN = 13;
// var KEY_LEFT_ARROW = 37;
// var KEY_RIGHT_ARROW = 39;

// var BR_TYPE_IE = 0;
// var BR_TYPE_NETSCAPE = 1;
// var BR_TYPE_FIREFOX = 2;
// var BR_TYPE_OPERA = 3;
// var BR_TYPE_SAFARI = 4;


// function getBrowserType() {
//     if (navigator.appName.indexOf("Netscape") !== -1) {
//         if (navigator.userAgent.indexOf("Firefox") !== -1) {
//             return BR_TYPE_FIREFOX;
//         }
//         if (navigator.userAgent.indexOf("Opera") !== -1) {
//             return BR_TYPE_OPERA;
//         }
//         if (navigator.userAgent.indexOf("Safari") !== -1) {
//             return BR_TYPE_SAFARI;
//         }
//         return BR_TYPE_NETSCAPE;
//     } else {
//         if (navigator.appName.indexOf("Microsoft") !== -1) {
//             return BR_TYPE_IE;
//         }
//     }
//     return BR_TYPE_NETSCAPE;
// }


// function GetKeyCode(ev) {
//     var brType = getBrowserType();
//     if (brType === BR_TYPE_IE) {
//         return window.event.keyCode;
//     }
//     if (ev) {
//         if (ev.which) return ev.which;
//         return ev.keyCode;
//     }
//     return 0;
// }

function GetKeyChar(ev) {
    if (ev.which) return ev.which;
    return ev.charCode;
}

// class TextRange
function NsTextRange(nStart, nEnd, txt) {
    this.m_nStart = nStart;
    this.m_nEnd = nEnd;
    this.text = txt;
}

// class VietIME
export default function VietIME() {
    this.m_target = null;
    this.m_nMode = 1;
}

VietIME.prototype.OFF = 0;
VietIME.prototype.TELEX = 1;
VietIME.prototype.VNI = 2;
VietIME.prototype.VIQR = 3;

VietIME.prototype.setTelexMode = function () {
    this.m_nMode = this.TELEX;
}
VietIME.prototype.setNormalMode = function () {
    this.m_nMode = this.OFF;
}

VietIME.prototype.setVNIMode = function () {
    this.m_nMode = this.VNI;
}

VietIME.prototype.setVIQRMode = function () {
    this.m_nMode = this.VIQR;
}

VietIME.prototype.getTargetRange = function () {
    if (this.m_target === null) return null;
    // var brType = getBrowserType();
    var selStart = this.m_target.selectionStart;
    var selEnd = this.m_target.selectionEnd;
    console.log(selStart);
    console.log(selEnd);
    if (selStart !== selEnd) return null;
    var strVal = this.m_target.value;
    var ch = 0;
    while (selStart > 0) {
        ch = strVal.charAt(selStart);
        if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
            if (selStart < selEnd) {
                selStart++;
                break;
            }
        }
        selStart--;
    }
    if (selStart > selEnd) selStart = selEnd;
    if (selEnd > selStart) {
        return new NsTextRange(selStart, selEnd, this.m_target.value.substring(selStart, selEnd));
    }
    return null;
}
VietIME.prototype.getTargetRange2 = function (value = '') {
    var selStart = value.length;
    var selEnd = value.length;
    if (selStart !== selEnd) return null;
    var strVal = value;
    var ch = 0;
    while (selStart > 0) {
        ch = strVal.charAt(selStart);
        if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
            if (selStart < selEnd) {
                selStart++;
                break;
            }
        }
        selStart--;
    }
    if (selStart > selEnd) selStart = selEnd;
    if (selEnd > selStart) {
        return new NsTextRange(selStart, selEnd, value.substring(selStart, selEnd));
    }
    return null;
}

VietIME.prototype.sendKeyStroke = function (nKeyCode, nCharCode) {
    var evKey = document.createEvent("KeyboardEvent");
    evKey.initKeyEvent('keypress', true, true, window, false, false, false, false, nKeyCode, nCharCode);
    if (this.m_target === null) {
        //alert( "null" );
        return;
    }
    this.m_target.dispatchEvent(evKey);
}


VietIME.prototype.getBaseChar = function (nIndex) {
    if ((nIndex % 10) !== 0) return '_';
    nIndex = parseInt(nIndex / 10);
    if (nIndex > 17 && nIndex <= 21) return 'u';
    if (nIndex > 9 && nIndex <= 17) return 'o';
    if (nIndex > 5 && nIndex <= 9) return 'e';
    if (nIndex <= 5) return 'a';
}
VietIME.prototype.getBaseCharEx = function (nIndex) {
    if (nIndex < 0) return '_';
    nIndex = parseInt(nIndex / 10);
    if (nIndex > 23) return '_';
    if (nIndex > 21 && nIndex <= 23) return 'y';
    if (nIndex > 17 && nIndex <= 21) return 'u';
    if (nIndex > 9 && nIndex <= 11) return 'i';
    if (nIndex > 11 && nIndex <= 17) return 'o';
    if (nIndex > 5 && nIndex <= 9) return 'e';
    if (nIndex <= 5) return 'a';

}
VietIME.prototype.getPrimitiveIndex = function (nIndex) {
    if ((nIndex % 10) !== 0) return 0;
    nIndex = parseInt(nIndex / 10);
    if (nIndex > 17 && nIndex <= 21) return 20;
    if (nIndex > 9 && nIndex <= 17) return 15;
    if (nIndex > 5 && nIndex <= 9) return 8;
    if (nIndex <= 5) return 3;
}
VietIME.prototype.processVNI678 = function (pCh, nCode, txtRange, evt) {
    var nShift = 0;
    var nInsertCode = -1;
    var bDiscard = false;
    var nIndex;
    var chVal = String.fromCharCode(nCode);
    var chval = ("" + chVal).toLowerCase().charAt(0);
    nIndex = GetVnVowelIndex(pCh);
    if (nIndex < -1) return false;
    if ((nIndex % 10) !== 0) return false;
    var nBaseIndex = parseInt(nIndex / 10);
    if (nBaseIndex === 10 || nBaseIndex === 11 || nBaseIndex === 22 || nBaseIndex === 23) return false;
    var pBaseChval = this.getBaseChar(nIndex);

    switch (this.m_nMode) {
        case this.TELEX:
            if (pBaseChval === chval) {
                if (nBaseIndex === 2 || nBaseIndex === 5 || nBaseIndex === 14 || nBaseIndex === 17) break;
                if (pBaseChval === 'a' || pBaseChval === 'o') {
                    if (pCh <= 0x7A) {
                        nInsertCode = g_arrVnVowel[nBaseIndex + 1][0];
                        bDiscard = true;
                    } else {
                        nInsertCode = g_arrVnVowel[nBaseIndex - 1][0];
                    }
                }
                if (pBaseChval === 'e') {
                    if (pCh <= 0x7A) {
                        nInsertCode = g_arrVnVowel[nBaseIndex + 1][0];
                        bDiscard = true;
                    } else nInsertCode = g_arrVnVowel[nBaseIndex - 1][0];
                }
            } else {
                if (chval === 'w') {
                    if (pBaseChval === 'a' || pBaseChval === 'o') {
                        if (nBaseIndex === 1 || nBaseIndex === 4 || nBaseIndex === 13 || nBaseIndex === 16) break;
                        nShift = 2;
                    } else if (pBaseChval === 'u') nShift = 1;
                    if (nShift > 0) {
                        if (pCh <= 0x7A) {
                            nInsertCode = g_arrVnVowel[nBaseIndex + nShift][0];
                            bDiscard = true;
                        } else nInsertCode = g_arrVnVowel[nBaseIndex - nShift][0];
                    }
                }
            }
            break;
        case this.VNI:
            if (chval === '6') {
                if (nBaseIndex === 2 || nBaseIndex === 5 || nBaseIndex === 14 || nBaseIndex === 17) break;
                if (pBaseChval === 'a' || pBaseChval === 'o' || pBaseChval === 'e') {
                    nShift = 1;
                }
            }
            if (chval === '7') {
                if (pBaseChval === 'o') {
                    if (nBaseIndex === 13 || nBaseIndex === 16) break;
                    nShift = 2;
                }
                if (pBaseChval === 'u') nShift = 1;
            }
            if (chval === '8') {
                if (pBaseChval === 'a') {
                    if (nBaseIndex === 1 || nBaseIndex === 4) break;
                    nShift = 2;
                }
            }
            if (nShift > 0) {
                if (pCh <= 0x7A) {
                    nInsertCode = g_arrVnVowel[nBaseIndex + nShift][0];
                    bDiscard = true;
                } else {
                    nInsertCode = g_arrVnVowel[nBaseIndex - nShift][0];
                }
            }
            break;
        case this.VIQR:
            if (chval === '^') {
                if (pBaseChval === 'a' || pBaseChval === 'o' || pBaseChval === 'e') {
                    if (nBaseIndex === 2 || nBaseIndex === 5 || nBaseIndex === 14 || nBaseIndex === 17) break;
                    nShift = 1;
                }
            }
            if (chval === '+') {
                if (pBaseChval === 'o') {
                    if (nBaseIndex === 13 || nBaseIndex === 16) break;
                    nShift = 2;
                }
                if (pBaseChval === 'u') nShift = 1;
            }
            if (chval === '(') {
                if (pBaseChval === 'a') {
                    if (nBaseIndex === 1 || nBaseIndex === 4) break;
                    nShift = 2;
                }
            }
            if (nShift > 0) {
                if (pCh <= 0x7A) {
                    nInsertCode = g_arrVnVowel[nBaseIndex + nShift][0];
                    bDiscard = true;
                } else {
                    nInsertCode = g_arrVnVowel[nBaseIndex - nShift][0];
                }
            }
            break;
        default:
            break;
    }
    if (nInsertCode > 0) {
        return this.replaceStr2(1, String.fromCharCode(nInsertCode), bDiscard, txtRange, evt);
    }
    return false;
}

VietIME.prototype.replaceStr = function (nChars, strToInsert, bDiscardEvent, txtRange, evt) {
    // var brType = getBrowserType();
    var strVal = this.m_target.value;
    var newStrVal = strVal.substring(0, txtRange.m_nEnd - nChars) + strToInsert + strVal.substring(txtRange.m_nEnd);
    this.m_target.value = newStrVal;
    if (bDiscardEvent) {
        if (evt.preventDefault) evt.preventDefault();
    }
}
VietIME.prototype.replaceStr2 = function (nChars, strToInsert, bDiscardEvent, txtRange, evt) {
    var strVal = this.m_target.value;
    console.log('1', strVal.substring(0, txtRange.m_nEnd - nChars));
    console.log('2', strToInsert);
    console.log('3', strVal.substring(txtRange.m_nEnd));
    var newStrVal = strVal.substring(0, txtRange.m_nEnd - nChars) + strToInsert + strVal.substring(txtRange.m_nEnd);
    return newStrVal.substring(0, newStrVal.length);
}
VietIME.prototype.setStringValue = function (nStart, nEnd, strToInsert, evt, bIgnore) {
    var newStrVal = this.m_target.value.substring(0, nStart) + strToInsert + this.m_target.value.substring(nEnd);
    this.m_target.value = newStrVal;
    if (bIgnore) {
        if (evt.preventDefault) { evt.preventDefault(); }
    }
}

VietIME.prototype.findAccentPos = function (txtRange) {
    var nCount = txtRange.text.length - 1;
    var nVowel1 = -1, nVowel2 = -1;
    var nIndex = -1;
    var nIndex2 = -1;
    var ch = '_';
    while (nCount >= 0) {
        ch = txtRange.text.charAt(nCount);
        nVowel1 = GetVnVowelIndex(txtRange.text.charCodeAt(nCount));
        if ("fsrxjz".indexOf(ch) >= 0) return -1;
        if (nVowel1 >= 0) {
            nIndex = nCount;
            break;
        }
        nCount--;
    }
    if (nVowel1 >= 0) {
        if (nCount > 0) {
            nCount--;
            nVowel2 = GetVnVowelIndex(txtRange.text.charCodeAt(nCount));
            var chVowel1 = this.getBaseCharEx(nVowel1);
            var chVowel2 = this.getBaseCharEx(nVowel2);

            if (nVowel2 >= 0) {
                nIndex2 = nCount;
                if (nIndex2 >= 0) {
                    var chPrevPrev = '_';
                    if (chVowel1 === 'e') return nIndex;
                    if (nIndex2 > 0) chPrevPrev = txtRange.text.charAt(nIndex2 - 1);
                    if (((chVowel2 === 'o' || chVowel2 === 'O') && (chVowel1 === 'a' || chVowel1 === 'A')) ||
                        ((chPrevPrev === 'q' || chPrevPrev === 'Q') && (chVowel2 === 'u' || chVowel2 === 'U')) ||
                        ((chPrevPrev === 'g' || chPrevPrev === 'G') && (chVowel2 === 'i' || chVowel2 === 'I')) ||
                        ((chVowel2 === 'u' || chPrevPrev === 'U') && (chVowel1 === 'o' || chVowel1 === 'O')) ||
                        ((chVowel2 === 'u' || chVowel2 === 'U') && (chVowel1 === 'y' || chVowel1 === 'Y'))) {
                        return nIndex;
                    }
                    //if( (chVowel2 === 'y' || chVowel2 === 'Y') && (nVowel1 <= 9 && nVowel1 >= 6) ) return nIndex;
                    if (nIndex < txtRange.text.length - 1) {
                        if (nIndex2 >= 0) return nIndex;
                    } else {
                        if (nIndex2 >= 0) return nIndex2;
                    }
                    //if( (chVowel2 === 'i' || chVowel2 === 'I') && (chVowel1 === 'a' || chVowel1 === 'A') ) return nIndex2;
                    //if( txtRange.text.length >= 4 ) return nIndex2;
                } else return nIndex2;
            }
        }
    }
    if (nIndex2 !== -1) return nIndex2;
    return nIndex;
}

VietIME.prototype.processAccent = function (nAccent, txtRange, evt) {
    console.log(nAccent);
    if (nAccent < 0) return;
    var nPos = this.findAccentPos(txtRange);
    console.log(nPos);
    if (nPos < 0) return;
    var strEnd = txtRange.text.substring(nPos + 1);
    var nIndex = GetVnVowelIndex(txtRange.text.charCodeAt(nPos));
    console.log('ind', nIndex);
    var nBaseIndex = parseInt(nIndex / 10);
    console.log(nBaseIndex);
    var nCurAccent = nIndex % 10;
    console.log(nCurAccent);
    if (nCurAccent !== nAccent) {
        console.log('OK');
        var nInsertCode = g_arrVnVowel[nBaseIndex][nAccent];
        strEnd = String.fromCharCode(nInsertCode) + strEnd;
        return this.replaceStr2(txtRange.text.length - nPos, strEnd, true, txtRange, evt);
    } else {	// delete accent
        nInsertCode = g_arrVnVowel[nBaseIndex][0];
        strEnd = String.fromCharCode(nInsertCode) + strEnd;
        return this.replaceStr2(txtRange.text.length - nPos, strEnd, false, txtRange, evt);
    }
}

VietIME.prototype.setTarget = function (target) {
    this.m_target = target;
}

VietIME.prototype.targetOnKeyPress = function (evt, target) {
    var chPrev;
    chPrev = '_';
    if (this.m_nMode === this.OFF) return;
    if (target) this.m_target = target;
    if (this.m_target === null) return;
    var nCode = GetKeyChar(evt);
    if (nCode === 0x0A || nCode === 0x0D || nCode === 0x09) return;
    var rg = this.getTargetRange();
    console.log('rg', rg);
    if (rg === null) { return; }
    if (rg.text === null) { return; }
    if (rg.text.length === 0) {
        if (nCode === 0x57 || nCode === 0x77) {
            this.replaceStr(0, String.fromCharCode(0x1AF + ((nCode === 0x77) ? 1 : 0)), true, rg, evt);
        }
        return;
    }
    var ch = rg.text.charCodeAt(rg.text.length - 1);

    // d, D
    if (ch === 0x44 || ch === 0x64) {
        if (((this.m_nMode === this.TELEX || this.m_nMode === this.VIQR) && (nCode === 0x44 || nCode === 0x64)) ||
            ((this.m_nMode === this.VNI) && (nCode === 0x39))) {
            this.replaceStr(1, String.fromCharCode(0x110 + ((ch === 0x64) ? 1 : 0)), true, rg, evt);
            return;
        }
    }
    // dd, DD
    if (ch === 0x111 || ch === 0x110) {
        if ((this.m_nMode === this.TELEX || this.m_nMode === this.VIQR) && (nCode === 0x44 || nCode === 0x64)) {
            this.replaceStr(1, String.fromCharCode(0x44 + ((ch === 0x111) ? 0x20 : 0)), false, rg, evt);
            return;
        }
    }
    // w, W
    if ((this.m_nMode === this.TELEX) && (nCode === 0x57 || nCode === 0x77)) {
        var nChPrevId = GetVnVowelIndex(ch);
        chPrev = this.getBaseCharEx(nChPrevId);
        if ((chPrev !== 'o') && (chPrev !== 'u') && (chPrev !== 'a')) {
            if ((ch !== 0x57) && (ch !== 0x77)) {
                this.replaceStr(0, String.fromCharCode(0x1AF + ((nCode === 0x77) ? 1 : 0)), true, rg, evt);
                return;
            }
        }
    }
    if (this.processVNI678(ch, nCode, rg, evt)) { return; }
    var chInput = String.fromCharCode(nCode).toLowerCase().charAt(0);
    switch (this.m_nMode) {
        case this.TELEX:
            this.processAccent("zfsrxj".indexOf(chInput), rg, evt);
            break;
        case this.VNI:
            this.processAccent("021345".indexOf(chInput), rg, evt);
            break;
        case this.VIQR:
            this.processAccent("-`'?~.".indexOf(chInput), rg, evt);
            break;
        default:
            break;
    }
}

VietIME.prototype.targetRun = function (evt, target) {
    var chPrev;
    chPrev = '_';
    console.log(target);
    if (target) this.m_target = {value: target};
    var nCode = evt.charCodeAt(0);
    if (nCode === 0x0A || nCode === 0x0D || nCode === 0x09) return;
    var rg = this.getTargetRange2(target);
    if (rg === null) { return; }
    if (rg.text === null) { return; }
    if (rg.text.length === 0) {
        if (nCode === 0x57 || nCode === 0x77) {
            return this.replaceStr2(0, String.fromCharCode(0x1AF + ((nCode === 0x77) ? 1 : 0)), true, rg, evt);
        }
        // return;
    }
    var ch = rg.text.charCodeAt(rg.text.length - 1);
    // d, D
    if (ch === 0x44 || ch === 0x64) {
        if (((this.m_nMode === this.TELEX || this.m_nMode === this.VIQR) && (nCode === 0x44 || nCode === 0x64)) ||
            ((this.m_nMode === this.VNI) && (nCode === 0x39))) {
            return this.replaceStr2(1, String.fromCharCode(0x110 + ((ch === 0x64) ? 1 : 0)), true, rg, evt);
        }
    }
    // dd, DD
    if (ch === 0x111 || ch === 0x110) {
        if ((this.m_nMode === this.TELEX || this.m_nMode === this.VIQR) && (nCode === 0x44 || nCode === 0x64)) {
            return this.replaceStr2(1, String.fromCharCode(0x44 + ((ch === 0x111) ? 0x20 : 0)), false, rg, evt);
        }
    }
    // w, W
    if ((this.m_nMode === this.TELEX) && (nCode === 0x57 || nCode === 0x77)) {
        var nChPrevId = GetVnVowelIndex(ch);
        chPrev = this.getBaseCharEx(nChPrevId);
        if ((chPrev !== 'o') && (chPrev !== 'u') && (chPrev !== 'a')) {
            if ((ch !== 0x57) && (ch !== 0x77)) {
                return this.replaceStr2(0, String.fromCharCode(0x1AF + ((nCode === 0x77) ? 1 : 0)), true, rg, evt);
            }
        }
    }
    if (this.processVNI678(ch, nCode, rg, evt)) { return this.processVNI678(ch, nCode, rg, evt) }
    var chInput = String.fromCharCode(nCode).toLowerCase().charAt(0);
    switch (this.m_nMode) {
        case this.TELEX:
            return this.processAccent("zfsrxj".indexOf(chInput), rg, evt);
        case this.VNI:
            this.processAccent("021345".indexOf(chInput), rg, evt);
            break;
        case this.VIQR:
            this.processAccent("-`'?~.".indexOf(chInput), rg, evt);
            break;
        default:
            break;
    }
}

VietIME.prototype.resetTarget = function (nCode) {
    if (nCode === 0x08 || nCode === 0xFF) return;
    this.m_target = null;
}
