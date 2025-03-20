import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const streams = await prisma.stream.findMany({
    where: { userId: session.user.id },
    include: {
      _count: {
        select: {
          upVotes: true,
        },
      },
      upVotes: {
        where: {
          userId: session.user.id,
        },
      },
    },
  });
  return NextResponse.json(
    {
      message: "Streams fetched",
      streams: streams.map(({ _count, ...rest }) => ({
        ...rest,
        upVotes: _count.upVotes,
      })),
      userUpVotes: streams.map(({ upVotes }) => upVotes),
    },
    { status: 200 }
  );
}
