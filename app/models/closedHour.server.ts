import type {
  ClosedHourValidationError,
  ClosedHourCommand,
} from "app/types/closedHour";
import db from "../db.server";
import type { ClosedHour } from "@prisma/client";
import isValidTimeFormat from "app/validations/timeValidation";
import { convertUTCToTimezone } from "app/utils/timeConversion";

/**
 * Retrieve a list of all closed hours.
 *
 * @returns Promise resolving to an array of closed hour objects.
 */
export async function getClosedHourList() {
  return db.closedHour.findMany({
    where: {
      deleted: false,
    },
  });
}

/**
 * Parses an array of ClosedHour objects into a simplified array of objects,
 * converting the time to the specified timezone.
 *
 * @param {ClosedHour[]} data - An array of ClosedHour objects to parse.
 * @param {string} timezone - The IANA timezone string to convert time to.
 *
 * @returns {Array<{ id: number; initialHour: string; finalHour: string }>}
 * An array of objects containing id, initialHour, and finalHour properties.
 */

export function parseClosedHour(data: ClosedHour[], timezone: string) {
  return data.map((hour) => {
    return {
      id: hour.id,
      initialHour: convertUTCToTimezone(hour.initialHour, timezone),
      finalHour: convertUTCToTimezone(hour.finalHour, timezone),
    };
  });
}

/**
 * Retrieve a single closed hour by id.
 *
 * @param {number} id - The id of the closed hour to retrieve.
 * @param {string} timezone - The IANA timezone string to convert initialHour to.
 *
 * @returns {Promise<{ id: number, initialHour: string, finalHour: string } | null>}
 * Promise resolving to the closed hour object if found, otherwise null.
 */
export async function getClosedHourById(id: number, timezone: string) {
  const data = await db.closedHour.findUnique({
    where: {
      id,
    },
  });

  return {
    id: data?.id,
    initialHour: convertUTCToTimezone(data?.initialHour || "", timezone),
    finalHour: convertUTCToTimezone(data?.finalHour || "", timezone),
  };
}

/**
 * Create a new closed hour.
 *
 * @param {ClosedHourCommand} data The data to create the closed hour with.
 *
 * @returns {Promise<ClosedHour>} Promise resolving to the newly created closed hour object.
 */
export async function createClosedHour(
  data: ClosedHourCommand,
): Promise<ClosedHour> {
  return await db.closedHour.create({
    data: {
      initialHour: data.initialHour,
      finalHour: data.finalHour,
      createdAt: new Date(),
      createdBy: data.userId,
      deleted: false,
      modifiedAt: new Date(),
      modifiedBy: data.userId,
    },
  });
}

/**
 * Updates an existing closed hour record by id.
 *
 * @param {ClosedHourCommand} data - The data containing updated fields for the closed hour.
 * @param {number} id - The id of the closed hour to update.
 *
 * @returns {Promise<ClosedHour>} - Promise resolving to the updated closed hour object.
 */

export async function updateClosedHour(data: ClosedHourCommand, id: number) {
  return await db.closedHour.update({
    where: {
      id,
    },
    data: {
      initialHour: data.initialHour,
      finalHour: data.finalHour,
      modifiedAt: new Date(),
      modifiedBy: data.userId,
    },
  });
}

/**
 * Soft deletes a closed hour record by id.
 *
 * @param {number} id - The id of the closed hour to delete.
 *
 * @returns {Promise<ClosedHour>} - Promise resolving to the deleted closed hour object.
 */
export async function deleteClosedHour(id: number) {
  return await db.closedHour.update({
    where: {
      id,
    },
    data: {
      deleted: true,
    },
  });
}

/**
 * Validates a closed hour command.
 *
 * @param {ClosedHourCommand} data The closed hour command to validate.
 *
 * @returns {ClosedHourValidationError}
 * If the object is empty, the closed hour command is valid.
 */
export function validateClosedHour(data: ClosedHourCommand) {
  // won't validate user for now
  const errors: ClosedHourValidationError = {};

  if (!data.initialHour || !isValidTimeFormat(data.initialHour)) {
    errors.initialHour = "Invalid initial hour";
  }

  if (!data.finalHour || !isValidTimeFormat(data.finalHour)) {
    errors.finalHour = "Invalid final hour";
  }

  return errors;
}
