/**
 * PremiumScreen
 * Premium features showcase and subscription management
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { PrimaryButton, SecondaryButton } from '../components';
import {
    BORDER_RADIUS,
    COLORS,
    SHADOWS,
    SPACING,
    TYPOGRAPHY,
} from '../theme';

interface PremiumScreenProps {
  onSubscribe?: () => void;
  onCancel?: () => void;
}

const PREMIUM_FEATURES = [
  {
    id: '1',
    icon: 'account-multiple-check',
    title: 'Family Tracking',
    description: 'Real-time location sharing with family members',
    premium: true,
  },
  {
    id: '2',
    icon: 'auto-fix',
    title: 'Auto Check-in',
    description: 'Automatic safety check-ins during walks',
    premium: true,
  },
  {
    id: '3',
    icon: 'microphone-outline',
    title: 'Emergency Recording',
    description: 'Secure recording vault for incidents',
    premium: true,
  },
  {
    id: '4',
    icon: 'analytics',
    title: 'Advanced Insights',
    description: 'Detailed safety analytics and trends',
    premium: true,
  },
  {
    id: '5',
    icon: 'map-marker-check',
    title: 'Safe Routes',
    description: 'AI-powered safe route recommendations',
    premium: false,
  },
  {
    id: '6',
    icon: 'bell-alert',
    title: 'Alerts',
    description: 'Real-time safety notifications',
    premium: false,
  },
];

interface FeatureItemProps {
  feature: (typeof PREMIUM_FEATURES)[0];
  locked: boolean;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ feature, locked }) => (
  <View style={[styles.featureItem, locked && styles.featureItemLocked]}>
    <View style={styles.featureIcon}>
      {locked ? (
        <MaterialCommunityIcons
          name="lock"
          size={24}
          color={COLORS.text.tertiary}
        />
      ) : (
        <MaterialCommunityIcons
          name={feature.icon as any}
          size={24}
          color={COLORS.primary}
        />
      )}
    </View>

    <View style={styles.featureContent}>
      <Text style={[styles.featureTitle, locked && styles.featureTitleLocked]}>
        {feature.title}
        {feature.premium && !locked && (
          <Text style={styles.premiumBadgeInline}> ⭐</Text>
        )}
      </Text>
      <Text style={styles.featureDescription}>{feature.description}</Text>
    </View>

    {locked && (
      <MaterialCommunityIcons
        name="lock"
        size={16}
        color={COLORS.text.tertiary}
      />
    )}
  </View>
);

export const PremiumScreen: React.FC<PremiumScreenProps> = ({
  onSubscribe,
  onCancel,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>(
    'annual'
  );
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async () => {
    setSubscribing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSubscribing(false);
    onSubscribe?.();
  };

  const monthlyPrice = 9.99;
  const annualPrice = 89.99;
  const annualSavings = (monthlyPrice * 12 - annualPrice).toFixed(2);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="crown"
            size={48}
            color={COLORS.warning}
          />
          <Text style={styles.headerTitle}>SafeWalk Premium</Text>
          <Text style={styles.headerSubtitle}>
            Advanced protection for your journey
          </Text>
        </View>

        {/* Plan Selection */}
        <View style={styles.plansContainer}>
          <TouchableOpacity
            style={[
              styles.planCard,
              selectedPlan === 'monthly' && styles.planCardActive,
              SHADOWS.sm,
            ]}
            onPress={() => setSelectedPlan('monthly')}
          >
            <Text style={styles.planName}>Monthly</Text>
            <Text style={styles.planPrice}>${monthlyPrice}</Text>
            <Text style={styles.planPeriod}>/month</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.planCard,
              selectedPlan === 'annual' && styles.planCardActive,
              SHADOWS.sm,
            ]}
            onPress={() => setSelectedPlan('annual')}
          >
            <View style={styles.savingsBadge}>
              <Text style={styles.savingsText}>
                Save ${annualSavings}
              </Text>
            </View>
            <Text style={styles.planName}>Annual</Text>
            <Text style={styles.planPrice}>${annualPrice}</Text>
            <Text style={styles.planPeriod}>/year</Text>
          </TouchableOpacity>
        </View>

        {/* Features List */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>What You'll Get</Text>

          {PREMIUM_FEATURES.map((feature) => (
            <FeatureItem
              key={feature.id}
              feature={feature}
              locked={feature.premium}
            />
          ))}
        </View>

        {/* Benefits Section */}
        <View style={styles.benefitsSection}>
          <Text style={styles.sectionTitle}>Why Premium?</Text>

          <View style={[styles.benefitCard, SHADOWS.sm]}>
            <MaterialCommunityIcons
              name="shield-check"
              size={28}
              color={COLORS.safe}
            />
            <Text style={styles.benefitTitle}>Maximum Protection</Text>
            <Text style={styles.benefitDescription}>
              Access all safety features to stay protected 24/7
            </Text>
          </View>

          <View style={[styles.benefitCard, SHADOWS.sm]}>
            <MaterialCommunityIcons
              name="heart-handshake"
              size={28}
              color={COLORS.danger}
            />
            <Text style={styles.benefitTitle}>Priority Support</Text>
            <Text style={styles.benefitDescription}>
              Get help from our dedicated support team anytime
            </Text>
          </View>

          <View style={[styles.benefitCard, SHADOWS.sm]}>
            <MaterialCommunityIcons
              name="trending-up"
              size={28}
              color={COLORS.primary}
            />
            <Text style={styles.benefitTitle}>Advanced Analytics</Text>
            <Text style={styles.benefitDescription}>
              Track your safety trends and community impact
            </Text>
          </View>
        </View>

        {/* Trial Info */}
        <View style={[styles.trialBox, SHADOWS.sm]}>
          <MaterialCommunityIcons
            name="information"
            size={20}
            color={COLORS.primary}
          />
          <Text style={styles.trialText}>
            Get <Text style={styles.trialBold}>7 days free</Text>. Cancel
            anytime.
          </Text>
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={[styles.actions, SHADOWS.lg]}>
        <SecondaryButton
          title="Maybe Later"
          onPress={onCancel}
          style={{ flex: 1 }}
        />
        <PrimaryButton
          title="Start Free Trial"
          onPress={handleSubscribe}
          loading={subscribing}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: SPACING.xl,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.sizes.h2,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.text.secondary,
  },
  plansContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
    marginBottom: SPACING.xxl,
  },
  planCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  planCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}05`,
  },
  savingsBadge: {
    backgroundColor: COLORS.safe,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    marginBottom: SPACING.md,
  },
  savingsText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '700',
    color: COLORS.card,
  },
  planName: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  planPrice: {
    fontSize: TYPOGRAPHY.sizes.h2,
    fontWeight: '700',
    color: COLORS.primary,
    marginVertical: SPACING.sm,
  },
  planPeriod: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
  },
  featuresSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xxl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.base,
    marginBottom: SPACING.md,
    gap: SPACING.md,
  },
  featureItemLocked: {
    opacity: 0.7,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  featureTitleLocked: {
    color: COLORS.text.secondary,
  },
  premiumBadgeInline: {
    fontSize: TYPOGRAPHY.sizes.sm,
  },
  featureDescription: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
  },
  benefitsSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xxl,
  },
  benefitCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  benefitTitle: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  benefitDescription: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  trialBox: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
    flexDirection: 'row',
    gap: SPACING.md,
    alignItems: 'center',
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  trialText: {
    flex: 1,
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.text.secondary,
  },
  trialBold: {
    fontWeight: '700',
    color: COLORS.primary,
  },
  spacer: {
    height: SPACING.xl,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.card,
  },
});
