import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const mostUpVotedStream = await prisma.stream.findFirst({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        upVotes: {
          _count: "desc",
        },
      },
    });
    await prisma.$transaction([
      
      prisma.currentStream.upsert({
        where: {
          userId: session.user.id,
        },
        update: {
          streamId: mostUpVotedStream?.id,
        },
        create: {
          userId: session.user.id,
          streamId: mostUpVotedStream?.id,
        },
      }),

      prisma.stream.delete({
        where: { id: mostUpVotedStream?.id },
      }),
    ]);
    return NextResponse.json({ message: "Next stream set" }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Internal Server Error: ${error.message}` },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
      );
    }
  }
}
