import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent-purple mx-auto mb-4" />
        <p className="text-text-secondary">Loading...</p>
      </div>
    </div>
  );
}
