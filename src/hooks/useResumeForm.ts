import { useState, useEffect } from 'react';

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
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (editingResume) {
      setName(editingResume.name);
      setContent(editingResume.content);
      setIsDefault(editingResume.isDefault);
    } else {
      setName('');
      setContent('');
      setIsDefault(false);
    }
  }, [isOpen, editingResume]);

  const handleSubmit = async () => {
    if (!name || !content) return;
    setIsSubmitting(true);
    try {
      await onSubmit({ name, content, isDefault });
      onClose();
    } catch (err) {
      console.error('Failed to submit resume form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    name, setName,
    content, setContent,
    isDefault, setIsDefault,
    isSubmitting,
    handleSubmit,
  };
}
