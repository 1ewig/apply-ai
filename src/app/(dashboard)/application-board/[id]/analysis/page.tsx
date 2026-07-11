import AnalysisPageClient from '@/components/(dashboard)/application-board/match-analysis/AnalysisPageClient';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  return { title: 'Match Analysis | ApplyAI' };
}

export default async function AnalysisPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AnalysisPageClient id={id} />;
}
