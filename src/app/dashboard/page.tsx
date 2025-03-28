import StreamView from "@/components/StreamView";
import { getServerSession } from "next-auth";
import { Redirect } from "@/components/Redirect";
import { authOptions } from "@/lib/auth";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  const creatorId = session?.user.id;
  return (
    <>
      <Redirect />
      <StreamView creatorId={creatorId!} playVideo={true} />
    </>
  );
}
