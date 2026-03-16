/**
 * Map component exports - platform-agnostic layer
 * Metro bundler automatically selects:
 * - MapView.web.tsx for web
 * - MapView.native.tsx for native (iOS/Android)
 */

import { Platform } from 'react-native';

let MapComponents;
if (Platform.OS === 'web') {
  MapComponents = require('./MapView.web');
} else {
  MapComponents = require('./MapView.native');
}

export const MapView = MapComponents.MapView || MapComponents.default;
export const Marker = MapComponents.Marker;
export const Polyline = MapComponents.Polyline;
export const Circle = MapComponents.Circle;
export default MapView;

