export function useNumberFormat(number: number) {
  const formatter = Intl.NumberFormat('en', { notation: 'standard' });
  const formattedNumber = formatter.format(number);
  return formattedNumber;
}

// const formattedNumber = useNumberFormat(1248900);
// console.log(formattedNumber);
