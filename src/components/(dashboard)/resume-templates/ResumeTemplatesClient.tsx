'use client';

import { useState } from 'react';

import { useResumes } from '../../../hooks/useResumes';
import ResumeTemplates from './ResumeTemplates';
import AddResumeModal from './AddResumeModal';
import EditResumeModal from './EditResumeModal';
import type { Resume } from '../../../hooks/types';

export default function ResumeTemplatesClient() {
  const { resumes, addResume, updateResume, deleteResume, setDefaultResume } = useResumes();
  const [isAddResumeOpen, setIsAddResumeOpen] = useState(false);
  const [editingResume, setEditingResume] = useState<Resume | null>(null);

  return (
    <>
      <ResumeTemplates
        resumes={resumes}
        onAddResumeClick={() => setIsAddResumeOpen(true)}
        onEditResumeClick={(resume) => setEditingResume(resume)}
        onDeleteResume={(id) => deleteResume(id)}
        onSetDefaultResume={(id) => setDefaultResume(id)}
      />

      <AddResumeModal
        isOpen={isAddResumeOpen}
        onClose={() => setIsAddResumeOpen(false)}
        onSubmit={(data) => addResume(data)}
      />

      <EditResumeModal
        resume={editingResume}
        onClose={() => setEditingResume(null)}
        onSubmit={(id, data) => updateResume(id, data)}
      />
    </>
  );
}
