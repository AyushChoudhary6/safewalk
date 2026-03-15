/**
 * AlertModal Component
 * Cross-cutting alert modal for safety notifications
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    View,
    ViewStyle
} from 'react-native';
import { BORDER_RADIUS, COLORS, SHADOWS, SPACING, TYPOGRAPHY, Z_INDEX } from '../../theme';
import { PrimaryButton, SecondaryButton } from '../Button/Button';

type AlertType = 'info' | 'warning' | 'danger' | 'success';

interface AlertModalProps {
  visible: boolean;
  type: AlertType;
  title: string;
  message?: string;
  actionLabel?: string;
  secondaryActionLabel?: string;
  onAction?: () => void;
  onSecondaryAction?: () => void;
  onDismiss?: () => void;
  showCountdown?: boolean;
  countdownSeconds?: number;
  style?: ViewStyle;
}

const ALERT_CONFIG = {
  info: {
    icon: 'information',
    color: COLORS.primary,
    backgroundColor: `${COLORS.primary}10`,
  },
  warning: {
    icon: 'alert',
    color: COLORS.warning,
    backgroundColor: `${COLORS.warning}10`,
  },
  danger: {
    icon: 'alert-circle',
    color: COLORS.danger,
    backgroundColor: `${COLORS.danger}10`,
  },
  success: {
    icon: 'check-circle',
    color: COLORS.safe,
    backgroundColor: `${COLORS.safe}10`,
  },
};

export const AlertModal: React.FC<AlertModalProps> = ({
  visible,
  type,
  title,
  message,
  actionLabel = 'Confirm',
  secondaryActionLabel = 'Cancel',
  onAction,
  onSecondaryAction,
  onDismiss,
  showCountdown = false,
  countdownSeconds = 10,
  style,
}) => {
  const [countdown, setCountdown] = React.useState(countdownSeconds);

  React.useEffect(() => {
    if (visible && showCountdown) {
      setCountdown(countdownSeconds);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            onAction?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [visible, showCountdown, countdownSeconds, onAction]);

  const config = ALERT_CONFIG[type];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={[styles.container, style, SHADOWS.lg]}>
          <View style={[styles.iconContainer, { backgroundColor: config.backgroundColor }]}>
            <MaterialCommunityIcons
              name={config.icon as any}
              size={40}
              color={config.color}
            />
          </View>

          <Text style={styles.title}>{title}</Text>

          {message && <Text style={styles.message}>{message}</Text>}

          {showCountdown && (
            <View style={styles.countdownContainer}>
              <Text style={styles.countdownText}>
                Auto-sending in {countdown}s
              </Text>
            </View>
          )}

          <View style={styles.actions}>
            {onSecondaryAction && (
              <SecondaryButton
                title={secondaryActionLabel}
                onPress={onSecondaryAction}
                style={styles.actionButton}
              />
            )}
            {onAction && (
              <PrimaryButton
                title={actionLabel}
                onPress={onAction}
                style={styles.actionButton}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: Z_INDEX.modal,
  },
  container: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    width: '85%',
    maxWidth: 360,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 22,
  },
  countdownContainer: {
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
  },
  countdownText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  actions: {
    width: '100%',
    gap: SPACING.md,
  },
  actionButton: {
    width: '100%',
  },
});
