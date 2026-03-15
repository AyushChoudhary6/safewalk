/**
 * ReportIncidentScreen
 * Screen for users to report safety incidents
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import { getCurrentLocation } from '../services/locationService';
import { fetchAddressFromCoordinates } from '../services/mapsService';
import { PrimaryButton } from '../components';
import {
    BORDER_RADIUS,
    COLORS,
    SHADOWS,
    SPACING,
    TYPOGRAPHY,
} from '../theme';

interface ReportIncidentScreenProps {
  onSubmit?: (incident: any) => void;
  onCancel?: () => void;
}

const INCIDENT_TYPES = [
  { id: 'poor_lighting', label: 'Poor Lighting', icon: 'lightbulb-off' },
  { id: 'harassment', label: 'Harassment', icon: 'alert-circle' },
  { id: 'theft', label: 'Theft', icon: 'lock-alert' },
  { id: 'unsafe_area', label: 'Unsafe Area', icon: 'shield-alert' },
  { id: 'felt_safe', label: 'Felt Safe', icon: 'check-circle' },
];

export const ReportIncidentScreen: React.FC<ReportIncidentScreenProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const [locationAddress, setLocationAddress] = useState<string>('Locating...');

  React.useEffect(() => {
    const fetchLoc = async () => {
      const loc = await getCurrentLocation();
      if (loc) setLocation({ latitude: loc.latitude, longitude: loc.longitude });
    };
    fetchLoc();
  }, []);

  React.useEffect(() => {
    if (location) {
      setLocationAddress('Fetching address...');
      fetchAddressFromCoordinates(location)
        .then(addr => setLocationAddress(addr))
        .catch(() => setLocationAddress(`${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`));
    }
  }, [location]);

  const defaultRegion = {
    latitude: location?.latitude || 37.7749,
    longitude: location?.longitude || -122.4194,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const handleSubmit = async () => {
    if (!selectedType) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);

    onSubmit?.({
      type: selectedType,
      description,
      timestamp: new Date().toISOString(),
      location: location || defaultRegion,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          {/* Interactive Map */}
        <View style={styles.mapContainer}>
          <MapView
            style={StyleSheet.absoluteFillObject}
            region={defaultRegion}
            onPress={(e) => setLocation(e.nativeEvent.coordinate)}
          >
            {location && (
              <Marker
                coordinate={location}
                draggable
                onDragEnd={(e) => setLocation(e.nativeEvent.coordinate)}
              />
            )}
          </MapView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onCancel}
          >
            <MaterialCommunityIcons
              name="close"
              size={24}
              color={COLORS.text.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Form Content */}
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>What happened?</Text>
          <Text style={styles.subtitle}>
            Help the community by reporting what you experienced
          </Text>

          {/* Incident Type Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Incident Type</Text>
            <View style={styles.typeGrid}>
              {INCIDENT_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.typeButton,
                    selectedType === type.id && styles.typeButtonActive,
                  ]}
                  onPress={() => setSelectedType(type.id)}
                >
                  <MaterialCommunityIcons
                    name={type.icon as any}
                    size={24}
                    color={
                      selectedType === type.id
                        ? COLORS.primary
                        : COLORS.text.secondary
                    }
                  />
                  <Text
                    style={[
                      styles.typeLabel,
                      selectedType === type.id && styles.typeLabelActive,
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          
          {/* Location Coordinates Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Selected Location</Text>
            <View style={[styles.coordinatesBox, SHADOWS.sm]}>
              <MaterialCommunityIcons name="map-marker" size={20} color={COLORS.primary} />
              <TextInput
                style={styles.coordinatesInput}
                value={
                  location
                    ? `${locationAddress} | ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`
                    : 'Locating...'
                }
                editable={false}
                multiline={true}
              />
            </View>
          </View>

          {/* Description Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Details (Optional)</Text>
            <TextInput
              style={[styles.textArea, SHADOWS.sm]}
              placeholder="Describe what happened..."
              placeholderTextColor={COLORS.text.tertiary}
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
              textAlignVertical="top"
            />
          </View>

          {/* Info Box */}
          <View style={[styles.infoBox, SHADOWS.sm]}>
            <MaterialCommunityIcons
              name="information"
              size={20}
              color={COLORS.primary}
            />
            <Text style={styles.infoText}>
              Your report is anonymous and helps keep the community safe
            </Text>
          </View>
                {/* Action Buttons */}
        <View style={[styles.actions, SHADOWS.lg]}>
          <TouchableOpacity
            style={[styles.cancelButton, SHADOWS.sm]}
            onPress={onCancel}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <PrimaryButton
            title="Submit Report"
            onPress={handleSubmit}
            loading={loading}
            disabled={!selectedType || loading}
            style={{ flex: 1 }}
          />
        </View>
        </ScrollView>


        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  mapContainer: {
    height: 200,
    backgroundColor: COLORS.background,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: SPACING.base,
    right: SPACING.base,
    backgroundColor: COLORS.card,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.h2,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xl,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  typeButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  typeButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}10`,
  },
  typeLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '600',
    color: COLORS.text.secondary,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  typeLabelActive: {
    color: COLORS.primary,
  },
  coordinatesBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    gap: SPACING.md,
  },
  coordinatesInput: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.primary,
  },
  textArea: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.base,
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.text.primary,
    maxHeight: 150,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    gap: SPACING.md,
    marginBottom: SPACING.xxl,
  },
  infoText: {
    flex: 1,
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.card,
  },
  cancelButton: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.base,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLORS.text.primary,
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: '600',
  },
});
