import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function InvalidRoleState() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center p-6">
      <div className="max-w-md text-center">
        <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-destructive" aria-hidden="true" />
        <h1 className="text-2xl font-semibold">Account access needs attention</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your account does not have a valid platform role. Please contact an administrator.
        </p>
        <Button asChild className="mt-6">
          <Link to="/">Return home</Link>
        </Button>
      </div>
    </div>
  );
}
