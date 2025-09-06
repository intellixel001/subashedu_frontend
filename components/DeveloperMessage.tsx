"use client";

import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';

export default function DeveloperMessage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the message has been dismissed before
    const isDismissed = localStorage.getItem('devMessageDismissed_2_1_0');
    if (!isDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Remember dismissal in localStorage
    localStorage.setItem('devMessageDismissed_2_1_0', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
      <div className="relative bg-card border border-border rounded-lg shadow-xl overflow-hidden w-80">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-primary to-myred p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-bold text-primary-foreground">App Update 2.1.0</h1>
            <button 
              onClick={handleClose}
              className="text-primary-foreground hover:text-white transition-colors"
              aria-label="Close message"
            >
              <IoClose size={20} />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4 space-y-3 text-sm">
          <p className="font-medium text-foreground">Updated pages:</p>
          
          <ul className="space-y-2 list-disc list-inside text-muted-foreground">
            <li className="pl-2">Materials upload page</li>
            <li className="pl-2">Blog upload page</li>
          </ul>
          
          <p className="text-foreground">
            Find them in your dashboard
          </p>
          
          <div className="mt-4 p-3 bg-secondary/50 rounded-md border border-border">
            <p className="font-medium text-primary-foreground">Important notice:</p>
            <p className="text-sm text-muted-foreground mt-1">
              To avoid any error, admins and moderators are requested to press <code className="bg-muted px-1.5 py-0.5 rounded">CTRL+SHIFT+R</code> to fetch the updates properly.
            </p>
          </div>
        </div>
        
        {/* Gradient accent at bottom */}
        <div className="h-1 bg-gradient-to-r from-myred to-primary"></div>
      </div>
    </div>
  );
}