import {
  Control,
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

export type CommonSelectProps<T extends FieldValues> = {
  name: Path<T>;
  errors?: FieldErrors<T>;
  selectProps?: React.SelectHTMLAttributes<HTMLSelectElement> & {
    classNameContainer?: string;
  };
  label?: React.ReactNode | string;
  placeholder?: string;

  // Para controlar manualmente (sem react-hook-form)
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  required?: boolean;
};

export type ControlledSelectProps<T extends FieldValues> =
  CommonSelectProps<T> & {
    control: Control<T>;
    register?: never;
  };

export type RegisteredSelectProps<T extends FieldValues> =
  CommonSelectProps<T> & {
    register: UseFormRegister<T>;
    control?: never;
  };

export type ManualSelectProps<T extends FieldValues> = CommonSelectProps<T> & {
  control?: never;
  register?: never;
};

export type FormSelectProps<T extends FieldValues> =
  | ControlledSelectProps<T>
  | RegisteredSelectProps<T>
  | ManualSelectProps<T>;

export type ContainerProps = {
  children: React.ReactNode;
  label?: React.ReactNode | string;
  id?: string;
  className?: string;
};
