import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";

interface Props {
  name: string;
  price: string;
  unit: string;
  seller: string;
}

export function ProductCard({ name, price, unit, seller }: Props) {
  return (
    <Card className="overflow-hidden shadow-sm transition hover:shadow-md">
      <div className="aspect-[4/3] bg-accent flex items-center justify-center text-primary">
        <Leaf className="h-12 w-12 opacity-60" />
      </div>
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold leading-tight">{name}</h3>
          <p className="text-xs text-muted-foreground mt-1">Sold by {seller}</p>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold">{price}</span>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>
        <Button className="w-full" variant="default">Add to Cart</Button>
      </div>
    </Card>
  );
}
