'use client';

import { useState } from 'react';

import { useResumes } from '../../../hooks/useResumes';
import ResumeTemplates from './ResumeTemplates';
import ResumeFormModal from './ResumeFormModal';
import type { Resume } from '../../../hooks/types';

export default function ResumeTemplatesClient() {
  const { resumes, addResume, updateResume, deleteResume, setDefaultResume } = useResumes();
  const [isAddResumeOpen, setIsAddResumeOpen] = useState(false);
  const [editingResume, setEditingResume] = useState<Resume | null>(null);

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
        onDeleteResume={(id) => deleteResume(id)}
        onSetDefaultResume={(id) => setDefaultResume(id)}
      />

      <ResumeFormModal
        isOpen={isAddResumeOpen || !!editingResume}
        onClose={handleClose}
        onSubmit={handleSubmit}
        editingResume={editingResume}
      />
    </>
  );
}
