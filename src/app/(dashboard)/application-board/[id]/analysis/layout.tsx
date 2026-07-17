import AnalysisLayoutClient from './AnalysisLayoutClient';

export default async function AnalysisPageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AnalysisLayoutClient id={id}>{children}</AnalysisLayoutClient>;
}
