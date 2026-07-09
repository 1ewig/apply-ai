import { useState, useEffect } from 'react';
import { JobApplication, Resume } from './types';

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
  }) => void,
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

  const handleSubmit = () => {
    onSubmit({
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
    handleSubmit,
  };
}
