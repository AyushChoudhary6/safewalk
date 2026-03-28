/**
 * IncidentMarker
 * Renders a single incident as a branded custom map pin.
 * Imported by HomeScreen and placed inside <MapView>.
 */

import React from 'react';
import { Marker } from './Map'; // re-export from src/components/Map/index.ts
import { Incident } from '../data/mockIncidents';
import { CustomMapPin, PinType } from './Map/CustomMapPin';

interface Props {
  incident: Incident;
  onPress?: () => void;
}

// Map backend enum strings → PinType
const TYPE_MAP: Record<string, PinType> = {
  THEFT: 'THEFT',
  HARASSMENT: 'HARASSMENT',
  POOR_LIGHTING: 'POOR_LIGHTING',
  ASSAULT: 'ASSAULT',
  SUSPICIOUS_ACTIVITY: 'SUSPICIOUS_ACTIVITY',
};

// Short labels shown below the pin bubble
const LABEL_MAP: Record<string, string> = {
  THEFT: 'Theft',
  HARASSMENT: 'Harass.',
  POOR_LIGHTING: 'Lighting',
  ASSAULT: 'Assault',
  SUSPICIOUS_ACTIVITY: 'Suspic.',
};

export const IncidentMarker: React.FC<Props> = ({ incident, onPress }) => {
  const pinType: PinType = TYPE_MAP[incident.type] ?? 'SUSPICIOUS_ACTIVITY';
  const label = LABEL_MAP[incident.type] ?? 'Incident';

  return (
    <Marker
      coordinate={{ latitude: incident.latitude, longitude: incident.longitude }}
      onPress={onPress}
      anchor={{ x: 0.5, y: 1 }}
      tracksViewChanges={false} // important for performance — prevents re-render on every map frame
    >
      <CustomMapPin type={pinType} label={label} />
    </Marker>
  );
};

