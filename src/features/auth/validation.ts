export const initialRegisterInput = {
  name: "",
  email: "",
  password: "",
};

export type RegisterInput = typeof initialRegisterInput;

export type RegisterErrors = Partial<Record<keyof RegisterInput, string>>;

export function validate(input: RegisterInput): RegisterErrors {
  const errors: RegisterErrors = {};

  if (!input.name.trim()) {
    errors.name = "Name is required.";
  }

  if (!input.email.trim()) {
    errors.email = "Email is required.";
  }

  if (!input.password) {
    errors.password = "Password is required.";
  } else if (input.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  return errors;
}
