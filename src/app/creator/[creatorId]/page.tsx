import StreamView from "@/components/StreamView";

interface Params {
  creatorId: string;
}

export default function Creator({ params: { creatorId } }: { params: Params }) {
  return (
    <>
      <StreamView creatorId={creatorId} playVideo={false} />
    </>
  );
}
