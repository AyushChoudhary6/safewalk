import React from 'react';
import { Marker } from './Map';
import { Incident } from '../data/mockIncidents';

interface Props {
  incident: Incident;
  onPress?: () => void;
}

export const IncidentMarker: React.FC<Props> = ({ incident, onPress }) => {
  const getSeverityInfo = (severity: number) => {
    if (severity >= 5) return { color: 'red', label: 'High Alert' };
    if (severity >= 3) return { color: 'orange', label: 'Orange Alert' };
    return { color: 'yellow', label: 'Yellow Alert' };
  };

  const severityInfo = getSeverityInfo(incident.severity || 1);
  const baseTitle = incident.type ? incident.type.replace('_', ' ') : 'Unknown';
  const markerTitle = `${severityInfo.label}: ${baseTitle}`;
  const formattedDate = incident.timestamp ? new Date(incident.timestamp).toLocaleDateString() : 'Recent';
  const fullDescription = incident.description 
    ? `${incident.description} (${formattedDate})`
    : `Date: ${formattedDate}`;

  return (
    <Marker
      coordinate={{
        latitude: Number(incident.latitude) || 0,
        longitude: Number(incident.longitude) || 0
      }}
      title={markerTitle}
      description={fullDescription}
      pinColor={severityInfo.color}
      onPress={onPress}
    />
  );
};
