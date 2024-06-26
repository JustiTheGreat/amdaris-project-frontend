import { useEffect, useState } from "react";

interface FormField {
  defaultValue: any;
  value: any;
  condition: (value: any) => string | undefined;
  error?: string | undefined;
}

interface Condition {
  expression: (value: any) => boolean;
  errorMessage: string;
}

interface Input {
  name: string;
  defaultValue: any;
  conditions: Condition[];
}

export function useValidation(inputs: Input[], dependencies: any[]) {
  const [errors, setErrors] = useState<{ [name: string]: FormField }>({});

  useEffect(() => {
    const computeCondition =
      (conditions: Condition[]) =>
      (value: any): string | undefined =>
        conditions
          .map((condition) => ({ isActive: condition.expression(value), errorMessage: condition.errorMessage }))
          .find((condition) => condition.isActive)?.errorMessage;
    const newErrors: { [name: string]: FormField } = {};
    inputs.forEach(
      (input) =>
        (newErrors[input.name] = {
          defaultValue: input.defaultValue,
          value: input.defaultValue,
          condition: computeCondition(input.conditions),
        })
    );
    setErrors(newErrors);
  }, [...dependencies]);

  const setFieldValue = (field: string, value: any): void =>
    setErrors({
      ...errors,
      [field]: {
        ...errors[field],
        value,
        error: undefined,
      },
    });

  const setFieldValues = (list: { field: string; value: any }[]): void => {
    const newErrors = list
      .map((item) => ({
        [item.field]: {
          ...errors[item.field],
          value: item.value,
          error: undefined,
        },
      }))
      .reduce((prev, current) => ({ ...prev, ...current }));
    setErrors({ ...errors, ...newErrors });
  };

  const pass = (): boolean => {
    const mapped = Object.keys(errors).map((formField) => ({
      [formField]: { ...errors[formField], error: errors[formField].condition(errors[formField].value) },
    }));
    if (mapped.length === 0) return true;
    const newErrors = mapped.reduce((prev, current) => ({ ...prev, ...current }));
    setErrors(newErrors);
    return (
      Object.keys(newErrors)
        .map((formField) => newErrors[formField].error)
        .filter((error) => !error).length === Object.keys(errors).length
    );
  };

  const reset = (): void => {
    const mapped = Object.keys(errors).map((formField) => ({
      [formField]: { ...errors[formField], value: errors[formField].defaultValue, error: undefined },
    }));
    if (mapped.length === 0) return;
    const newErrors = mapped.reduce((prev, current) => ({ ...prev, ...current }));
    setErrors(newErrors);
  };

  const getData = (): {
    [x: string]: any;
  } => {
    const mapped = Object.keys(errors).map((formField) => ({ [formField]: errors[formField].value }));
    if (mapped.length === 0) return {};
    const values = mapped.reduce((prev, current) => ({ ...prev, ...current }));
    return values;
  };

  return { errors, setFieldValue, setFieldValues, pass, reset, getData };
}
