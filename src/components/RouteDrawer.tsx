import React, { useMemo, useRef, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Incident } from '../data/mockIncidents';
import { IncidentCard } from './IncidentCard';
import { COLORS } from '../theme';

interface Props {
  distance: number;
  duration: number;
  incidents: Incident[];
  onIncidentPress: (incident: Incident) => void;
  isVisible: boolean;
}

export const RouteDrawer: React.FC<Props> = ({ 
  distance, 
  duration, 
  incidents, 
  onIncidentPress,
  isVisible 
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['30%', '55%', '90%'], []);
  const [selectedTab, setSelectedTab] = useState<'drive' | 'details'>('drive');

  useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.snapToIndex(1);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible]);

  const mins = Math.ceil(duration / 60);
  
  const getEta = (seconds: number) => {
    const date = new Date(Date.now() + seconds * 1000);
    let hours = date.getHours();
    const m = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return "" + hours + ":" + m + " " + ampm;
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isVisible ? 1 : -1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      style={styles.sheet}
    >
      <BottomSheetView style={styles.headerContainer}>
        {/* Top Summary */}
        <View style={styles.summarySection}>
          <View style={styles.mainContent}>
            <View style={styles.timeSection}>
              <Text style={styles.mainTime}>{mins} min</Text>
              <Text style={styles.arrivalTime}>Arrive by {getEta(duration)}</Text>
            </View>

            <View style={styles.dividerVertical} />

            <View style={styles.trafficSection}>
              <View style={[styles.trafficDot, { backgroundColor: '#22C55E' }]} />
              <Text style={styles.trafficText}>No traffic</Text>
            </View>
          </View>

          <View style={styles.recommendedBadge}>
            <MaterialCommunityIcons name="check-circle" size={16} color="#22C55E" />
            <Text style={styles.recommendedText}>Recommended</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'drive' && styles.activeTab]}
            onPress={() => setSelectedTab('drive')}
          >
            <MaterialCommunityIcons 
              name="car" 
              size={18} 
              color={selectedTab === 'drive' ? COLORS.primary : COLORS.text.secondary} 
            />
            <Text style={[styles.tabText, selectedTab === 'drive' && styles.activeTabText]}>
              Drive
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, selectedTab === 'details' && styles.activeTab]}
            onPress={() => setSelectedTab('details')}
          >
            <MaterialCommunityIcons 
              name="information-outline" 
              size={18} 
              color={selectedTab === 'details' ? COLORS.primary : COLORS.text.secondary} 
            />
            <Text style={[styles.tabText, selectedTab === 'details' && styles.activeTabText]}>
              Details
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>

      <BottomSheetScrollView contentContainerStyle={styles.scrollContent}>
        {selectedTab === 'drive' && (
          <View style={styles.routesContainer}>
            <View style={styles.routeOption}>
              <View style={styles.routeOptionContent}>
                <View style={styles.routeTime}>
                  <Text style={styles.routeTimeText}>{mins} min</Text>
                  <Text style={styles.recommendedLabel}>Recommended</Text>
                </View>
                <View style={styles.routeDetails}>
                  <Text style={styles.routeDistance}>{distance.toFixed(1)} km</Text>
                  <View style={[styles.trafficIndicator, { backgroundColor: '#22C55E' }]} />
                </View>
              </View>
            </View>
            <View style={styles.routeOption}>
              <View style={styles.routeOptionContent}>
                <View style={styles.routeTime}>
                  <Text style={styles.routeTimeTextAlt}>{mins + 3} min</Text>
                </View>
                <View style={styles.routeDetails}>
                  <Text style={styles.routeDistance}>{(distance + 0.5).toFixed(1)} km</Text>
                  <View style={[styles.trafficIndicator, { backgroundColor: '#22C55E' }]} />
                </View>
              </View>
            </View>
            <View style={styles.routeOption}>
              <View style={styles.routeOptionContent}>
                <View style={styles.routeTime}>
                  <Text style={styles.routeTimeTextAlt}>{mins + 5} min</Text>
                </View>
                <View style={styles.routeDetails}>
                  <Text style={styles.routeDistance}>{(distance + 1.2).toFixed(1)} km</Text>
                  <View style={[styles.trafficIndicator, { backgroundColor: '#22C55E' }]} />
                </View>
              </View>
            </View>
          </View>
        )}

        <View style={styles.divider} />

        {/* Crime Incidents Start */}
        <Text style={styles.sectionTitle}>
          Incidents on Route ({incidents.length})
        </Text>
        
        {incidents.length === 0 ? (
          <Text style={styles.noIncidents}>No incidents reported along this route.</Text>
        ) : (
          incidents.map((incident) => (
            <IncidentCard 
              key={incident.id} 
              incident={incident} 
              onPress={() => onIncidentPress(incident)} 
            />
          ))
        )}
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  sheet: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    backgroundColor: '#fff',
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  summarySection: {
    marginBottom: 16,
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeSection: {
    flex: 1,
  },
  mainTime: {
    fontSize: 40,
    fontWeight: '800',
    color: '#000',
  },
  arrivalTime: {
    fontSize: 16,
    color: '#666',
    marginTop: 2,
    fontWeight: '500'
  },
  dividerVertical: {
    width: 1,
    height: 48,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  trafficSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  trafficDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  trafficText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '700',
  },
  recommendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  recommendedText: {
    color: '#16A34A',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
    marginBottom: -2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.secondary,
    marginLeft: 8,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    marginLeft: 16,
  },
  scrollContent: {
    paddingBottom: 24,
    paddingTop: 8,
  },
  noIncidents: {
    marginHorizontal: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  routesContainer: {
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  routeOption: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  routeOptionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  routeTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routeTimeText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  routeTimeTextAlt: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4B5563',
  },
  recommendedLabel: {
    color: '#16A34A',
    fontSize: 12,
    fontWeight: '600',
  },
  routeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routeDistance: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  trafficIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
