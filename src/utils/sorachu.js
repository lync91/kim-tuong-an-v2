const mangso = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
function dochangchuc(so, daydu) {
    let chuoi = '';
    const chuc = Math.floor(so / 10);
    const donvi = so % 10;
    if (chuc > 1) {
        chuoi = ' ' + mangso[chuc] + ' mươi';
        if (donvi === 1) {
            chuoi += ' mốt';
        }
    } else if (chuc === 1) {
        chuoi = ' mười';
        if (donvi === 1) {
            chuoi += ' một';
        }
    } else if (daydu && donvi > 0) {
        chuoi = ' lẻ';
    }
    if (donvi === 5 && chuc > 1) {
        chuoi += ' lăm';
    } else if (donvi > 1 || (donvi === 1 && chuc === 0)) {
        chuoi += ' ' + mangso[donvi];
    }
    return chuoi;
}
function docblock(_so, daydu) {
    let so = _so;
    let chuoi = '';
    const tram = Math.floor(so / 100);
    so = so % 100;
    if (daydu || tram > 0) {
        chuoi = ' ' + mangso[tram] + ' trăm';
        chuoi += dochangchuc(so, true);
    } else {
        chuoi = dochangchuc(so, false);
    }
    return chuoi;
}
function dochangtrieu(_so, _daydu) {
    let daydu = _daydu;
    let so = _so;
    let chuoi = '';
    const trieu = Math.floor(so / 1000000);
    so = so % 1000000;
    if (trieu > 0) {
        chuoi = docblock(trieu, daydu) + ' triệu';
        daydu = true;
    }
    const nghin = Math.floor(so / 1000);
    so = so % 1000;
    if (nghin > 0) {
        chuoi += docblock(nghin, daydu) + ' nghìn';
        daydu = true;
    }
    if (so > 0) {
        chuoi += docblock(so, daydu);
    }
    return chuoi;
}
const capitalize = (string = '') => {
  return string.replace(/^./, function (match) {
    return match.toUpperCase();
  });

}
export default function docso(_so) {
    let so = _so;
    if (so === 0) return mangso[0];
    let chuoi = '';
    let hauto = '';
    do {
        const ty = so % 1000000000;
        so = Math.floor(so / 1000000000);
        if (so > 0) {
            chuoi = dochangtrieu(ty, true) + hauto + chuoi;
        } else {
            chuoi = dochangtrieu(ty, false) + hauto + chuoi;
        }
        hauto = ' tỷ';
    } while (so > 0);
    return capitalize(chuoi);
}
