import { FORM_STATE_STATUS } from "~/constants/formState";
import type { ObjectValues } from "./ObjectValues";

export type FormStateStatus = ObjectValues<typeof FORM_STATE_STATUS>;

export type FormState = {
  message: string | undefined;
  status: FormStateStatus;
};
