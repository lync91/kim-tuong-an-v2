import { createTextColumn } from 'react-datasheet-grid'

export const vndColumn = createTextColumn<number | null>({
  alignRight: true,
  formatBlurredInput: (value) =>{
    return typeof value === 'number' ? new Intl.NumberFormat().format(value) : ''
  },
  parseUserInput: (value) => {
    console.log(value);
    
    const number = parseFloat(value)
    return !isNaN(number) ? Math.round(number) : null
  },
  parsePastedValue: (value) => {
    const number = parseFloat(value)
    return !isNaN(number) ? Math.round(number) : null
  },
})