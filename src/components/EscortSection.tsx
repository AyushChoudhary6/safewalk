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
import {
    BORDER_RADIUS,
    COLORS,
    SHADOWS,
    SPACING,
    TYPOGRAPHY,
} from '../theme';
import { PrimaryButton } from './Button/Button';

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
    avatar: '🧑',
    status: 'busy',
  },
];

const EscortCard: React.FC<{
  escort: Escort;
  onPress: () => void;
  style?: ViewStyle | false;
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

export const EscortSection: React.FC = () => {
  const [selectedEscort, setSelectedEscort] = useState<Escort | null>(null);
  const [requesting, setRequesting] = useState(false);

  const handleRequestEscort = async () => {
    if (!selectedEscort) return;

    setRequesting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRequesting(false);
    alert('Escort requested!');
    setSelectedEscort(null);
  };

  return (
    <View style={styles.content}>
      <Text style={styles.sectionTitle}>Community Escorts</Text>
      <Text style={styles.subtitle}>
        Connect with verified community members for safe walks
      </Text>

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

      <FlatList
        data={MOCK_ESCORTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EscortCard
            escort={item}
            onPress={() => setSelectedEscort(item)}
            style={selectedEscort?.id === item.id && styles.escortCardSelected}
          />
        )}
        scrollEnabled={false}
        style={styles.escortsList}
      />

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
              ~{Math.round(selectedEscort.distance * 5)} mins
            </Text>
          </View>

          <PrimaryButton
            title="Confirm Request"
            onPress={handleRequestEscort}
            loading={requesting}
            style={styles.confirmButton}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: SPACING.xxl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.lg,
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: `${COLORS.primary}10`,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  infoText: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.primary,
    fontWeight: '500',
  },
  escortsList: {
    marginBottom: SPACING.xl,
  },
  escortCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  escortCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}05`,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: SPACING.md,
  },
  avatar: {
    fontSize: 40,
  },
  availableBadge: {
    position: 'absolute',
    bottom: 0,
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
    marginBottom: 4,
  },
  escortName: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginRight: SPACING.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  rating: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '600',
    color: COLORS.text.secondary,
    marginLeft: 4,
  },
  distance: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.tertiary,
  },
  requestButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDetails: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.sm,
  },
  detailsTitle: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  detailLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
  },
  detailValue: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  confirmButton: {
    marginTop: SPACING.lg,
  },
});
