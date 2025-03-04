/**
 * Checks if a given time string is in the valid "hh:mm" format.
 *
 * @param {string} time - The time string to validate.
 * @returns {boolean} - Returns true if the time string is in the "hh:mm" format, otherwise false.
 */

export default function isValidTimeFormat(time: string) {
  const regex = /^([0-1]?[0-9]|2[0-3]):([0-5]?[0-9])$/;

  return regex.test(time);
}
