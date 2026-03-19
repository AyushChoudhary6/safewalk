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
    Alert,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from '../components/Map';
import { getCurrentLocation } from '../services/locationService';
import { fetchAddressFromCoordinates } from '../services/mapsService';
import { apiService } from '../services/apiService';
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
  { id: 'POOR_LIGHTING', label: 'Poor Lighting', icon: 'lightbulb-off' },
  { id: 'HARASSMENT', label: 'Harassment', icon: 'alert-circle' },
  { id: 'THEFT', label: 'Theft', icon: 'lock-alert' },
  { id: 'ASSAULT', label: 'Assault', icon: 'shield-alert' },
  { id: 'SUSPICIOUS_ACTIVITY', label: 'Suspicious Activity', icon: 'alert-octagon' },
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
  const [severity, setSeverity] = useState(3);
  const [submitting, setSubmitting] = useState(false);

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
    // Ensure we have a fallback location if web geo API blocks it
    const finalLocation = location || { latitude: 37.7749, longitude: -122.4194 };
    
    if (!selectedType) {
      if (Platform.OS === 'web') alert('Missing Information: Please select an incident type');
      else Alert.alert('Missing Information', 'Please select an incident type');
      return;
    }

    setSubmitting(true);
    try {
      // Call backend API to report incident
      const response = await apiService.reportIncident(
        selectedType,
        finalLocation.latitude,
        finalLocation.longitude,
        severity,
        description || undefined,
        true // anonymous
      );

      if (response.success) {
        // Show success message
        if (Platform.OS === 'web') alert('Report Submitted Successfully! Thank you for keeping the community safe.');
        
        Alert.alert(
          'Report Submitted',
          'Thank you for helping keep the community safe!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Call the onSubmit callback with the incident data
                onSubmit?.({
                  ...response.data,
                  type: selectedType,
                  description,
                  timestamp: new Date().toISOString(),
                  location: finalLocation,
                });
              },
            },
          ]
        );
      } else {
        throw new Error(response.error || 'Failed to submit report');
      }
    } catch (error: any) {
      console.log('Error submitting incident:', error);
      if (Platform.OS === 'web') alert(`Error: ${error.message || 'Failed to submit report. Please try again.'}`);
      
      Alert.alert(
        'Error',
        error.message || 'Failed to submit report. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setSubmitting(false);
    }
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
                  disabled={submitting}
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

          {/* Severity Level */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Severity Level</Text>
            <View style={styles.severityContainer}>
              {[1, 2, 3, 4, 5].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.severityButton,
                    severity === level && styles.severityButtonActive,
                  ]}
                  onPress={() => setSeverity(level)}
                  disabled={submitting}
                >
                  <Text
                    style={[
                      styles.severityText,
                      severity === level && styles.severityTextActive,
                    ]}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.severityHint}>1 = Low Risk, 5 = High Risk</Text>
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
              Your report is anonymous and helps keep the community safe. Data is shared in real-time.
            </Text>
          </View>
                {/* Action Buttons */}
        <View style={[styles.actions, SHADOWS.lg]}>
          <TouchableOpacity
            style={[styles.cancelButton, SHADOWS.sm]}
            onPress={onCancel}
            disabled={submitting}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <PrimaryButton
            title={submitting ? "Submitting..." : "Submit Report"}
            onPress={handleSubmit}
            loading={submitting}
            disabled={!selectedType || submitting}
            style={{ flex: 1 }}
          />
        </View>

        {/* Real-time Status */}
        {submitting && (
          <View style={styles.statusContainer}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.statusText}>Sending to SafeWalk network...</Text>
          </View>
        )}
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
  severityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  severityButton: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  severityButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}10`,
  },
  severityText: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  severityTextActive: {
    color: COLORS.primary,
  },
  severityHint: {
    fontSize: TYPOGRAPHY.sizes.caption,
    color: COLORS.text.tertiary,
    marginTop: SPACING.sm,
    textAlign: 'center',
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
  statusContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.base,
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: `${COLORS.primary}10`,
  },
  statusText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
});
