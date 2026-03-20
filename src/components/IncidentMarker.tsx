import React from 'react';
import { Marker } from './Map';
import { Incident } from '../data/mockIncidents';

interface Props {
  incident: Incident;
  onPress?: () => void;
}

export const IncidentMarker: React.FC<Props> = ({ incident, onPress }) => {
  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'THEFT': return 'red';
      case 'HARASSMENT': return 'orange';
      case 'ASSAULT': return 'darkred';
      case 'POOR_LIGHTING': return 'yellow';
      default: return 'blue';
    }
  };

  const markerTitle = incident.type ? incident.type.replace('_', ' ') : 'Unknown';
  
  return (
    <Marker
      coordinate={{
        latitude: Number(incident.latitude) || 0,
        longitude: Number(incident.longitude) || 0
      }}
      title={markerTitle}
      {...(incident.description ? { description: String(incident.description) } : {})}
      pinColor={getMarkerColor(incident.type)}
      onPress={onPress}
    />
  );
};
