import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const streamId = req.nextUrl.searchParams.get("streamId");
    if (!streamId) {
      return NextResponse.json(
        { error: "Stream ID is required" },
        { status: 400 }
      );
    }
    await prisma.$transaction([
      prisma.upVote.deleteMany({
        where: {
          streamId: streamId,
        },
      }),
      prisma.stream.delete({
        where: {
          id: streamId,
          userId: session.user.id,
        },
      }),
    ]);
    return NextResponse.json({ message: "Song removed" }, { status: 200 });
  } catch (error: unknown) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "Stream not found" }, { status: 404 });
    } else {
      return NextResponse.json(
        { errorMessage: `Something went wrong ${(error as Error).message}` },
        { status: 500 }
      );
    }
  }
}
