import StreamView from "@/components/StreamView";
const creatorId = "115594591100626333389";
export default function Dashboard() {
  return (
    <>
      <StreamView creatorId={creatorId} playVideo={true} />
    </>
  );
}
