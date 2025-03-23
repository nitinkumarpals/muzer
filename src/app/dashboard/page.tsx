import StreamView from "@/components/StreamView";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  const creatorId = session?.user.id;
  return (
    <>
      <StreamView creatorId={creatorId!} playVideo={true} />
    </>
  );
}
