'use client';

import { useState, useEffect } from 'react';

import { useResumes } from '@/hooks/useResumes';
import { useResumeForm } from '@/hooks/useResumeForm';
import ResumeTemplates from './ResumeTemplates';
import ResumeFormModal from './ResumeFormModal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import type { Resume } from '@/types';
import { useAnalysisStore } from '@/stores/useAnalysisStore';
import { toUserFriendlyError } from '@/utils/userFriendlyErrors';

export default function ResumeTemplatesClient() {
  const { resumes, isLoading, isError, error, refetch, addResume, updateResume, deleteResume, setDefaultResume } = useResumes();
  const { setError, setSuccess } = useAnalysisStore();
  const [isAddResumeOpen, setIsAddResumeOpen] = useState(false);
  const [editingResume, setEditingResume] = useState<Resume | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isError && error) {
      setError(
        toUserFriendlyError(error, 'Failed to load resume templates.'),
        () => { refetch(); },
        'Failed to Load Resumes'
      );
    }
  }, [isError, error, refetch, setError]);

  const pendingDelete = pendingDeleteId ? resumes.find((r) => r.id === pendingDeleteId) : null;

  const handleClose = () => {
    setIsAddResumeOpen(false);
    setEditingResume(null);
  };

  const handleSubmit = async (data: { name: string; content: string; isDefault: boolean }) => {
    setIsSaving(true);
    try {
      if (editingResume) {
        await updateResume(editingResume.id, data);
      } else {
        await addResume(data);
      }
      handleClose();
      setSuccess('Resume saved successfully.', 'Resume Saved');
    } catch (err: any) {
      console.error('Failed to save resume:', err);
      setError(toUserFriendlyError(err, 'Failed to save resume template.'), () => handleSubmit(data), 'Failed to Save Resume');
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const resumeForm = useResumeForm({
    isOpen: isAddResumeOpen || !!editingResume,
    editingResume,
    onSubmit: handleSubmit,
    onClose: handleClose,
  });

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultResume(id);
      setSuccess('Default resume updated.', 'Default Updated');
    } catch (err: any) {
      console.error('Failed to set default resume:', err);
      setError(toUserFriendlyError(err, 'Failed to update default resume.'), () => handleSetDefault(id), 'Failed to Update Default Resume');
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteResume(id);
      setPendingDeleteId(null);
      setSuccess('Resume deleted successfully.', 'Resume Removed');
    } catch (err: any) {
      console.error('Failed to delete resume:', err);
      setError(toUserFriendlyError(err, 'Failed to delete resume template.'), () => handleDelete(id), 'Failed to Delete Resume');
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <ResumeTemplates
        resumes={resumes}
        isLoading={isLoading}
        onAddResumeClick={() => setIsAddResumeOpen(true)}
        onEditResumeClick={(resume) => setEditingResume(resume)}
        onDeleteResume={(id) => setPendingDeleteId(id)}
        onSetDefaultResume={handleSetDefault}
      />

      <ResumeFormModal
        isOpen={isAddResumeOpen || !!editingResume}
        onClose={handleClose}
        onSubmit={resumeForm.handleSubmit}
        editingResume={editingResume}
        name={resumeForm.name}
        onNameChange={resumeForm.setName}
        content={resumeForm.content}
        onContentChange={resumeForm.setContent}
        isDefault={resumeForm.isDefault}
        onIsDefaultChange={resumeForm.setIsDefault}
        isSubmitting={resumeForm.isSubmitting || isSaving}
      />

      <ConfirmDialog
        isOpen={!!pendingDeleteId}
        title="Delete Resume Template"
        message={`Are you sure you want to delete "${pendingDelete?.name || 'this template'}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
        onConfirm={() => pendingDeleteId && handleDelete(pendingDeleteId)}
        onCancel={() => setPendingDeleteId(null)}
      />
    </>
  );
}