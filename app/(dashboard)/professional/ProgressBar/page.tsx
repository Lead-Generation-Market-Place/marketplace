import { ProgressBar } from '@/components/ui/Progressbar';

export default function Page() {
  return (
    <div>
      <ProgressBar currentStep={2} totalSteps={4} />
    </div>
  );
}
