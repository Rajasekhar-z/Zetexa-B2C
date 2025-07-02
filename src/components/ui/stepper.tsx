import React from 'react';
import { cn } from '@/lib/utils';

interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  children: React.ReactNode;
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ className, orientation = 'horizontal', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          orientation === 'horizontal' ? 'flex-row' : 'flex-col',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Stepper.displayName = 'Stepper';

interface StepProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Step = React.forwardRef<HTMLDivElement, StepProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex-1', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Step.displayName = 'Step';

interface StepLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const StepLabel = React.forwardRef<HTMLDivElement, StepLabelProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('text-sm font-medium', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

StepLabel.displayName = 'StepLabel';

interface StepContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const StepContent = React.forwardRef<HTMLDivElement, StepContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('mt-2', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

StepContent.displayName = 'StepContent';

export { Stepper, Step, StepLabel, StepContent }; 