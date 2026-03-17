/**
 * Cross-platform Map wrapper component
 * Automatically uses the appropriate map implementation for each platform
 */

import { Platform, StyleSheet, View } from 'react-native';
import React from 'react';

// Dynamic imports based on platform
let MapView: any;
let Marker: any;
let Polyline: any;
let Circle: any;

if (Platform.OS === 'web') {
  // Use the web fallback components
  const WebMap = require('./MapView.web');
  MapView = WebMap.MapView;
  Marker = WebMap.Marker;
  Polyline = WebMap.Polyline;
  Circle = WebMap.Circle;
} else {
  // Use react-native-maps for native platforms
  const RNMaps = require('react-native-maps');
  MapView = RNMaps.default;
  Marker = RNMaps.Marker;
  Polyline = RNMaps.Polyline;
  Circle = RNMaps.Circle;
}

export { MapView, Marker, Polyline, Circle };
export default MapView;
