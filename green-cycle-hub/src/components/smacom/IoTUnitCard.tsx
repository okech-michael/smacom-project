import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "./StatusBadge";
import { Thermometer, Droplets, Wind, Container } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  name: string;
  temp: number;
  moisture: number;
  co2: number;
  fill: number;
  stage: string;
  progress: number;
  status: "optimal" | "alert" | "warning";
}

export function IoTUnitCard({ name, temp, moisture, co2, fill, stage, progress, status }: Props) {
  const borderClass =
    status === "alert" ? "border-destructive/60 ring-1 ring-destructive/30" :
    status === "warning" ? "border-warning/50" : "";

  return (
    <Card className={cn("p-5 shadow-sm", borderClass)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground">{name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{stage}</p>
        </div>
        <StatusBadge status={status} label={status === "optimal" ? "Optimal" : status === "alert" ? "ALERT" : "WARNING"} />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <Reading icon={Thermometer} label="Temperature" value={`${temp}°C`} />
        <Reading icon={Droplets} label="Moisture" value={`${moisture}%`} />
        <Reading icon={Wind} label="CO₂" value={`${co2} ppm`} />
        <Reading icon={Container} label="Fill Level" value={`${fill}%`} />
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Cycle progress</span>
          <span className="font-medium text-foreground">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    </Card>
  );
}

function Reading({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-secondary/40 p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="text-base font-semibold">{value}</p>
    </div>
  );
}
