import { ClosedHourCommand } from "app/types/closedHour";

/**
 * Checks if a store is closed based on the current time and an array of closed periods.
 * A closed period is an object with initialHour and finalHour properties, with the times represented as strings in the format "HH:MM".
 * The function takes into account periods that cross midnight.
 *
 * @param {ClosedHourCommand[]} closedHours - An array of closed periods.
 * @param {string} currentTime - The current time as a string in the format "HH:MM".
 * @returns {boolean} - True if the store is closed, false otherwise.
 */
export function checkStoreStatus(
  closedHours: ClosedHourCommand[],
  currentTime: string,
) {
  function getTimeInMinutes(timeString: string) {
    const [hours, minutes] = timeString.split(":");
    return parseInt(hours) * 60 + parseInt(minutes);
  }

  const currentMinutes = getTimeInMinutes(currentTime);

  let isClosed = false;

  for (let period of closedHours) {
    const initialTime = getTimeInMinutes(period.initialHour);
    const finalTime = getTimeInMinutes(period.finalHour);

    if (currentMinutes >= initialTime && currentMinutes <= finalTime) {
      isClosed = true;
      break;
    }

    if (initialTime > finalTime) {
      if (currentMinutes >= initialTime || currentMinutes <= finalTime) {
        isClosed = true;
        break;
      }
    }
  }

  return isClosed;
}
