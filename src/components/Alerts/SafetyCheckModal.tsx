import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Animated, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BORDER_RADIUS, COLORS, SHADOWS, SPACING, TYPOGRAPHY } from '../../theme';

interface SafetyCheckModalProps {
  visible: boolean;
  onSafe: () => void;
  onHelp: () => void;
  countdownSeconds?: number;
}

export const SafetyCheckModal: React.FC<SafetyCheckModalProps> = ({
  visible,
  onSafe,
  onHelp,
  countdownSeconds = 120,
}) => {
  const [timeLeft, setTimeLeft] = useState(countdownSeconds);
  const pulseAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    if (visible) {
      setTimeLeft(countdownSeconds);
      
      // Pulse animation for visual urgency
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          })
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    
    if (timeLeft <= 0) {
      onHelp(); // Auto-trigger help when countdown reaches 0
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, visible, onHelp]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const getTimerColor = () => {
    if (timeLeft > 60) return COLORS.warning;
    if (timeLeft > 30) return '#F97316'; // Orange
    return COLORS.error; // Red
  };

  return (
    <Modal visible={visible} transparent animationType="slide" hardwareAccelerated>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <MaterialCommunityIcons name="alert" size={40} color={COLORS.error} />
            <Text style={styles.title}>Are you safe?</Text>
            <Text style={styles.subtitle}>You've entered a flagged danger zone.</Text>
          </View>

          <Animated.View style={[styles.timerContainer, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={[styles.timerText, { color: getTimerColor() }]}>
              {formatTime(timeLeft)}
            </Text>
            <Text style={styles.timerSubText}>Auto-calling help in...</Text>
          </Animated.View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={[styles.button, styles.safeButton]} onPress={onSafe}>
              <MaterialCommunityIcons name="shield-check" size={24} color="#FFF" />
              <Text style={styles.buttonText}>YES, I AM SAFE</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.helpButton]} onPress={onHelp}>
              <MaterialCommunityIcons name="phone-outgoing" size={24} color="#FFF" />
              <Text style={styles.buttonText}>NO, HELP ME</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    width: '100%',
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.h1,
    fontWeight: '800',
    color: COLORS.text.primary,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: SPACING.xl,
    padding: SPACING.lg,
    backgroundColor: '#F3F4F6',
    borderRadius: BORDER_RADIUS.full,
    width: 200,
    height: 200,
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#E5E7EB',
  },
  timerText: {
    fontSize: 48,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  timerSubText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
    marginTop: SPACING.sm,
  },
  actionButtons: {
    width: '100%',
    gap: SPACING.md,
  },
  button: {
    width: '100%',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  safeButton: {
    backgroundColor: COLORS.success || '#10B981',
  },
  helpButton: {
    backgroundColor: COLORS.error,
  },
  buttonText: {
    color: '#FFF',
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: '700',
  },
});
