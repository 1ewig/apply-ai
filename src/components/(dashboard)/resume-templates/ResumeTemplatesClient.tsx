'use client';

import { useState, useEffect } from 'react';

import { useResumes } from '@/hooks/useResumes';
import ResumeTemplates from './ResumeTemplates';
import ResumeFormModal from './ResumeFormModal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import type { Resume } from '@/types';
import { useAnalysisStore } from '@/stores/useAnalysisStore';

export default function ResumeTemplatesClient() {
  const { resumes, isLoading, isError, error, refetch, addResume, updateResume, deleteResume, setDefaultResume } = useResumes();
  const { setError } = useAnalysisStore();
  const [isAddResumeOpen, setIsAddResumeOpen] = useState(false);
  const [editingResume, setEditingResume] = useState<Resume | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isError && error) {
      setError(
        error.message || 'Failed to load resume templates from database.',
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
    try {
      if (editingResume) {
        await updateResume(editingResume.id, data);
      } else {
        await addResume(data);
      }
      handleClose();
    } catch (err: any) {
      console.error('Failed to save resume:', err);
      setError(err.message || 'Failed to save resume template.', () => handleSubmit(data), 'Failed to Save Resume');
      throw err;
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultResume(id);
    } catch (err: any) {
      console.error('Failed to set default resume:', err);
      setError(err.message || 'Failed to set default resume.', () => handleSetDefault(id), 'Failed to Update Default Resume');
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteResume(id);
      setPendingDeleteId(null);
    } catch (err: any) {
      console.error('Failed to delete resume:', err);
      setError(err.message || 'Failed to delete resume template.', () => handleDelete(id), 'Failed to Delete Resume');
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
        onSubmit={handleSubmit}
        editingResume={editingResume}
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