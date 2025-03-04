export type ClosedHourCommand = {
  initialHour: string;
  finalHour: string;
  userId?: number;
};

export type ClosedHourValidationError = Partial<
  Pick<ClosedHourCommand, "finalHour" | "initialHour">
> & {
  userId?: string;
};
