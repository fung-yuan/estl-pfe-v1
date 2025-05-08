import React from 'react';
import { Button } from "@/components/ui/button";

const ButtonExample = () => {
  return (
    <div className="p-6 space-y-4 w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold">Shadcn UI Button Examples</h2>
      
      <div className="space-y-8">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Button Variants</h3>
          <div className="flex flex-wrap gap-4">
            <Button variant="default">Default</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Button Sizes</h3>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="default">Default Size</Button>
            <Button size="sm">Small Size</Button>
            <Button size="lg">Large Size</Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Button States</h3>
          <div className="flex flex-wrap gap-4">
            <Button>Regular</Button>
            <Button disabled>Disabled</Button>
            <Button variant="outline" className="italic">Custom Style</Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Button With Icons</h3>
          <div className="flex flex-wrap gap-4">
            <Button>
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add New
            </Button>
            
            <Button variant="outline">
              Save
              <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ButtonExample;