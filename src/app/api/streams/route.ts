import { prisma } from "@/lib/db";
import { streamSchema } from "@/schemas/streamSchema";
import { NextRequest, NextResponse } from "next/server";

const youtubeRegex =
  /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})$/;

export async function POST(req: NextRequest) {
  try {
    const result = await streamSchema.safeParse(req.json());

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 400 }
      );
    }

    const isYoutubeUrl = youtubeRegex.test(result.data.url);
    if (!isYoutubeUrl) {
      return NextResponse.json(
        { error: "Invalid Youtube URL Format" },
        { status: 400 }
      );
    }

    const extractedId = new URL(result.data.url).searchParams.get("v") ?? "";

    const stream = await prisma.stream.create({
      data: {
        userId: result.data.creatorId,
        url: result.data.url,
        extractedId,
        type: "Youtube",
      },
    });

    return NextResponse.json(
      { message: "Stream created", stream },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request", message: error },
      { status: 400 }
    );
  }
}
