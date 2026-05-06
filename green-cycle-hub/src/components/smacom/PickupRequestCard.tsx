import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Image as ImageIcon, Package } from "lucide-react";

interface Props {
  producer: string;
  type: string;
  quantity: number;
  distance: number;
  address: string;
}

export function PickupRequestCard({ producer, type, quantity, distance, address }: Props) {
  return (
    <Card className="p-5 shadow-sm">
      <div className="flex flex-col md:flex-row gap-5">
        <div className="md:w-40 h-32 rounded-md bg-secondary border border-border flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <ImageIcon className="h-6 w-6 mx-auto mb-1" />
            <p className="text-xs">Waste Photo</p>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold">{producer}</h3>
              <p className="text-sm text-muted-foreground">{type}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold flex items-center gap-1">
                <Package className="h-4 w-4 text-primary" />
                {quantity} kg
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{distance} km away</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {address}
          </div>
          <div className="pt-2">
            <Button className="w-full md:w-auto">Accept Pickup</Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
