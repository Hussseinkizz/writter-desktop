import * as z from "zod";
import validator from "validator";

const phone_number_schema = z
  .string()
  .refine(
    (phone) => validator.isMobilePhone(phone, "en-UG"),
    "Invalid Phone Number!",
  );

export const login_form_schema = z.object({
  phoneNumber: phone_number_schema,

  username: z.string().refine((value) => value.length > 2, {
    message: "Invalid Username!",
  }),
});

export const create_account_form_schema = z.object({
  phoneNumber: phone_number_schema,

  username: z.string().refine((value) => value.length > 2, {
    message: "Invalid Username!",
  }),
  email: z
    .string()
    .refine(
      (email) => (email ? validator.isEmail(email) : true),
      "Invalid Email",
    ),
});

export const form_schema = z.object({
  primaryPhone: phone_number_schema,
  nin: z.string().refine((value) => value.length === 14, {
    message: "NIN Not Valid!",
  }),
  cardNumber: z.string().refine((value) => value && value.length < 5, {
    message: "Invalid Card Number!",
  }),
  surname: z.string().refine((value) => value.length > 2, {
    message: "Invalid Surname!",
  }),
  givenNames: z.string().refine((value) => value.length > 2, {
    message: "Invalid Given Names!",
  }),
  dayOfBirth: z
    .string()
    .min(2, "Day Of Birth Can Not Be Empty!")
    .refine((value) => validateDayOfBirth(value), {
      message: "Invalid Day Of Birth!",
    }),
  monthOfBirth: z
    .string()
    .min(2, "Month Of Birth Can Not Be Empty!")
    .refine((value) => validateMonthOfBirth(value), {
      message: "Invalid Month Of Birth!",
    }),
  yearOfBirth: z
    .string()
    .min(4, "Year Of Birth Can Not Be Empty!")
    .refine((value) => validateYearOfBirth(value), {
      message: "Invalid Year Of Birth!",
    }),
  email: z
    .string()
    .refine(
      (email) => (email ? validator.isEmail(email) : true),
      "Invalid Email",
    ),
});

export const verify_account_form_schema = z.object({
  nin: z.string().refine((value) => value.length === 14, {
    message: "NIN Not Valid!",
  }),
  cardNumber: z.string().refine((value) => value && value.length < 10, {
    message: "Invalid Card Number!",
  }),
  surname: z.string().refine((value) => value.length > 2, {
    message: "Invalid Surname!",
  }),
  givenNames: z.string().refine((value) => value.length > 2, {
    message: "Invalid Given Names!",
  }),
  dayOfBirth: z
    .string()
    .min(2, "Day Of Birth Can Not Be Empty!")
    .refine((value) => validateDayOfBirth(value), {
      message: "Invalid Day Of Birth!",
    }),
  monthOfBirth: z
    .string()
    .min(2, "Month Of Birth Can Not Be Empty!")
    .refine((value) => validateMonthOfBirth(value), {
      message: "Invalid Month Of Birth!",
    }),
  yearOfBirth: z
    .string()
    .min(4, "Year Of Birth Can Not Be Empty!")
    .refine((value) => validateYearOfBirth(value), {
      message: "Invalid Year Of Birth!",
    }),
});

// todo: the new value should replace current input value, and should also autofocus next input element

export const _validatePhoneNumber = (phone: string) => {
  let validPhone = "";
  let errorMessage = "";

  const result = phone_number_schema.safeParse(phone);

  if (result.success) {
    validPhone = result.data;
  } else {
    const message = result.error.errors[0].message;
    errorMessage = message;
  }
  return { validPhone, errorMessage };
};

const validateDayOfBirth = (value: string) => {
  const inputValue = Number(value.trim());
  const inputValueLength = value.trim().split("").length;
  let isValid = false;

  if (inputValue <= 31 && inputValueLength < 3) {
    isValid = true;
  } else {
    const newValue = value.substring(0, 2);
  }
  return isValid;
};

const validateMonthOfBirth = (value: string) => {
  const inputValue = Number(value.trim());
  const inputValueLength = value.trim().split("").length;
  let isValid = false;

  if (inputValue <= 12 && inputValueLength < 3) {
    isValid = true;
  } else {
    const newValue = value.substring(0, 2);
  }

  return isValid;
};

const validateYearOfBirth = (value: string) => {
  const inputValue = Number(value.trim());
  const inputValueLength = value.trim().split("").length;
  let isValid = false;

  if (inputValue && inputValueLength === 4) {
    isValid = true;
  } else {
    const newValue = value.substring(0, 4);
  }

  return isValid;
};

// get element refs and autofocus the next element
// const autoFocusNextTab = (currentTabIndex: number) => {
//   if (currentTabIndex < 3) {
//     let allInputItems = [tab1Ref, tab2Ref, tab3Ref];
//     allInputItems.forEach((input) => {
//       if (input.current.tabIndex - 1 === currentTabIndex) {
//         input.current.focus();
//       }
//     });
//   }
// };
