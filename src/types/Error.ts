import { ERROR_CODE } from "~/constants/errors";
import type { ObjectValues } from "./ObjectValues";

export type ErrorCode = ObjectValues<typeof ERROR_CODE>;
