import { useState } from "react";

export function useFormErrors() {
  const [errors, setErrors] = useState({});
  const [warnings, setWarnings] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  return {
    errors,
    setErrors,
    warnings,
    setWarnings,
    submitted,
    setSubmitted,
    submitting,
    setSubmitting,
  };
}
