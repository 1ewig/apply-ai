import { useState, useEffect } from 'react';

interface UseFormOptions<T extends Record<string, any>> {
  isOpen: boolean;
  initialValues: T | null;
  defaults: T;
  onSubmit: (values: T) => void | Promise<void>;
  onClose?: () => void;
  autoCloseOnSubmit?: boolean;
}

export function useForm<T extends Record<string, any>>({
  isOpen,
  initialValues,
  defaults,
  onSubmit,
  onClose,
  autoCloseOnSubmit = true,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(defaults);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prevIsOpen, setPrevIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen && !prevIsOpen) {
      setValues(initialValues ?? defaults);
    } else if (!isOpen && prevIsOpen) {
      setValues(defaults);
    }
    setPrevIsOpen(isOpen);
  }, [isOpen, prevIsOpen, initialValues, defaults]);

  const setField = <K extends keyof T>(key: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      if (autoCloseOnSubmit) onClose?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  return { values, setField, isSubmitting, handleSubmit };
}
