import { useForm } from '@/hooks/useForm';

interface ResumeFormData {
  name: string;
  content: string;
  isDefault: boolean;
}

interface UseResumeFormOptions {
  isOpen: boolean;
  editingResume?: { name: string; content: string; isDefault: boolean } | null;
  onSubmit: (data: ResumeFormData) => void | Promise<void>;
  onClose: () => void;
}

export function useResumeForm({ isOpen, editingResume, onSubmit, onClose }: UseResumeFormOptions) {
  const defaults = { name: '', content: '', isDefault: false };
  const initialValues = editingResume ?? null;

  const { values, setField, isSubmitting, handleSubmit: formSubmit } = useForm({
    isOpen,
    initialValues,
    defaults,
    onSubmit: async (vals) => {
      await onSubmit({ name: vals.name, content: vals.content, isDefault: vals.isDefault });
    },
    onClose,
    autoCloseOnSubmit: true,
  });

  const handleSubmit = async () => {
    if (!values.name || !values.content) return;
    try {
      await formSubmit();
    } catch (e) {
      console.error('Resume submission failed:', e);
    }
  };

  return {
    name: values.name,
    setName: (v: string) => setField('name', v),
    content: values.content,
    setContent: (v: string) => setField('content', v),
    isDefault: values.isDefault,
    setIsDefault: (v: boolean) => setField('isDefault', v),
    isSubmitting,
    handleSubmit,
  };
}
