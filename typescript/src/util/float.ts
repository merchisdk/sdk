export function kahanSum(values: Iterable<number>) {
  /* Return the kahan summation of the input number array */
  let accumulator = 0;
  let compensation = 0;
  for (const value of values) {
    const y = value - compensation;
    const t = accumulator + y;
    compensation = (t - accumulator) - y; 
    accumulator = t; 
  }
  return accumulator;
}
