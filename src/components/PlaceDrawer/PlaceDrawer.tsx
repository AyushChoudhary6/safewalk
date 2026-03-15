import React, { useMemo, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActionButtons } from './ActionButtons';
import { PhotoGallery } from './PhotoGallery';

export interface PlaceData {
  id: string;
  name: string;
  address: string;
  duration?: string;
  photos?: string[];
  type?: string;
  distance?: string;
}

interface PlaceDrawerProps {
  place: PlaceData | null;
  onClose: () => void;
  onDirections?: (place: PlaceData) => void;
  onStart?: (place: PlaceData) => void;
}

export const PlaceDrawer: React.FC<PlaceDrawerProps> = ({
  place,
  onClose,
  onDirections,
  onStart,
}) => {
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);
  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = ['Overview', 'Photos', 'About'];

  if (!place) {
    return null;
  }

  return (
    <BottomSheet
      index={1}
      snapPoints={snapPoints}
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
      enablePanDownToClose
      onClose={onClose}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.titleName} numberOfLines={2}>
            {place.name}
          </Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialCommunityIcons name="bookmark-outline" size={24} color="#555" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialCommunityIcons name="share-variant" size={24} color="#555" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#555" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.subtitleRow}>
          <MaterialCommunityIcons name="car" size={16} color="#777" />
          <Text style={styles.subtitleText}>{place.duration || '6 min'} • {place.distance || '2 km'}</Text>
        </View>
      </View>

      <ActionButtons
        onDirections={() => onDirections && onDirections(place)}
        onStart={() => onStart && onStart(place)}
        onSave={() => {}}
        onShare={() => {}}
      />

      <BottomSheetScrollView contentContainerStyle={styles.scrollContent}>
        <PhotoGallery photos={place.photos} />

        <View style={styles.tabsRow}>
          {tabs.map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={styles.tab}>
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
              {activeTab === tab && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.separator} />

        {activeTab === 'Overview' && (
          <View>
            <TouchableOpacity style={styles.infoRow}>
              <MaterialCommunityIcons name="map-marker-outline" size={24} color="#444" style={styles.infoIcon} />
              <Text style={styles.infoText}>{place.address}</Text>
              <MaterialCommunityIcons name="chevron-down" size={24} color="#A0A0A0" />
            </TouchableOpacity>

            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="clock-outline" size={24} color="#444" style={styles.infoIcon} />
              <View style={styles.infoTextCol}>
                <Text style={styles.infoText}>Open 24 hours</Text>
                <Text style={styles.detailsText}>See more hours</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="alert-circle-outline" size={24} color="#444" style={styles.infoIcon} />
              <View style={styles.infoTextCol}>
                <Text style={styles.infoText}>Posting is currently turned off</Text>
                <Text style={styles.detailsText}>Details</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.historyCard}>
              <MaterialCommunityIcons name="history" size={24} color="#444" style={styles.infoIcon} />
              <Text style={styles.infoText}>Your visits and Maps history</Text>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#A0A0A0" />
            </TouchableOpacity>
          </View>
        )}
        <View style={{ height: 40 }} />
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  handleIndicator: {
    backgroundColor: '#DDDDDD',
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleName: {
    color: '#111',
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    paddingRight: 10,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    backgroundColor: '#F5F5F5',
    padding: 8,
    borderRadius: 20,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  subtitleText: {
    color: '#555',
    fontSize: 14,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-around',
    marginTop: 10,
  },
  tab: {
    alignItems: 'center',
    paddingVertical: 10,
    flex: 1,
  },
  tabText: {
    color: '#888',
    fontSize: 15,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#0B84FF',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 3,
    backgroundColor: '#0B84FF',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  separator: {
    height: 1,
    backgroundColor: '#EEEEEE',
    width: '100%',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 16,
  },
  infoIcon: {
    width: 24,
  },
  infoTextCol: {
    flex: 1,
    gap: 4,
  },
  infoText: {
    color: '#333',
    fontSize: 15,
    flex: 1,
  },
  detailsText: {
    color: '#0B84FF',
    fontSize: 14,
  },
  historyCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 16,
  },
});
