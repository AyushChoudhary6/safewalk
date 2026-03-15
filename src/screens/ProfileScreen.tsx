/**
 * ProfileScreen
 * User profile and settings
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/RootNavigator';
import { EscortSection } from '../components/EscortSection';
import {
    BORDER_RADIUS,
    COLORS,
    SHADOWS,
    SPACING,
    TYPOGRAPHY,
} from '../theme';

interface ProfileScreenProps {
  onLogout?: () => void;
  onPremium?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onLogout,
  onPremium,
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [notifications, setNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={[styles.profileHeader, SHADOWS.md]}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>👤</Text>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.userName}>Alex Johnson</Text>
            <Text style={styles.userEmail}>alex@example.com</Text>
            <View style={styles.trustBadge}>
              <MaterialCommunityIcons
                name="check-decagram"
                size={16}
                color={COLORS.safe}
              />
              <Text style={styles.trustText}>Verified Member</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.editButton}>
            <MaterialCommunityIcons
              name="pencil"
              size={20}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Premium Section */}
        <TouchableOpacity style={[styles.premiumSection, SHADOWS.sm]}>
          <View style={styles.premiumContent}>
            <MaterialCommunityIcons
              name="crown"
              size={24}
              color={COLORS.warning}
            />
            <View style={styles.premiumText}>
              <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
              <Text style={styles.premiumSubtitle}>
                Get exclusive safety features
              </Text>
            </View>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color={COLORS.text.tertiary}
          />
        </TouchableOpacity>

        {/* Settings Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety & Privacy</Text>

          {/* Emergency Contacts */}
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => navigation.navigate('EmergencyContacts')}
          >
            <View style={styles.settingIcon}>
              <MaterialCommunityIcons
                name="phone"
                size={20}
                color={COLORS.primary}
              />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Emergency Contacts</Text>
              <Text style={styles.settingDescription}>
                2 contacts added
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color={COLORS.text.tertiary}
            />
          </TouchableOpacity>

          {/* Notifications */}
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <MaterialCommunityIcons
                name="bell"
                size={20}
                color={COLORS.warning}
              />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Alert Notifications</Text>
              <Text style={styles.settingDescription}>
                Get real-time safety alerts
              </Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: COLORS.border, true: `${COLORS.safe}60` }}
              thumbColor={notifications ? COLORS.safe : COLORS.text.tertiary}
            />
          </View>
        </View>

        {/* Privacy Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sharing & Data</Text>

          {/* Location Sharing */}
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <MaterialCommunityIcons
                name="map-marker"
                size={20}
                color={COLORS.primary}
              />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Live Location</Text>
              <Text style={styles.settingDescription}>
                Share during active walks
              </Text>
            </View>
            <Switch
              value={locationSharing}
              onValueChange={setLocationSharing}
              trackColor={{ false: COLORS.border, true: `${COLORS.safe}60` }}
              thumbColor={
                locationSharing ? COLORS.safe : COLORS.text.tertiary
              }
            />
          </View>

          {/* Emergency Alerts */}
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <MaterialCommunityIcons
                name="alert-circle"
                size={20}
                color={COLORS.danger}
              />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Emergency Alerts</Text>
              <Text style={styles.settingDescription}>
                Auto-send SOS alerts
              </Text>
            </View>
            <Switch
              value={emergencyAlerts}
              onValueChange={setEmergencyAlerts}
              trackColor={{ false: COLORS.border, true: `${COLORS.danger}60` }}
              thumbColor={
                emergencyAlerts ? COLORS.danger : COLORS.text.tertiary
              }
            />
          </View>

          {/* Privacy Policy */}
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <MaterialCommunityIcons
                name="file-document"
                size={20}
                color={COLORS.text.secondary}
              />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Privacy Policy</Text>
              <Text style={styles.settingDescription}>
                How we protect your data
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color={COLORS.text.tertiary}
            />
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <MaterialCommunityIcons
                name="information"
                size={20}
                color={COLORS.primary}
              />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>App Version</Text>
              <Text style={styles.settingDescription}>1.0.0</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <MaterialCommunityIcons
                name="help-circle"
                size={20}
                color={COLORS.primary}
              />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Help & Support</Text>
              <Text style={styles.settingDescription}>Contact us</Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color={COLORS.text.tertiary}
            />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, SHADOWS.sm]}
          onPress={onLogout}
        >
          <MaterialCommunityIcons
            name="logout"
            size={20}
            color={COLORS.danger}
          />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  profileHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.lg,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    fontSize: 32,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  userEmail: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  trustText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '600',
    color: COLORS.safe,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumSection: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: `${COLORS.warning}30`,
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: SPACING.lg,
  },
  premiumText: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  premiumSubtitle: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
  },
  section: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '700',
    color: COLORS.text.secondary,
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.base,
    marginBottom: SPACING.md,
    gap: SPACING.md,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  settingDescription: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
    backgroundColor: `${COLORS.danger}10`,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    gap: SPACING.md,
    borderWidth: 1,
    borderColor: `${COLORS.danger}30`,
  },
  logoutText: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: '600',
    color: COLORS.danger,
  },
  spacer: {
    height: SPACING.xxl,
  },
});
