import React from 'react';
import { Leaf } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center animate-pulse">
        <Leaf className="w-6 h-6 text-primary" />
      </div>
      <div className="w-8 h-8 border-3 border-muted border-t-primary rounded-full animate-spin" />
    </div>
  );
}