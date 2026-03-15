import React from 'react';
import { Marker } from 'react-native-maps';
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

  return (
    <Marker
      coordinate={{
        latitude: incident.latitude,
        longitude: incident.longitude
      }}
      title={incident.type}
      description={incident.description}
      pinColor={getMarkerColor(incident.type)}
      onPress={onPress}
    />
  );
};
