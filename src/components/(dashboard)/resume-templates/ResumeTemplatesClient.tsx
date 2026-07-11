'use client';

import { useState } from 'react';

import { useResumes } from '@/hooks/useResumes';
import ResumeTemplates from './ResumeTemplates';
import ResumeFormModal from './ResumeFormModal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import type { Resume } from '@/types';
import { useAnalysisStore } from '@/stores/useAnalysisStore';

export default function ResumeTemplatesClient() {
  const { resumes, isLoading, addResume, updateResume, deleteResume, setDefaultResume } = useResumes();
  const { setError } = useAnalysisStore();
  const [isAddResumeOpen, setIsAddResumeOpen] = useState(false);
  const [editingResume, setEditingResume] = useState<Resume | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
    } catch (err: any) {
      console.error('Failed to save resume:', err);
      setError(err.message || 'Failed to save resume template.');
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
        onSetDefaultResume={async (id) => {
          try {
            await setDefaultResume(id);
          } catch (err: any) {
            console.error('Failed to set default resume:', err);
            setError(err.message || 'Failed to set default resume.');
          }
        }}
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
        onConfirm={async () => {
          if (pendingDeleteId) {
            setIsDeleting(true);
            try {
              await deleteResume(pendingDeleteId);
              setPendingDeleteId(null);
            } catch (err: any) {
              console.error('Failed to delete resume:', err);
              setError(err.message || 'Failed to delete resume template.');
            } finally {
              setIsDeleting(false);
            }
          }
        }}
        onCancel={() => setPendingDeleteId(null)}
      />
    </>
  );
}