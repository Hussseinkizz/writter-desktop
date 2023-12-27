import * as z from 'zod';
import validator from 'validator';

export const useValidatePhoneNumber = (phone: string) => {
  let validPhone = '';
  let errorMessage = '';

  const phone_number_schema = z
    .string()
    .refine(
      (phone) => validator.isMobilePhone(phone, 'en-UG'),
      'Invalid Phone Number!'
    );

  const result = phone_number_schema.safeParse(phone);

  if (result.success) {
    validPhone = result.data;
  } else {
    const message = result.error.errors[0].message;
    errorMessage = message;
  }
  return { validPhone, errorMessage };
};
