/**
 * ActivityScreen
 * View user's historical activity and safety log
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
    ScrollView,
    SectionList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafetyBadge } from '../components';
import {
    BORDER_RADIUS,
    COLORS,
    SHADOWS,
    SPACING,
    TYPOGRAPHY,
} from '../theme';

interface ActivityScreenProps {
  onItemPress?: (item: any) => void;
}

interface ActivityItem {
  id: string;
  type: 'walk' | 'report' | 'alert' | 'escort';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  safetyLevel?: 'low' | 'moderate' | 'high';
}

const ACTIVITY_SECTIONS = [
  {
    title: 'This Week',
    data: [
      {
        id: '1',
        type: 'walk',
        title: 'Completed Walk',
        description: 'Market Street to Union Square - 1.4 km',
        timestamp: '2 hours ago',
        icon: 'check-circle',
        safetyLevel: 'low' as const,
      },
      {
        id: '2',
        type: 'report',
        title: 'Incident Reported',
        description: 'Poor lighting near 3rd Street',
        timestamp: '1 day ago',
        icon: 'flag',
      },
    ],
  },
  {
    title: 'Last Week',
    data: [
      {
        id: '3',
        type: 'escort',
        title: 'Escort Requested',
        description: 'Connected with Sarah M.',
        timestamp: '5 days ago',
        icon: 'shield-check',
      },
      {
        id: '4',
        type: 'alert',
        title: 'Safety Alert',
        description: 'Notified about high-risk area',
        timestamp: '6 days ago',
        icon: 'alert',
      },
      {
        id: '5',
        type: 'walk',
        title: 'Completed Walk',
        description: 'Powell St to North Beach - 2.1 km',
        timestamp: '7 days ago',
        icon: 'check-circle',
        safetyLevel: 'moderate' as const,
      },
    ],
  },
];

const ActivityItemComponent: React.FC<{
  item: ActivityItem;
  onPress: () => void;
}> = ({ item, onPress }) => {
  const typeColors = {
    walk: COLORS.safe,
    report: COLORS.warning,
    alert: COLORS.danger,
    escort: COLORS.primary,
  };

  return (
    <TouchableOpacity style={[styles.activityItem, SHADOWS.sm]} onPress={onPress}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: `${typeColors[item.type]}15` },
        ]}
      >
        <MaterialCommunityIcons
          name={item.icon as any}
          size={24}
          color={typeColors[item.type]}
        />
      </View>

      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <View style={styles.itemMeta}>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
          {item.safetyLevel && (
            <SafetyBadge
              level={item.safetyLevel}
              showLabel={true}
              size="sm"
              style={styles.badge}
            />
          )}
        </View>
      </View>

      <MaterialCommunityIcons
        name="chevron-right"
        size={24}
        color={COLORS.text.tertiary}
      />
    </TouchableOpacity>
  );
};

export const ActivityScreen: React.FC<ActivityScreenProps> = ({
  onItemPress,
}) => {
  const handleItemPress = (item: ActivityItem) => {
    onItemPress?.(item);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Activity</Text>
        <Text style={styles.subtitle}>Your safety journey</Text>
      </View>

      {/* Stats Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.statsScroll}
      >
        <View style={[styles.statCard, SHADOWS.sm]}>
          <MaterialCommunityIcons
            name="walk"
            size={32}
            color={COLORS.primary}
          />
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Safe Walks</Text>
        </View>

        <View style={[styles.statCard, SHADOWS.sm]}>
          <MaterialCommunityIcons
            name="flag"
            size={32}
            color={COLORS.warning}
          />
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Reports</Text>
        </View>

        <View style={[styles.statCard, SHADOWS.sm]}>
          <MaterialCommunityIcons
            name="shield-check"
            size={32}
            color={COLORS.safe}
          />
          <Text style={styles.statNumber}>8</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
      </ScrollView>

      {/* Activity List */}
      <SectionList
        sections={ACTIVITY_SECTIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ActivityItemComponent
            item={item}
            onPress={() => handleItemPress(item)}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
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
  },
  statsScroll: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  statCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginRight: SPACING.md,
    width: 110,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  statNumber: {
    fontSize: TYPOGRAPHY.sizes.h3,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  sectionHeader: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '700',
    color: COLORS.text.secondary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.base,
    marginBottom: SPACING.md,
    gap: SPACING.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  itemDescription: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  timestamp: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.text.tertiary,
  },
  badge: {
    marginLeft: 'auto',
  },
});
