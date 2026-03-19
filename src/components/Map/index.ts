/**
 * Map component exports - platform-agnostic layer
 * Metro bundler automatically selects:
 * - MapView.web.tsx for web
 * - MapView.native.tsx for native (iOS/Android)
 */

import MapView, { Marker, Polyline, Circle } from './MapView';

export { MapView, Marker, Polyline, Circle };
export default MapView;

