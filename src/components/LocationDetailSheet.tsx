import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme';

interface LocationDetailSheetProps {
  locationName: string;
  duration?: string;
  address?: string;
  onDirections?: () => void;
  onStart?: () => void;
  onSave?: () => void;
  onShare?: () => void;
  onClose?: () => void;
}

export const LocationDetailSheet: React.FC<LocationDetailSheetProps> = ({
  locationName = 'Mata Chanan Devi Hospital',
  duration = '6 min',
  address = 'C-1, Block C1, Janakpuri, New Delhi...',
  onDirections,
  onStart,
  onSave,
  onShare,
  onClose,
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['30%', '60%', '90%'], []);
  const [activeTab, setActiveTab] = useState('Overview');

  const tabs = ['Overview', 'Photos', 'About'];

  return (
    <BottomSheet
      ref={bottomSheetRef}
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
            {locationName}
          </Text>
          <View style={styles.headerIcons}>
             <TouchableOpacity style={styles.iconButton}>
                 <MaterialCommunityIcons name="bookmark-outline" size={24} color="#FFF" />
             </TouchableOpacity>
             <TouchableOpacity style={styles.iconButton}>
                 <MaterialCommunityIcons name="share-variant" size={24} color="#FFF" />
             </TouchableOpacity>
             <TouchableOpacity style={styles.iconButton} onPress={() => bottomSheetRef.current?.close()}>
                 <MaterialCommunityIcons name="close" size={24} color="#FFF" />
             </TouchableOpacity>
          </View>
        </View>
        <View style={styles.subtitleRow}>
          <MaterialCommunityIcons name="car" size={16} color="#A0A0A0" />
          <Text style={styles.subtitleText}>{duration}</Text>
        </View>
      </View>

      <View style={styles.actionButtonsRow}>
        <TouchableOpacity style={[styles.actionButton, styles.primaryButton]} onPress={onDirections}>
          <MaterialCommunityIcons name="directions" size={20} color="#000" />
          <Text style={styles.primaryButtonText}>Directions</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.primaryButton]} onPress={onStart}>
          <MaterialCommunityIcons name="navigation" size={20} color="#000" />
          <Text style={styles.primaryButtonText}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onSave}>
          <MaterialCommunityIcons name="bookmark-outline" size={20} color="#6ED3FF" />
          <Text style={styles.actionButtonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onShare}>
          <MaterialCommunityIcons name="share-outline" size={20} color="#6ED3FF" />
        </TouchableOpacity>
      </View>

      <BottomSheetScrollView contentContainerStyle={styles.scrollContent}>
        {/* Photos Grid Mock */}
        <View style={styles.photosGrid}>
           <View style={styles.largePhoto}>
             <Image source={{uri: 'https://picsum.photos/400/400'}} style={styles.imageFull} />
           </View>
           <View style={styles.smallPhotosCol}>
             <Image source={{uri: 'https://picsum.photos/200/200'}} style={styles.imageHalf} />
             <Image source={{uri: 'https://picsum.photos/200/201'}} style={styles.imageHalf} />
           </View>
        </View>

        {/* Tabs */}
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

        {/* Address Row */}
        <TouchableOpacity style={styles.infoRow}>
           <MaterialCommunityIcons name="map-marker-outline" size={24} color="#FFF" style={styles.infoIcon} />
           <Text style={styles.infoText}>{address}</Text>
           <MaterialCommunityIcons name="chevron-down" size={24} color="#A0A0A0" />
        </TouchableOpacity>
        
        <View style={styles.infoRow}>
           <MaterialCommunityIcons name="alert-circle-outline" size={24} color="#FFF" style={styles.infoIcon} />
           <View style={styles.infoTextCol}>
             <Text style={styles.infoText}>Posting is currently turned off</Text>
             <Text style={styles.detailsText}>Details</Text>
           </View>
        </View>

        <TouchableOpacity style={styles.historyCard}>
           <MaterialCommunityIcons name="history" size={24} color="#FFF" style={styles.infoIcon} />
           <Text style={styles.infoText}>Your visits and Maps history</Text>
           <MaterialCommunityIcons name="chevron-right" size={24} color="#A0A0A0" />
        </TouchableOpacity>
        <View style={{height: 40}} /> 
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: '#1E1E1E',
  },
  handleIndicator: {
    backgroundColor: '#888',
    width: 40,
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
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    paddingRight: 10,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    backgroundColor: '#333',
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
    color: '#A0A0A0',
    fontSize: 14,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  primaryButton: {
    backgroundColor: '#6ED3FF',
  },
  actionButtonText: {
    color: '#6ED3FF',
    fontWeight: '600',
    fontSize: 14,
  },
  primaryButtonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 14,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  photosGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    height: 300,
    marginBottom: 16,
  },
  largePhoto: {
    flex: 2,
    borderRadius: 16,
    overflow: 'hidden',
  },
  smallPhotosCol: {
    flex: 1,
    gap: 8,
  },
  imageFull: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageHalf: {
    width: '100%',
    flex: 1,
    borderRadius: 16,
    resizeMode: 'cover',
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
    color: '#6ED3FF',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 3,
    backgroundColor: '#6ED3FF',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  separator: {
    height: 1,
    backgroundColor: '#333',
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
    color: '#FFF',
    fontSize: 15,
    flex: 1,
  },
  detailsText: {
    color: '#6ED3FF',
    fontSize: 14,
  },
  historyCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: '#2A2A2A',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 16,
  },
});
