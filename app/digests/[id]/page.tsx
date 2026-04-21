import { DigestDetail } from "@/components/digests/digest-detail";

export default async function DigestDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ run?: string }>;
}) {
  const { id } = await params;
  const { run } = await searchParams;

  return <DigestDetail digestId={id} initialRunId={run} />;
}
