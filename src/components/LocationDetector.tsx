
import { Button } from '@/components/ui/button';
import { MapPin, Loader2, AlertCircle } from 'lucide-react';
import { useLocation } from '@/hooks/useLocation';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LocationDetectorProps {
  onLocationDetected?: (city: string) => void;
  className?: string;
}

const LocationDetector = ({ onLocationDetected, className }: LocationDetectorProps) => {
  const { city, isLoading, error, getCurrentLocation, clearLocation } = useLocation();

  const handleGetLocation = async () => {
    await getCurrentLocation();
  };

  // Call the callback when city is detected
  if (city && onLocationDetected) {
    onLocationDetected(city);
  }

  return (
    <div className={className}>
      {!city && !error && (
        <Button
          onClick={handleGetLocation}
          disabled={isLoading}
          variant="outline"
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Detecting location...
            </>
          ) : (
            <>
              <MapPin className="h-4 w-4 mr-2" />
              Get Current Location
            </>
          )}
        </Button>
      )}

      {city && (
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-800">
              Location detected: {city}
            </span>
          </div>
          <Button
            onClick={clearLocation}
            variant="ghost"
            size="sm"
            className="text-green-700 hover:text-green-900"
          >
            Change
          </Button>
        </div>
      )}

      {error && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            {error}. Please select your city manually.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default LocationDetector;
