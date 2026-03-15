import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Incident } from '../../data/mockIncidents';
import { COLORS, SHADOWS } from '../../theme';

interface SafetyBannerProps {
  riskLevel: 'Safe' | 'Moderate' | 'Dangerous';
  incidents: Incident[];
}

export const SafetyBanner: React.FC<SafetyBannerProps> = ({ riskLevel, incidents }) => {
  if (!riskLevel || incidents.length === 0) return null;

  const getConfig = () => {
    switch (riskLevel) {
      case 'Safe':
        return { color: '#22C55E', icon: 'shield-check', title: 'Safe Route' };
      case 'Moderate':
        return { color: '#F59E0B', icon: 'shield-alert', title: 'Moderate Risk' };
      case 'Dangerous':
        return { color: '#EF4444', icon: 'alert-octagon', title: 'High Risk Route' };
      default:
        return { color: '#6B7280', icon: 'shield-outline', title: 'Unknown' };
    }
  };

  const { color, icon, title } = getConfig();

  return (
    <View style={[styles.container, SHADOWS.md]}>
      <View style={[styles.header, { backgroundColor: color }]}>
        <MaterialCommunityIcons name={icon as any} size={24} color="#FFF" />
        <Text style={styles.headerText}>{title}</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.summaryText}>
          {incidents.length} incident{incidents.length > 1 ? 's' : ''} detected on this route
        </Text>
        
        {incidents.slice(0, 3).map((incident, index) => (
          <View key={incident.id} style={styles.incidentRow}>
            <View style={[styles.bullet, { backgroundColor: color }]} />
            <Text style={styles.incidentText} numberOfLines={2}>
              <Text style={styles.incidentType}>{incident.type.replace('_', ' ')}: </Text>
              {incident.description}
            </Text>
          </View>
        ))}
        {incidents.length > 3 && (
          <Text style={styles.moreText}>+ {incidents.length - 3} more</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  content: {
    padding: 16,
  },
  summaryText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 12,
  },
  incidentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
    marginRight: 8,
  },
  incidentText: {
    flex: 1,
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },
  incidentType: {
    fontWeight: '600',
    color: '#111827',
  },
  moreText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    fontStyle: 'italic',
  }
});
