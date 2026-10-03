import ScholarshipDetailView from "@/components/scholarship/ScholarshipDetailView";

export default async function ScholarshipDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ScholarshipDetailView id={id} />;
}
