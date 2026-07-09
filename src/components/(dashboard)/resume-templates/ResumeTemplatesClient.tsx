'use client';

import { useState } from 'react';

import { useResumes } from '../../../hooks/useResumes';
import ResumeTemplates from './ResumeTemplates';
import ResumeFormModal from './ResumeFormModal';
import ConfirmDialog from '../../ui/ConfirmDialog';
import type { Resume } from '../../../hooks/types';

export default function ResumeTemplatesClient() {
  const { resumes, addResume, updateResume, deleteResume, setDefaultResume } = useResumes();
  const [isAddResumeOpen, setIsAddResumeOpen] = useState(false);
  const [editingResume, setEditingResume] = useState<Resume | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const pendingDelete = pendingDeleteId ? resumes.find((r) => r.id === pendingDeleteId) : null;

  const handleClose = () => {
    setIsAddResumeOpen(false);
    setEditingResume(null);
  };

  const handleSubmit = (data: { name: string; content: string; isDefault: boolean }) => {
    if (editingResume) {
      updateResume(editingResume.id, data);
    } else {
      addResume(data);
    }
  };

  return (
    <>
      <ResumeTemplates
        resumes={resumes}
        onAddResumeClick={() => setIsAddResumeOpen(true)}
        onEditResumeClick={(resume) => setEditingResume(resume)}
        onDeleteResume={(id) => setPendingDeleteId(id)}
        onSetDefaultResume={(id) => setDefaultResume(id)}
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
        onConfirm={() => {
          if (pendingDeleteId) deleteResume(pendingDeleteId);
          setPendingDeleteId(null);
        }}
        onCancel={() => setPendingDeleteId(null)}
      />
    </>
  );
}