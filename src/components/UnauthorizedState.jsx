import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UnauthorizedState() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center p-6">
      <div className="max-w-md text-center">
        <ShieldAlert className="mx-auto mb-4 h-10 w-10 text-destructive" aria-hidden="true" />
        <h1 className="text-2xl font-semibold">Access denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">You do not have permission to access this area.</p>
        <Button asChild className="mt-6">
          <Link to="/dashboard">Return to your dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
