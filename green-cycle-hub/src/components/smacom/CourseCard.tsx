import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, User } from "lucide-react";

interface Props {
  title: string;
  instructor: string;
  duration: string;
  fee: string;
  ctaLabel?: string;
  progress?: number;
}

export function CourseCard({ title, instructor, duration, fee, ctaLabel = "Enrol Now", progress }: Props) {
  return (
    <Card className="overflow-hidden shadow-sm">
      <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent flex items-center justify-center">
        <div className="text-primary font-bold text-2xl">SMACOM</div>
      </div>
      <div className="p-4 space-y-3">
        <h3 className="font-semibold leading-tight">{title}</h3>
        <div className="space-y-1 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5"><User className="h-4 w-4" />{instructor}</div>
          <div className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{duration}</div>
        </div>
        {progress !== undefined ? (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs"><span className="text-muted-foreground">Progress</span><span className="font-medium">{progress}%</span></div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : (
          <p className="text-base font-bold">{fee}</p>
        )}
        <Button className="w-full">{ctaLabel}</Button>
      </div>
    </Card>
  );
}
