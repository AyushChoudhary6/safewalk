/**
 * Simplified MapView fallback for web
 * Uses a canvas-based map visualization or simple styling
 */

import React, { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const MapView = React.forwardRef<any, any>((props, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref && typeof ref === 'object') {
      ref.current = {
        animateToRegion: () => {
          // Fallback animation
        },
        animateCamera: () => {
          // Fallback animation
        },
      };
    }
  }, [ref]);

  return (
    <View style={[styles.container, props.style]}>
      {/* Web map placeholder using HTML div */}
      <div
        ref={containerRef as any}
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          backgroundColor: '#e5e3df',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          color: '#666',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Text style={{ marginBottom: 10, fontSize: 16, fontWeight: 'bold' }}>
            📍 Map View
          </Text>
          <Text style={{ fontSize: 12, color: '#999' }}>
            Web map support - interactive features available on mobile
          </Text>
        </div>
      </div>

      {/* Render children (markers, polylines, circles) */}
      {props.showsUserLocation && (
        <View style={styles.userLocationIndicator}>
          <View style={styles.userDot} />
          <Text style={styles.userText}>Current Location</Text>
        </View>
      )}

      {props.children}
    </View>
  );
});

export default MapView;

// Marker component for web fallback
export const Marker: React.FC<any> = (props) => {
  return (
    <TouchableOpacity
      style={styles.markerPlaceholder}
      onPress={props.onPress}
    >
      <View style={styles.markerDot} />
    </TouchableOpacity>
  );
};

// Polyline component for web fallback
export const Polyline: React.FC<any> = (props) => {
  return (
    <View style={[styles.polylinePlaceholder, { borderColor: props.strokeColor }]}>
      <Text style={styles.polylineText}>Route</Text>
    </View>
  );
};

// Circle component for web fallback
export const Circle: React.FC<any> = (props) => {
  return (
    <View
      style={[
        styles.circlePlaceholder,
        {
          borderColor: props.strokeColor,
          backgroundColor: props.fillColor,
        },
      ]}
    >
      <Text style={styles.circleText}>⚠</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
  },
  userLocationIndicator: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'center',
  },
  userDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2196F3',
    marginBottom: 5,
  },
  userText: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '600',
  },
  markerPlaceholder: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ff0000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  markerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  polylinePlaceholder: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 4,
    padding: 8,
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  polylineText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
  },
  circlePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  circleText: {
    fontSize: 20,
  },
});

