import { json, LoaderFunctionArgs } from "@remix-run/node";
import {
  getClosedHourList,
  parseClosedHour,
} from "app/models/closedHour.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const response = await getClosedHourList();

  const url = new URL(request.url);
  const timezone = url.searchParams.get("timezone");

  const closedHours = parseClosedHour(
    response,
    timezone || "America/Sao_Paulo",
  );

  return json({ closedHours });
}
