import { useState, useEffect } from 'react';
import { JobApplication, Resume } from '@/types';

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
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState<JobApplication['status']>('wishlist');
  const [url, setUrl] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [customResumeContent, setCustomResumeContent] = useState('');
  const [analyzeImmediately, setAnalyzeImmediately] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (editingJob) {
      setCompany(editingJob.company || '');
      setRole(editingJob.role || '');
      setStatus(editingJob.status || 'wishlist');
      setUrl(editingJob.url || '');
      setJobDescription(editingJob.jobDescription || '');
      setSelectedResumeId(editingJob.resumeUsed || '');
      setCustomResumeContent(editingJob.customResumeContent || '');
      setAnalyzeImmediately(false);
    } else {
      const defaultResume = resumes.find((r) => r.isDefault) || resumes[0];
      if (defaultResume) {
        setSelectedResumeId(defaultResume.id);
        setCustomResumeContent(defaultResume.content);
      } else {
        setSelectedResumeId('');
        setCustomResumeContent('');
      }
      setCompany('');
      setRole('');
      setStatus('wishlist');
      setUrl('');
      setJobDescription('');
      setAnalyzeImmediately(true);
    }
  }, [isOpen, editingJob, resumes]);

  const handleResumeTemplateChange = (templateId: string) => {
    setSelectedResumeId(templateId);
    const selectedTemplate = resumes.find(r => r.id === templateId);
    if (selectedTemplate) {
      setCustomResumeContent(selectedTemplate.content);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        company: company.trim() || 'Unnamed Company',
        role: role.trim() || 'Unnamed Role',
        status,
        url,
        jobDescription,
        selectedResumeId,
        customResumeContent,
        analyzeImmediately,
      });
      if (!analyzeImmediately) {
        onClose();
      }
    } catch (err) {
      console.error('Failed to submit application form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    company, setCompany,
    role, setRole,
    status, setStatus,
    url, setUrl,
    jobDescription, setJobDescription,
    selectedResumeId,
    customResumeContent, setCustomResumeContent,
    analyzeImmediately, setAnalyzeImmediately,
    handleResumeTemplateChange,
    isSubmitting,
    handleSubmit,
  };
}
