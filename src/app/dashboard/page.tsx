import StreamView from "@/components/StreamView";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { Redirect } from "@/components/Redirect";

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
