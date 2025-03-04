/**
 * Converts a given time in the specified timezone to UTC.
 *
 * @param time - Time in the format "hh:mm".
 * @param timezone - IANA timezone string.
 *
 * @returns A string in the format "hh:mm" representing the time in UTC.
 * @example
 * convertTimeToUTC("12:34", "America/New_York") // returns "17:34"
 */
export function convertTimeToUTC(
  time: string,
  timezone: string = "America/Sao_Paulo",
) {
  const [hours, minutes] = time.split(":").map(Number);
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();

  // Create a Date object in the specified timezone.
  const localDate = new Date(
    new Date(year, month, day, hours, minutes).toLocaleString("en-US", {
      timeZone: timezone,
    }),
  );

  const utcHours = localDate.getUTCHours().toString().padStart(2, "0");
  const utcMinutes = localDate.getUTCMinutes().toString().padStart(2, "0");

  return `${utcHours}:${utcMinutes}`;
}

/**
 * Converts a given time in UTC to the specified timezone.
 *
 * @param utcTime - Time in the format "hh:mm" in UTC.
 * @param timezone - IANA timezone string.
 *
 * @returns A string in the format "hh:mm" representing the time in the specified timezone.
 * @example
 * convertUTCToTimezone("17:34", "America/New_York") // returns "13:34"
 */
export function convertUTCToTimezone(utcTime: string, timezone: string) {
  const [hours, minutes] = utcTime.split(":").map(Number);
  const now = new Date(); // Get current date/time in local timezone
  const utcDate = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      hours,
      minutes,
    ),
  );

  // Convert UTC time to the specified timezone
  const localTimeInTimezone = new Date(
    utcDate.toLocaleString("en-US", { timeZone: timezone }),
  );

  const localHours = localTimeInTimezone.getHours().toString().padStart(2, "0");
  const localMinutes = localTimeInTimezone
    .getMinutes()
    .toString()
    .padStart(2, "0");

  return `${localHours}:${localMinutes}`;
}
