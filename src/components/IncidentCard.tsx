import React, { useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Incident } from '../data/mockIncidents';
import { BORDER_RADIUS, COLORS, SHADOWS, SPACING, TYPOGRAPHY } from '../theme';

interface Props {
  incident: Incident;
  onPress?: () => void;
}

export const IncidentCard: React.FC<Props> = ({ incident, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const getSeverityInfo = (severity: number) => {
    if (severity >= 5) {
      return {
        color: COLORS.riskLevel.critical,
        icon: 'alert-circle',
        label: 'Critical',
        bgColor: COLORS.riskLevel.critical + '15',
      };
    }
    if (severity >= 4) {
      return {
        color: COLORS.riskLevel.high,
        icon: 'exclamation-thick',
        label: 'High Risk',
        bgColor: COLORS.riskLevel.high + '15',
      };
    }
    if (severity >= 3) {
      return {
        color: COLORS.riskLevel.moderate,
        icon: 'alert-octagon',
        label: 'Moderate',
        bgColor: COLORS.riskLevel.moderate + '15',
      };
    }
    return {
      color: COLORS.riskLevel.low,
      icon: 'information-outline',
      label: 'Low Risk',
      bgColor: COLORS.riskLevel.low + '15',
    };
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      friction: 7,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 7,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const displayType = incident?.type ? incident.type.replace('_', ' ').toUpperCase() : 'UNKNOWN';
  const severityInfo = getSeverityInfo(incident?.severity || 1);
  const formattedDate = incident?.timestamp ? new Date(incident.timestamp).toLocaleDateString() : 'Recent';

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: severityInfo.bgColor }]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.7}
      >
        {/* Left Accent Bar */}
        <View style={[styles.indicator, { backgroundColor: severityInfo.color }]} />

        {/* Icon Container */}
        <View style={[styles.iconContainer, { backgroundColor: severityInfo.color + '25' }]}>
          <MaterialCommunityIcons
            name={severityInfo.icon}
            size={18}
            color={severityInfo.color}
          />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <View style={styles.titleSection}>
              <Text style={[styles.severityLabel, { color: severityInfo.color }]}>
                {severityInfo.label}
              </Text>
              <Text style={styles.incidentType}>{displayType}</Text>
            </View>
            <Text style={styles.dateText}>{formattedDate}</Text>
          </View>

          {!!incident?.description && (
            <Text style={styles.description} numberOfLines={2}>
              {incident.description}
            </Text>
          )}

          {/* Meta Info */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons
                name="map-marker"
                size={12}
                color={COLORS.text.tertiary}
              />
              <Text style={styles.metaText}>Nearby</Text>
            </View>
            {incident?.verified && (
              <View style={styles.metaItem}>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={12}
                  color={COLORS.safe}
                />
                <Text style={styles.metaText}>Verified</Text>
              </View>
            )}
            {incident?.verifiedCount > 0 && (
              <View style={styles.metaItem}>
                <MaterialCommunityIcons
                  name="account-multiple"
                  size={12}
                  color={COLORS.text.tertiary}
                />
                <Text style={styles.metaText}>{incident.verifiedCount} reports</Text>
              </View>
            )}
          </View>
        </View>

        {/* Right Arrow */}
        <MaterialCommunityIcons
          name="chevron-right"
          size={20}
          color={COLORS.text.secondary}
          style={styles.chevron}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    marginVertical: SPACING.sm,
    marginHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  indicator: {
    width: 4,
    height: '60%',
    borderRadius: 2,
    marginRight: SPACING.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  titleSection: {
    flex: 1,
  },
  severityLabel: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '700',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  incidentType: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  dateText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.text.tertiary,
    fontWeight: '500',
  },
  description: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
    marginVertical: SPACING.xs,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: SPACING.sm,
    gap: SPACING.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  metaText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.text.tertiary,
    fontWeight: '500',
  },
  chevron: {
    marginLeft: SPACING.sm,
  },
});
