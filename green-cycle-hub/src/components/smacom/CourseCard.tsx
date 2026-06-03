import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, User, Play } from "lucide-react";
import { useState } from "react";
import { VideoModal } from "./VideoModal";
import { extractYouTubeVideoId, recordVideoStart, getCourseProgressById } from "@/lib/video-utils";


interface Props {
  id?: string;
  title: string;
  instructor: string;
  duration: string;
  fee: string;
  youtube_channel?: string;
  ctaLabel?: string;
  progress?: number;
  youtube_url?: string;
}


export function CourseCard({ id, title, instructor, duration, fee, youtube_channel, ctaLabel = "Enrol Now", progress: initialProgress, youtube_url }: Props) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(initialProgress ?? 0);

  const videoId = youtube_url ? extractYouTubeVideoId(youtube_url) : null;

  const handlePlayVideo = () => {
    if (videoId && id) {
      recordVideoStart(id, videoId, title);
      // Update progress display
      const courseProgress = getCourseProgressById(id);
      if (courseProgress) {
        setDisplayProgress(courseProgress.completionPercentage);
      }
    }
    setIsVideoOpen(true);
  };

  // Show thumbnail with play button overlay
  const showThumbnail = videoId && (initialProgress !== undefined || ctaLabel === "Enrol Now");

  return (
    <>
      <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        {/* Video Thumbnail or Placeholder */}
        <div className="aspect-video bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center relative group cursor-pointer overflow-hidden">
          {videoId ? (
            <>
              {/* YouTube thumbnail image */}
              <img
                src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                alt={title}
                className="w-full h-full object-cover group-hover:brightness-75 transition-all"
                onError={(e) => {
                  // Fallback if thumbnail fails to load
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              {/* Play button overlay */}
              <button
                onClick={handlePlayVideo}
                className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all"
                aria-label={`Play ${title}`}
              >
                <div className="inline-flex h-16 w-16 rounded-full bg-white/90 items-center justify-center group-hover:bg-white transition-colors shadow-lg">
                  <Play className="h-7 w-7 text-black ml-1 fill-current" />
                </div>
              </button>
            </>
          ) : (
            <div className="text-primary font-bold text-2xl">SMACOM</div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-4 space-y-3">
          <h3 className="font-semibold leading-tight line-clamp-2">{title}</h3>
          
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{instructor}</span>
            </div>
            {youtube_channel ? (
              <div className="flex items-center gap-1.5 text-xs text-foreground/70">
                Channel: <span className="font-medium truncate">{youtube_channel}</span>
              </div>
            ) : null}
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 flex-shrink-0" />
              <span>{duration}</span>
            </div>
          </div>

          {/* Progress or Fee */}
          {displayProgress !== undefined && displayProgress > 0 ? (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{displayProgress}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all" style={{ width: `${displayProgress}%` }} />
              </div>
            </div>
          ) : (
            <p className="text-base font-bold">{fee}</p>
          )}

          {/* CTA Button */}
          {videoId ? (
            <Button onClick={handlePlayVideo} className="w-full" variant={ctaLabel === "Access course" ? "default" : "outline"}>
              <Play className="h-4 w-4 mr-2 fill-current" />
              {ctaLabel === "Enrol Now" ? "Watch now" : ctaLabel}
            </Button>
          ) : (
            <Button className="w-full">{ctaLabel}</Button>
          )}
        </div>
      </Card>

      {/* Video Modal */}
      {videoId && (
        <VideoModal
          isOpen={isVideoOpen}
          onClose={() => setIsVideoOpen(false)}
          videoId={videoId}
          title={title}
          onPlayStart={() => {
            if (id) recordVideoStart(id, videoId, title);
          }}
        />
      )}
    </>
  );
}
