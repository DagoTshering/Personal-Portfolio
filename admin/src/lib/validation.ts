import { z } from 'zod';

export type FieldErrors = Record<string, string>;

export const mapZodErrors = (error: z.ZodError): FieldErrors => {
  const fieldErrors: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0]?.toString() || 'form';
    if (!fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
};

export const validateWithSchema = <T>(
  schema: z.ZodSchema<T>,
  values: unknown
): { ok: true; data: T } | { ok: false; errors: FieldErrors } => {
  const result = schema.safeParse(values);
  if (!result.success) {
    return { ok: false, errors: mapZodErrors(result.error) };
  }

  return { ok: true, data: result.data };
};
