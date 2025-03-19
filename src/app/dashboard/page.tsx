"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThumbsUp, ThumbsDown, Music } from "lucide-react";
import Image from "next/image";

interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  votes: number;
}

export default function QueuePage() {
  const [videoUrl, setVideoUrl] = useState("");
  const [currentVideo, setCurrentVideo] = useState<VideoItem | null>(null);
  const [queue, setQueue] = useState<VideoItem[]>([
    {
      id: "dQw4w9WgXcQ",
      title: "Rick Astley - Never Gonna Give You Up",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
      votes: 5,
    },
    {
      id: "y6120QOlsfU",
      title: "Darude - Sandstorm",
      thumbnail: "https://img.youtube.com/vi/y6120QOlsfU/mqdefault.jpg",
      votes: 3,
    },
  ]);

  const handleAddVideo = () => {
    // Extract video ID from URL
    const videoId = videoUrl.split("v=")[1]?.split("&")[0];
    if (!videoId) return;

    // In a real app, you would fetch video details from YouTube API
    const newVideo: VideoItem = {
      id: videoId,
      title: "New Video", // This would come from YouTube API
      thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      votes: 0,
    };

    setQueue([...queue, newVideo]);
    setVideoUrl("");
  };

  const handleVote = (index: number, increment: number) => {
    const newQueue = [...queue];
    newQueue[index].votes += increment;
    // Sort by votes
    newQueue.sort((a, b) => b.votes - a.votes);
    setQueue(newQueue);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="flex items-center gap-2">
            <Music className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Stream Queue</span>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
          {/* Now Playing Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Now Playing</h2>
            <div className="aspect-video overflow-hidden rounded-lg border bg-muted">
              {currentVideo ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${currentVideo.id}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="border-0"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  No video playing
                </div>
              )}
            </div>
          </div>

          {/* Queue Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Queue</h2>

            {/* Add Video Form */}
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Paste YouTube URL"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
              <Button onClick={handleAddVideo}>Add</Button>
            </div>

            {/* Queue List */}
            <div className="space-y-2">
              {queue.map((video, index) => (
                <div
                  key={video.id}
                  className="flex items-center gap-4 rounded-lg border p-3 hover:bg-muted/50"
                >
                  <Image
                    width={128}
                    height={96}
                    src={video.thumbnail}
                    alt={video.title}
                    className="h-20 w-32 rounded object-cover"
                  />
                  <div className="flex-1 space-y-1">
                    <h3 className="font-medium">{video.title}</h3>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleVote(index, 1)}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <span className="text-lg font-semibold">
                        {video.votes}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleVote(index, -1)}
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
