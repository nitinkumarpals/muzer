"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Music,
  Play,
  SkipForward,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSession } from "next-auth/react";

// Type for video objects
interface Video {
  id: string;
  title: string;
  thumbnail: string;
  votes: number;
  userVoted: "up" | "down" | null;
  streamId: string;
  haveUpVoted: boolean;
}
const REFRESH_INTERVAL_MS = 10000;
export default function Dashboard() {
  const [videoUrl, setVideoUrl] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [videoQueue, setVideoQueue] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStreamer, setIsStreamer] = useState(true);
  const [showShareAlert, setShowShareAlert] = useState(false);
  const [voteInProgress, setVoteInProgress] = useState(false);
  const session = useSession();
  const refreshStreams = async () => {
    await axios.get("/api/streams/my");
  };
  useEffect(() => {
    refreshStreams();
    setInterval(() => {}, REFRESH_INTERVAL_MS);
  }, []);

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUrlError(null);
    const response = await axios.post("api/streams", {
      creatorId: session.data?.user.id,
      url: videoUrl,
    });
    const videoId = response.data.stream.extractedId;
    if (!videoId) {
      setUrlError("Please enter a valid YouTube URL");
      setIsSubmitting(false);
      return;
    }

    try {
      // In a real app, you would fetch video details from YouTube API
      // For this demo, we'll create mock data
      const newVideo: Video = {
        id: videoId,
        title: `Music Video ${videoId.substring(0, 6)}`,
        thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        votes: 0,
        userVoted: null,
        streamId: response.data.stream.id,
        haveUpVoted: false,
      };

      // Add to queue if not already playing
      if (!currentVideo) {
        setCurrentVideo(newVideo);
      } else {
        setVideoQueue((prev) => [...prev, newVideo]);
      }

      // Clear input
      setVideoUrl("");
    } catch {
      setUrlError("Failed to add video. Please try again.");
    }

    setIsSubmitting(false);
  };

  // Function to handle voting
  const handleVote = async (id: string, direction: "up" | "down") => {
    if (voteInProgress) return;
    setVoteInProgress(true);

    try {
      // Optimistically update UI
      setVideoQueue(
        (prev) =>
          prev
            .map((video) => {
              if (video.streamId === id) {
                // If user already voted in this direction, remove their vote
                if (video.userVoted === direction) {
                  return {
                    ...video,
                    votes:
                      direction === "up" ? video.votes  : video.votes ,
                    userVoted: null,
                  };
                }

                // If user voted in opposite direction, change their vote (counts as 2)
                if (video.userVoted !== null && video.userVoted !== direction) {
                  return {
                    ...video,
                    votes:
                      direction === "up" ? video.votes + 2 : video.votes - 2,
                    userVoted: direction,
                  };
                }

                // If user hasn't voted yet
                return {
                  ...video,
                  votes: direction === "up" ? video.votes + 1 : video.votes - 1,
                  userVoted: direction,
                };
              }
              return video;
            })
            .sort((a, b) => b.votes - a.votes) // Sort by votes
      );

      // Make API call to server
      if (direction === "up") {
        await axios.post("/api/streams/upvote", { streamId: id });
      } else if (direction === "down") {
        await axios.post("/api/streams/downvote", { streamId: id });
      }
    } catch (error) {
      console.error("Error voting:", error);
      // Revert optimistic update on error
      // In a real app, you would fetch the current state from the server
      // For this demo, we'll just show an alert
      // alert("Failed to register vote. Please try again.");
    } finally {
      setVoteInProgress(false);
    }
  };

  // Function to play next video
  const playNext = () => {
    if (videoQueue.length > 0) {
      // Get the video with the highest votes
      const nextVideo = [...videoQueue].sort((a, b) => b.votes - a.votes)[0];
      setCurrentVideo(nextVideo);
      setVideoQueue((prev) =>
        prev.filter((video) => video.id !== nextVideo.id)
      );
    } else {
      setCurrentVideo(null);
    }
  };

  // Function to share the page
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareAlert(true);
    setTimeout(() => setShowShareAlert(false), 3000);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Music className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Muzer</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary">
              Home
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-primary"
            >
              Dashboard
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              Log out
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter mb-2">
              Music <span className="text-primary">Dashboard</span>
            </h1>
            <p className="text-muted-foreground">
              Add YouTube videos to the queue and let your audience vote for
              their favorites.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Viewer Mode</span>
              <Switch
                checked={isStreamer}
                onCheckedChange={setIsStreamer}
                aria-label="Toggle streamer mode"
              />
              <span className="text-sm font-medium">Streamer Mode</span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy link to share with viewers</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {showShareAlert && (
          <Alert className="mb-4 bg-primary/10 border-primary">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <AlertDescription>
                Link copied to clipboard! Share it with your viewers.
              </AlertDescription>
            </div>
          </Alert>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Now Playing Section */}
          <div className="space-y-6">
            <div className="rounded-lg border p-6">
              <h2 className="text-xl font-bold mb-4">Now Playing</h2>
              {currentVideo ? (
                <div className="space-y-4">
                  <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=1`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="h-full w-full"
                    ></iframe>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{currentVideo.title}</h3>
                    </div>
                    {isStreamer && (
                      <Button
                        onClick={playNext}
                        disabled={videoQueue.length === 0}
                      >
                        <SkipForward className="mr-2 h-4 w-4" />
                        Play Next
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 rounded-full bg-primary/10 p-3">
                    <Music className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-medium">No video playing</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Add a YouTube video to get started
                  </p>
                </div>
              )}
            </div>

            {/* YouTube URL Input */}
            <div className="rounded-lg border p-6">
              <h2 className="text-xl font-bold mb-4">Add YouTube Video</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Paste YouTube URL here"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className={cn(urlError && "border-destructive")}
                    />
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Adding
                        </span>
                      ) : (
                        <span>Add to Queue</span>
                      )}
                    </Button>
                  </div>
                  {urlError && (
                    <p className="text-sm text-destructive">{urlError}</p>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Supported formats: youtube.com/watch?v=VIDEO_ID,
                  youtu.be/VIDEO_ID
                </p>
              </form>
            </div>
          </div>

          {/* Video Queue */}
          <div className="rounded-lg border p-6 h-fit">
            <h2 className="text-xl font-bold mb-4">Video Queue</h2>
            {videoQueue.length > 0 ? (
              <div className="space-y-4">
                {videoQueue.map((video) => (
                  <Card key={video.streamId} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex">
                        <div className="relative h-24 w-32 flex-shrink-0">
                          <Image
                            src={video.thumbnail || "/placeholder.svg"}
                            alt={video.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-1 items-center justify-between p-3">
                          <div className="mr-2 flex-1">
                            <h3 className="font-medium line-clamp-2">
                              {video.title}
                            </h3>
                            <div className="mt-1 text-sm text-muted-foreground">
                              Votes:{" "}
                              <span
                                className={cn(
                                  "font-medium",
                                  video.votes > 0
                                    ? "text-primary"
                                    : video.votes < 0
                                    ? "text-destructive"
                                    : ""
                                )}
                              >
                                {video.votes > 0
                                  ? `+${video.votes}`
                                  : video.votes}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleVote(video.streamId, "up")}
                              className={cn(
                                "rounded-full p-2 transition-colors",
                                video.userVoted === "up"
                                  ? "bg-primary text-primary-foreground"
                                  : "hover:bg-primary/10"
                              )}
                              aria-label="Upvote"
                              disabled={
                                voteInProgress || video.userVoted == "up"
                              }
                            >
                              <ThumbsUp className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleVote(video.streamId, "down")}
                              className={cn(
                                "rounded-full p-2 transition-colors",
                                video.userVoted === "down"
                                  ? "bg-destructive text-destructive-foreground"
                                  : "hover:bg-destructive/10"
                              )}
                              aria-label="Downvote"
                              disabled={
                                voteInProgress || video.userVoted == "down"
                              }
                            >
                              <ThumbsDown className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <Play className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-medium">Queue is empty</h3>
                <p className="text-sm text-muted-foreground">
                  Add videos to the queue using the form
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t bg-background">
        <div className="container py-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Muzer. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
