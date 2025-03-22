import { prisma } from "@/lib/db";
import { streamSchema } from "@/schemas/streamSchema";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

//@ts-expect-error Missing type definitions for youtube-search-api module
import youtubesearchapi from "youtube-search-api";
import { authOptions } from "../auth/[...nextauth]/route";

const youtubeRegex =
  /^(https?:\/\/)?(www\.|m\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})(&.*)?$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await streamSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request", details: result.error.format() },
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

    const youtubeResult = await youtubesearchapi.GetVideoDetails(extractedId);

    const thumbnails = youtubeResult.thumbnail.thumbnails;
    thumbnails.sort((a: { width: number }, b: { width: number }) =>
      a.width < b.width ? -1 : 1
    );

    const stream = await prisma.stream.create({
      data: {
        userId: result.data.creatorId,
        url: result.data.url,
        extractedId,
        type: "Youtube",
        title: youtubeResult.title ?? "Can't find video",
        smallThumbnail:
          (thumbnails.length > 1
            ? thumbnails[thumbnails.length - 2].url
            : thumbnails[thumbnails.length - 1].url) ??
          "https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_640.jpg",
        bigThumbnail:
          thumbnails[thumbnails.length - 1].url ??
          "https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_640.jpg",
      },
    });

    return NextResponse.json(
      { message: "Stream created", stream },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request", message: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const creatorId = req.nextUrl.searchParams.get("creatorId");
  if (!creatorId) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const streams = await prisma.stream.findMany({
    where: { userId: creatorId },
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
        haveVoted: rest.upVotes.length ? true : false,
      })),
    },
    { status: 200 }
  );
}
