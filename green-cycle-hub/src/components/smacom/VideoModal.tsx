import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Maximize2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  title: string;
  onPlayStart?: () => void;
}

export function VideoModal({ isOpen, onClose, videoId, title, onPlayStart }: VideoModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

  useEffect(() => {
    if (isOpen && !hasStarted) {
      setHasStarted(true);
      onPlayStart?.();
    }
  }, [isOpen]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleFullscreen = () => {
    const iframe = document.getElementById(`video-iframe-${videoId}`) as HTMLIFrameElement;
    if (iframe?.requestFullscreen) {
      iframe.requestFullscreen();
    } else if ((iframe as any)?.webkitRequestFullscreen) {
      (iframe as any).webkitRequestFullscreen();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto" onInteractOutside={onClose}>
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="flex-1 truncate">{title}</DialogTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFullscreen}
              title="Fullscreen"
              className="h-8 w-8"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              title="Close"
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="relative w-full bg-black rounded-lg overflow-hidden">
          {/* Loading indicator */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
                <p className="text-sm text-white/70">Loading video...</p>
              </div>
            </div>
          )}

          {/* Video player */}
          <div className="aspect-video">
            <iframe
              id={`video-iframe-${videoId}`}
              width="100%"
              height="100%"
              src={embedUrl}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={handleIframeLoad}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Video description and metadata */}
        <div className="mt-4 pt-4 border-t border-border space-y-2">
          <p className="text-sm text-muted-foreground">
            Video ID: {videoId}
          </p>
          <p className="text-xs text-muted-foreground">
            Video plays within SMACOM platform. Your progress is being tracked automatically.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
