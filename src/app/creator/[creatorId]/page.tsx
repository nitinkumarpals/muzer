import { Redirect } from "@/components/Redirect";
import StreamView from "@/components/StreamView";

interface Params {
  creatorId: string;
}

export default function Creator({ params: { creatorId } }: { params: Params }) {
  return (
    <>
      <Redirect />
      <StreamView creatorId={creatorId} playVideo={false} />
    </>
  );
}
