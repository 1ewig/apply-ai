import { useMemo } from 'react';
import { useForm } from '@/hooks/useForm';
import type { JobApplication, Resume } from '@/types';

export function useApplicationForm(
  isOpen: boolean,
  editingJob: JobApplication | null,
  resumes: Resume[],
  onSubmit: (jobData: {
    company: string;
    role: string;
    status: JobApplication['status'];
    url: string;
    jobDescription: string;
    selectedResumeId: string;
    customResumeContent: string;
    analyzeImmediately: boolean;
  }) => void | Promise<void>,
  onClose: () => void,
) {
  const defaults = {
    company: '',
    role: '',
    status: 'wishlist' as JobApplication['status'],
    url: '',
    jobDescription: '',
    selectedResumeId: '',
    customResumeContent: '',
    analyzeImmediately: true,
  };

  const initialValues = useMemo(() => {
    if (!isOpen) return null;

    if (editingJob) {
      return {
        company: editingJob.company || '',
        role: editingJob.role || '',
        status: editingJob.status || 'wishlist' as JobApplication['status'],
        url: editingJob.url || '',
        jobDescription: editingJob.jobDescription || '',
        selectedResumeId: editingJob.resumeUsed || '',
        customResumeContent: editingJob.customResumeContent || '',
        analyzeImmediately: false,
      };
    }

    const defaultResume = resumes.find((r) => r.isDefault) || resumes[0];
    return {
      company: '',
      role: '',
      status: 'wishlist' as JobApplication['status'],
      url: '',
      jobDescription: '',
      selectedResumeId: defaultResume?.id ?? '',
      customResumeContent: defaultResume?.content ?? '',
      analyzeImmediately: true,
    };
  }, [isOpen, editingJob, resumes]);

  const { values, setField, isSubmitting, handleSubmit: formSubmit } = useForm({
    isOpen,
    initialValues,
    defaults,
    onSubmit: async (vals) => {
      await onSubmit({
        company: vals.company.trim() || 'Unnamed Company',
        role: vals.role.trim() || 'Unnamed Role',
        status: vals.status,
        url: vals.url,
        jobDescription: vals.jobDescription,
        selectedResumeId: vals.selectedResumeId,
        customResumeContent: vals.customResumeContent,
        analyzeImmediately: vals.analyzeImmediately,
      });
    },
    onClose,
    autoCloseOnSubmit: false,
  });

  const handleResumeTemplateChange = (templateId: string) => {
    setField('selectedResumeId', templateId);
    const selectedTemplate = resumes.find((r) => r.id === templateId);
    if (selectedTemplate) {
      setField('customResumeContent', selectedTemplate.content);
    }
  };

  const handleSubmit = async () => {
    try {
      await formSubmit();
      if (!values.analyzeImmediately) onClose();
    } catch (e) {
      console.error('Job application submission failed:', e);
    }
  };

  return {
    company: values.company,
    setCompany: (v: string) => setField('company', v),
    role: values.role,
    setRole: (v: string) => setField('role', v),
    status: values.status,
    setStatus: (v: JobApplication['status']) => setField('status', v),
    url: values.url,
    setUrl: (v: string) => setField('url', v),
    jobDescription: values.jobDescription,
    setJobDescription: (v: string) => setField('jobDescription', v),
    selectedResumeId: values.selectedResumeId,
    customResumeContent: values.customResumeContent,
    setCustomResumeContent: (v: string) => setField('customResumeContent', v),
    analyzeImmediately: values.analyzeImmediately,
    setAnalyzeImmediately: (v: boolean) => setField('analyzeImmediately', v),
    handleResumeTemplateChange,
    isSubmitting,
    handleSubmit,
  };
}
