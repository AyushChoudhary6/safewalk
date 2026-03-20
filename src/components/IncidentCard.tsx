import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Incident } from '../data/mockIncidents';

interface Props {
  incident: Incident;
  onPress?: () => void;
}

export const IncidentCard: React.FC<Props> = ({ incident, onPress }) => {
  const getColor = (type: string) => {
    switch (type) {
      case 'THEFT': return 'red';
      case 'HARASSMENT': return 'orange';
      case 'ASSAULT': return 'darkred';
      case 'POOR_LIGHTING': return '#EAB308'; // darker yellow for text readability
      default: return 'blue';
    }
  };

  const displayType = incident?.type ? incident.type.replace('_', ' ') : 'UNKNOWN';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.indicator, { backgroundColor: getColor(incident?.type) }]} />
      <View style={styles.content}>
        <Text style={[styles.incidentType, { color: getColor(incident?.type) }]}>
          {displayType}
        </Text>
        {!!incident?.description && (
          <Text style={styles.description}>
            {incident.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 4,
    marginHorizontal: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#eee',
  },
  indicator: {
    width: 6,
    borderRadius: 3,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  incidentType: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#333',
  },
});
