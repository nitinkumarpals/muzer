import { prisma } from "@/lib/db";
import { upvoteSchema } from "@/schemas/upvoteSchema";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const result = await upvoteSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request", details: result.error.format() },
        { status: 400 }
      );
    }
    await prisma.upVote.delete({
      where: {
        userId_streamId: {
          userId: session.user.id,
          streamId: result.data.streamId,
        },
      },
    });

    return NextResponse.json(
      { message: "Down voted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "Up vote not found" }, { status: 404 });
    } else {
      return NextResponse.json(
        { errorMessage: `Something went wrong ${(error as Error).message}` },
        { status: 500 }
      );
    }
  }
}
