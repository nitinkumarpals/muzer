import StreamView from "@/components/StreamView";

interface Props {
  params: Promise<{ creatorId: string }>;
}

export default async function Creator({ params }: Props) {
  const resolvedParams = await params; // Await the params if it's a Promise

  return (
    <>
      <StreamView creatorId={resolvedParams.creatorId} playVideo={false} />
    </>
  );
}
