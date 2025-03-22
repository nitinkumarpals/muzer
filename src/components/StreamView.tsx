"use client";

import type React from "react";
import { toast } from "sonner";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
  Share2,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
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
import { signOut, useSession } from "next-auth/react";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
// Type for stream objects from API
interface Stream {
  id: string;
  extractedId: string;
  title: string;
  smallThumbnail: string;
  bigThumbnail: string;
  upVotes: number;
  haveUpVoted: boolean | null;
  active: boolean;
  type: string;
  url: string;
}

// Separate component for Now Playing to prevent re-renders
const NowPlaying = ({
  stream,
  isStreamer,
  onPlayNext,
  queueLength,
}: {
  stream: Stream | null;
  isStreamer: boolean;
  onPlayNext: () => void;
  queueLength: number;
}) => {
  const playerRef = useRef<HTMLIFrameElement>(null);

  // Only re-render this component if the stream ID changes or streamer status changes
  return (
    <div className="rounded-lg border p-6">
      <h2 className="text-xl font-bold mb-4">Now Playing</h2>
      {stream ? (
        <div className="space-y-4">
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
            <iframe
              ref={playerRef}
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${stream.extractedId}?autoplay=1&enablejsapi=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            ></iframe>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{stream.title}</h3>
            </div>
            {isStreamer && (
              <Button onClick={onPlayNext} disabled={queueLength === 0}>
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
  );
};

// Separate component for Queue Item to prevent re-renders
const QueueItem = ({
  stream,
  onVote,
  voteInProgress,
}: {
  stream: Stream;
  onVote: (id: string, isUpvote: boolean) => void;
  voteInProgress: boolean;
}) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex">
          <div className="relative h-24 w-32 flex-shrink-0">
            <Image
              src={stream.smallThumbnail || "/placeholder.svg"}
              alt={stream.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-1 items-center justify-between p-3">
            <div className="mr-2 flex-1">
              <h3 className="font-medium line-clamp-2">{stream.title}</h3>
              <div className="mt-1 text-sm text-muted-foreground">
                Votes:{" "}
                <span
                  className={cn(
                    "font-medium",
                    stream.upVotes > 0 ? "text-primary" : ""
                  )}
                >
                  {stream.upVotes}
                </span>
              </div>
            </div>
            <div className="flex items-center">
              {/* Show only up arrow if not upvoted or downvoted */}
              {!stream.haveUpVoted && (
                <button
                  onClick={() => onVote(stream.id, true)}
                  className="rounded-full p-2 transition-colors hover:bg-primary/10"
                  aria-label="Upvote"
                  disabled={voteInProgress}
                >
                  <ThumbsUp className="h-5 w-5 text-primary" />
                </button>
              )}

              {/* Show only down arrow if upvoted */}
              {stream.haveUpVoted === true && (
                <button
                  onClick={() => onVote(stream.id, false)}
                  className="rounded-full p-2 transition-colors hover:bg-destructive/10"
                  aria-label="Downvote"
                  disabled={voteInProgress}
                >
                  <ThumbsDown className="h-5 w-5 text-destructive" />
                </button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function StreamView({ creatorId }: { creatorId: string }) {
  const [videoUrl, setVideoUrl] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [currentStreamId, setCurrentStreamId] = useState<string | null>(null);
  const [queueStreamIds, setQueueStreamIds] = useState<string[]>([]);
  const [streamsMap, setStreamsMap] = useState<Record<string, Stream>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStreamer, setIsStreamer] = useState(true);
  const [showShareAlert, setShowShareAlert] = useState(false);
  const [voteInProgress, setVoteInProgress] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const session = useSession();
  // Memoized current stream to prevent re-renders
  const currentStream = useMemo(
    () => (currentStreamId ? streamsMap[currentStreamId] : null),
    [currentStreamId, streamsMap]
  );

  // Memoized queue streams to prevent re-renders
  const queueStreams = useMemo(
    () =>
      queueStreamIds
        .map((id) => streamsMap[id])
        .filter(Boolean)
        .sort((a, b) => b.upVotes - a.upVotes),
    [queueStreamIds, streamsMap]
  );

  // Function to fetch streams from API
  const fetchStreams = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/streams/?creatorId=${creatorId}`);
      const fetchedStreams = response.data.streams;

      // Create a map of streams by ID for efficient lookups
      const newStreamsMap: Record<string, Stream> = {};
      fetchedStreams.forEach((stream: Stream) => {
        // Normalize the haveUpVoted property to be true, false, or null
        newStreamsMap[stream.id] = {
          ...stream,
          haveUpVoted:
            stream.haveUpVoted === undefined ? null : stream.haveUpVoted,
        };
      });

      setStreamsMap(newStreamsMap);

      if (fetchedStreams.length > 0) {
        // Set the first stream as current if we don't have one yet
        if (!currentStreamId) {
          setCurrentStreamId(fetchedStreams[0].id);
          setQueueStreamIds(fetchedStreams.slice(1).map((s: Stream) => s.id));
        } else {
          // Otherwise, update the queue while preserving the current stream
          const queueIds = fetchedStreams
            .filter((s: Stream) => s.id !== currentStreamId)
            .map((s: Stream) => s.id);
          setQueueStreamIds(queueIds);
        }
      } else {
        setCurrentStreamId(null);
        setQueueStreamIds([]);
      }
    } catch (err) {
      console.error("Error fetching streams:", err);
      setError("Failed to load streams. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  }, [currentStreamId]);

  // Fetch streams on component mount
  useEffect(() => {
    fetchStreams();

    // Set up polling to refresh queue data without affecting the current stream
    const intervalId = setInterval(() => {
      fetchStreams();
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(intervalId);
  }, [fetchStreams]);

  // Function to validate YouTube URL and extract video ID
  const validateYouTubeUrl = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUrlError(null);

    const videoId = validateYouTubeUrl(videoUrl);

    if (!videoId) {
      setUrlError("Please enter a valid YouTube URL");
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post("api/streams", {
        creatorId: session.data?.user.id,
        url: videoUrl,
      });

      // Refresh streams to get the new video
      await fetchStreams();

      // Clear input
      setVideoUrl("");
    } catch (error) {
      console.error("Error adding video:", error);
      setUrlError("Failed to add video. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle voting with modified behavior
  const handleVote = async (streamId: string, isUpvote: boolean) => {
    if (voteInProgress) return;
    setVoteInProgress(true);

    try {
      // Optimistically update UI
      setStreamsMap((prev) => {
        const stream = prev[streamId];
        if (!stream) return prev;

        // Set vote count to 1 for upvote, 0 for downvote
        const newVoteCount = isUpvote ? 1 : 0;

        return {
          ...prev,
          [streamId]: {
            ...stream,
            upVotes: newVoteCount,
            haveUpVoted: isUpvote,
          },
        };
      });

      // Make API call to server
      if (isUpvote) {
        await axios.post("/api/streams/upvote", { streamId });
      } else {
        await axios.post("/api/streams/downvote", { streamId });
      }

      // Refresh streams to get updated vote counts, but don't update the UI immediately
      const response = await axios.get(`/api/streams/?creatorId=${creatorId}`);
      const fetchedStreams = response.data.streams;

      // Update the streams map with the latest data
      const newStreamsMap: Record<string, Stream> = { ...streamsMap };
      fetchedStreams.forEach((stream: Stream) => {
        newStreamsMap[stream.id] = {
          ...stream,
          haveUpVoted: stream.haveUpVoted,
        };
      });

      setStreamsMap(newStreamsMap);
    } catch (error) {
      console.error("Error voting:", error);
      setError("Failed to register vote. Please try again.");
      // Refresh streams to get correct state
      await fetchStreams();
    } finally {
      setVoteInProgress(false);
    }
  };

  // Function to play next video
  const playNext = useCallback(async () => {
    if (!currentStreamId) return;

    try {
      // Remove current stream from backend
      await axios.delete(
        `/api/streams/deleteStream?streamId=${currentStreamId}`
      );

      if (queueStreams.length > 0) {
        // Get the stream with the highest votes
        const nextStream = queueStreams[0];
        setCurrentStreamId(nextStream.id);
        setQueueStreamIds((prev) => prev.filter((id) => id !== nextStream.id));
      } else {
        setCurrentStreamId(null);
      }
    } catch (error) {
      console.error("Error playing next stream:", error);
      setError("Failed to play next video. Please try again.");
    }
  }, [currentStreamId, queueStreams]);

  // Function to handle video end
  const handleVideoEnd = useCallback(async () => {
    await playNext();
  }, [playNext]);

  // Function to share the page
  const handleShare = () => {
    //todo: can be changed later to hostname instead of href
    const sharableLink = `${window.location.hostname}/creator/${session.data?.user.id}`;
    navigator.clipboard.writeText(sharableLink);
    toast("Link copied to clipboard!", {
      description: "Share it with your viewers.",
      duration: 3000,
      style: {
        background: "#34c759",
        color: "#fff",
      },
    });
    setShowShareAlert(true);
    setTimeout(() => setShowShareAlert(false), 3000);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Music className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Harmonic</span>
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
            <Button
              variant="destructive"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
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
        {error && (
          <Alert className="mb-4 bg-destructive/10 border-destructive">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <AlertDescription>{error}</AlertDescription>
            </div>
          </Alert>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Now Playing Section */}
          <div className="space-y-6">
            {isLoading && !currentStream ? (
              <div className="rounded-lg border p-6">
                <h2 className="text-xl font-bold mb-4">Now Playing</h2>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4">
                    <svg
                      className="animate-spin h-8 w-8 text-primary"
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
                  </div>
                  <h3 className="mb-2 text-xl font-medium">Loading...</h3>
                </div>
              </div>
            ) : (
              <NowPlaying
                stream={currentStream}
                isStreamer={isStreamer}
                onPlayNext={playNext}
                queueLength={queueStreams.length}
              />
            )}

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
              {validateYouTubeUrl(videoUrl) && (
                <div className="max-w-[500px] w-full overflow-hidden rounded-lg shadow-sm mt-2 mx-auto">
                  <LiteYouTubeEmbed
                    id={validateYouTubeUrl(videoUrl) || ""}
                    title={videoUrl}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Video Queue */}
          <div className="rounded-lg border p-6 h-fit">
            <h2 className="text-xl font-bold mb-4">Video Queue</h2>
            {isLoading && queueStreams.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4">
                  <svg
                    className="animate-spin h-8 w-8 text-primary"
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
                </div>
                <h3 className="mb-2 text-xl font-medium">Loading queue...</h3>
              </div>
            ) : queueStreams.length > 0 ? (
              <div className="space-y-4">
                {queueStreams.map((stream) => (
                  <QueueItem
                    key={stream.id}
                    stream={stream}
                    onVote={handleVote}
                    voteInProgress={voteInProgress}
                  />
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
            {new Date().getFullYear()} Harmonic. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
