import { DigestBuilder } from "@/components/digests/digest-builder";

export default async function DigestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DigestBuilder mode="edit" digestId={id} />;
}
