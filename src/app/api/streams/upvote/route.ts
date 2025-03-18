import { prisma } from "@/lib/db";
import { upvoteSchema } from "@/schemas/upvoteSchema";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession();
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

    const existingUpvote = await prisma.upVote.findUnique({
      where: {
        userId_streamId: {
          userId: session.user.id,
          streamId: result.data.streamId,
        },
      },
    });

    if (existingUpvote) {
      return NextResponse.json(
        { error: "You have already upvoted this stream" },
        { status: 409 }
      );
    }

    const upVote = await prisma.upVote.create({
      data: {
        userId: session.user.id,
        streamId: result.data.streamId,
      },
    });
    
    return NextResponse.json(
      { message: "Upvote added successfully", upVote },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: `Something went wrong ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
