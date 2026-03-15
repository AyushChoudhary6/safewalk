/**
 * EscortScreen
 * Request or arrange community escorts
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton, SafeWalkMapView } from '../components';
import {
    BORDER_RADIUS,
    COLORS,
    SHADOWS,
    SPACING,
    TYPOGRAPHY,
} from '../theme';

interface EscortScreenProps {
  onRequestEscort?: (escort: any) => void;
}

interface Escort {
  id: string;
  name: string;
  rating: number;
  distance: number;
  verified: boolean;
  avatar: string;
  status: 'available' | 'busy';
}

const MOCK_ESCORTS: Escort[] = [
  {
    id: '1',
    name: 'Sarah M.',
    rating: 4.8,
    distance: 0.8,
    verified: true,
    avatar: '👩',
    status: 'available',
  },
  {
    id: '2',
    name: 'Alex K.',
    rating: 4.9,
    distance: 1.2,
    verified: true,
    avatar: '👨',
    status: 'available',
  },
  {
    id: '3',
    name: 'Jamie T.',
    rating: 4.7,
    distance: 1.5,
    verified: true,
    avatar: '👤',
    status: 'busy',
  },
];

const EscortCard: React.FC<{
  escort: Escort;
  onPress: () => void;
  style?: ViewStyle;
}> = ({ escort, onPress, style }) => {
  return (
    <TouchableOpacity
      style={[styles.escortCard, SHADOWS.sm, style]}
      onPress={onPress}
    >
      <View style={styles.avatarContainer}>
        <Text style={styles.avatar}>{escort.avatar}</Text>
        {escort.status === 'available' && (
          <View style={styles.availableBadge} />
        )}
      </View>

      <View style={styles.escortInfo}>
        <View style={styles.escortHeader}>
          <Text style={styles.escortName}>{escort.name}</Text>
          {escort.verified && (
            <MaterialCommunityIcons
              name="check-decagram"
              size={16}
              color={COLORS.safe}
            />
          )}
        </View>

        <View style={styles.ratingContainer}>
          <MaterialCommunityIcons
            name="star"
            size={14}
            color={COLORS.warning}
          />
          <Text style={styles.rating}>{escort.rating}</Text>
        </View>

        <Text style={styles.distance}>{escort.distance} km away</Text>
      </View>

      <TouchableOpacity
        style={[
          styles.requestButton,
          { opacity: escort.status === 'busy' ? 0.5 : 1 },
        ]}
        disabled={escort.status === 'busy'}
      >
        <MaterialCommunityIcons
          name="phone-outline"
          size={20}
          color={COLORS.primary}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export const EscortScreen: React.FC<EscortScreenProps> = ({
  onRequestEscort,
}) => {
  const [selectedEscort, setSelectedEscort] = useState<Escort | null>(null);
  const [requesting, setRequesting] = useState(false);

  const mockRegion = {
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const handleRequestEscort = async () => {
    if (!selectedEscort) return;

    setRequesting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRequesting(false);

    onRequestEscort?.(selectedEscort);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Map */}
      <View style={styles.mapContainer}>
        <SafeWalkMapView initialRegion={mockRegion} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Community Escorts</Text>
        <Text style={styles.subtitle}>
          Connect with verified community members for safe walks
        </Text>

        {/* Info Banner */}
        <View style={[styles.infoBanner, SHADOWS.sm]}>
          <MaterialCommunityIcons
            name="information"
            size={20}
            color={COLORS.primary}
          />
          <Text style={styles.infoText}>
            All escorts are verified and screened
          </Text>
        </View>

        {/* Escorts List */}
        <FlatList
          data={MOCK_ESCORTS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EscortCard
              escort={item}
              onPress={() => setSelectedEscort(item)}
              style={
                selectedEscort?.id === item.id && styles.escortCardSelected
              }
            />
          )}
          scrollEnabled={false}
          style={styles.escortsList}
        />

        {/* Selected Escort Details */}
        {selectedEscort && (
          <View style={[styles.selectedDetails, SHADOWS.md]}>
            <Text style={styles.detailsTitle}>Request Details</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Escort:</Text>
              <Text style={styles.detailValue}>{selectedEscort.name}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>ETA:</Text>
              <Text style={styles.detailValue}>
                {Math.ceil(selectedEscort.distance * 5)} minutes
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Rating:</Text>
              <View style={styles.ratingBadge}>
                <MaterialCommunityIcons
                  name="star"
                  size={14}
                  color={COLORS.warning}
                />
                <Text style={styles.ratingValue}>{selectedEscort.rating}</Text>
              </View>
            </View>

            {selectedEscort.status === 'busy' && (
              <View style={styles.busyWarning}>
                <MaterialCommunityIcons
                  name="alert-circle"
                  size={16}
                  color={COLORS.warning}
                />
                <Text style={styles.busyText}>Escort currently busy</Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Request Button */}
      {selectedEscort && (
        <PrimaryButton
          title={`Request Escort - ${Math.ceil(selectedEscort.distance * 5)} min ETA`}
          onPress={handleRequestEscort}
          loading={requesting}
          disabled={selectedEscort.status === 'busy' || requesting}
          style={styles.requestButton}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  mapContainer: {
    height: 150,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.h2,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.lg,
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  infoText: {
    flex: 1,
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
  },
  escortsList: {
    marginBottom: SPACING.lg,
  },
  escortCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.base,
    marginBottom: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  escortCardSelected: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    backgroundColor: `${COLORS.primary}05`,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    fontSize: 40,
    marginRight: SPACING.md,
  },
  availableBadge: {
    position: 'absolute',
    bottom: 5,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.safe,
    borderWidth: 2,
    borderColor: COLORS.card,
  },
  escortInfo: {
    flex: 1,
  },
  escortHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  escortName: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  rating: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  distance: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.text.tertiary,
  },
  requestButton: {
    paddingHorizontal: SPACING.base,
  },
  selectedDetails: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  detailsTitle: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  detailLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
  },
  detailValue: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: `${COLORS.warning}15`,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
  },
  ratingValue: {
    fontWeight: '600',
    color: COLORS.warning,
  },
  busyWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: `${COLORS.warning}10`,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.md,
  },
  busyText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.warning,
    fontWeight: '500',
  },
});
