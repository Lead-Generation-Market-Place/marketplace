
import { z } from 'zod'



export const backgroundCheckSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  middleName: z.string().optional(),
  noMiddleName: z.boolean().optional(),

  dob: z.string().min(1, "Date of birth is required"),
  street: z.string().min(1, "Street is required"),
  suite: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().trim().min(1, "State is required"),
  zip: z.string().min(1, "ZIP code is required"),
  ssn: z.string().min(1, "SSN is required"),
  confirm: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms." }),
  }),
});



type FormSchema = z.infer<typeof backgroundCheckSchema>;

interface ActionState {
  success: boolean;
  data?: FormSchema;
  errors?: Partial<Record<keyof FormSchema, string[]>>;
}

export async function submitBackgroundCheck(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const result = backgroundCheckSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  const data = result.data;
  console.log("✅ Submitted to server:", data);

  return {
    success: true,
    data,
  };
}
