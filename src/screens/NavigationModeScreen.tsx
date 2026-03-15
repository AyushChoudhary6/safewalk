/**
 * NavigationModeScreen
 * Active navigation display while walking
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    AlertModal,
    SafeWalkMapView
} from '../components';
import {
    BORDER_RADIUS,
    COLORS,
    SHADOWS,
    SPACING,
    TYPOGRAPHY,
} from '../theme';

interface NavigationModeScreenProps {
  route?: any;
  onComplete?: () => void;
  onEmergency?: () => void;
  onCancel?: () => void;
}

export const NavigationModeScreen: React.FC<NavigationModeScreenProps> = ({
  route,
  onComplete,
  onEmergency,
  onCancel,
}) => {
  const [progress, setProgress] = useState(0);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          onComplete?.();
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [onComplete]);

  const mockRegion = {
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <>
      <View style={styles.container}>
        {/* Map */}
        <SafeWalkMapView initialRegion={mockRegion} />

        {/* Top Navigation Bar */}
        <View style={[styles.topBar, SHADOWS.md]}>
          <TouchableOpacity onPress={onCancel} style={styles.backButton}>
            <MaterialCommunityIcons
              name="chevron-left"
              size={28}
              color={COLORS.text.primary}
            />
          </TouchableOpacity>

          <View style={styles.navigationInfo}>
            <Text style={styles.distanceRemaining}>
              {(route?.distance || 1.4).toFixed(1)} km remaining
            </Text>
            <Text style={styles.eta}>ETA: {route?.duration || 12} min</Text>
          </View>

          <TouchableOpacity style={styles.helpButton}>
            <MaterialCommunityIcons
              name="help-circle-outline"
              size={24}
              color={COLORS.text.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Progress Indicator */}
        <View style={[styles.progressContainer, SHADOWS.md]}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Route Progress</Text>
            <Text style={styles.progressPercent}>{Math.floor(progress)}%</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBar,
                { width: `${progress}%` },
              ]}
            />
          </View>
        </View>

        {/* Safety Alert Box */}
        <View style={[styles.alertBox, SHADOWS.md]}>
          <View style={styles.alertIcon}>
            <MaterialCommunityIcons
              name="alert"
              size={20}
              color={COLORS.warning}
            />
          </View>
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Low Lighting Ahead</Text>
            <Text style={styles.alertMessage}>Stay alert in this area</Text>
          </View>
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="close"
              size={20}
              color={COLORS.text.secondary}
            />
          </TouchableOpacity>
        </View>

        {/* Bottom Controls */}
        <View style={[styles.bottomControls, SHADOWS.lg]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.controlsScroll}
          >
            <TouchableOpacity style={[styles.controlButton, SHADOWS.sm]}>
              <MaterialCommunityIcons
                name="phone-outline"
                size={20}
                color={COLORS.text.primary}
              />
              <Text style={styles.controlLabel}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.controlButton, SHADOWS.sm]}>
              <MaterialCommunityIcons
                name="share-variant"
                size={20}
                color={COLORS.text.primary}
              />
              <Text style={styles.controlLabel}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.controlButton, SHADOWS.sm]}>
              <MaterialCommunityIcons
                name="map-marker-check"
                size={20}
                color={COLORS.text.primary}
              />
              <Text style={styles.controlLabel}>Check-in</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, styles.emergencyControl]}
              onPress={() => setShowAlert(true)}
            >
              <MaterialCommunityIcons
                name="alert-circle"
                size={20}
                color={COLORS.card}
              />
              <Text style={[styles.controlLabel, styles.emergencyLabel]}>
                Emergency
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      {/* Emergency Confirmation Modal */}
      <AlertModal
        visible={showAlert}
        type="danger"
        title="Are you safe?"
        message="This will alert your emergency contacts and share your live location."
        actionLabel="Send Alert"
        secondaryActionLabel="Cancel"
        onAction={() => {
          setShowAlert(false);
          onEmergency?.();
        }}
        onSecondaryAction={() => setShowAlert(false)}
        showCountdown={true}
        countdownSeconds={10}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.base,
    zIndex: 10,
    gap: SPACING.base,
  },
  backButton: {
    padding: SPACING.sm,
  },
  navigationInfo: {
    flex: 1,
  },
  distanceRemaining: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  eta: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
  helpButton: {
    padding: SPACING.sm,
  },
  progressContainer: {
    position: 'absolute',
    top: 80,
    left: SPACING.lg,
    right: SPACING.lg,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.base,
    zIndex: 10,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  progressLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  progressPercent: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '600',
    color: COLORS.primary,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.safe,
    borderRadius: BORDER_RADIUS.full,
  },
  alertBox: {
    position: 'absolute',
    top: 160,
    left: SPACING.lg,
    right: SPACING.lg,
    backgroundColor: `${COLORS.warning}15`,
    borderRadius: BORDER_RADIUS.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    zIndex: 10,
    gap: SPACING.md,
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${COLORS.warning}30`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  alertMessage: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.card,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    zIndex: 10,
  },
  controlsScroll: {
    flexDirection: 'row',
  },
  controlButton: {
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    marginRight: SPACING.md,
    gap: SPACING.sm,
  },
  emergencyControl: {
    backgroundColor: COLORS.danger,
  },
  controlLabel: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  emergencyLabel: {
    color: COLORS.card,
  },
});
