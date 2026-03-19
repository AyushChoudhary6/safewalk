import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { MapContainer, TileLayer, Marker as LeafletMarker, Polyline as LeafletPolyline, Circle as LeafletCircle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLngExpression } from 'leaflet';

// Fix Leaflet icons issue
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapController = ({ region, mapRef }: any) => {
  const map = useMap();
  useEffect(() => {
    if (region && region.latitude && region.longitude) {
      map.setView([region.latitude, region.longitude], map.getZoom() || 13);
    }
  }, [region, map]);
  
  useEffect(() => {
    if (mapRef) {
      mapRef.current = {
        animateToRegion: (r: any) => {
          if (r && r.latitude && r.longitude) {
            map.flyTo([r.latitude, r.longitude], 15);
          }
        },
        animateCamera: () => {},
      };
    }
  }, [map, mapRef]);
  return null;
};

export const MapView = React.forwardRef<any, any>((props, ref) => {
  const { initialRegion, region, style, children, showsUserLocation } = props;
  
  const cent = region || initialRegion;
  const initCenter: LatLngExpression = cent && cent.latitude ? [cent.latitude, cent.longitude] : [20, 77];

  return (
    <View style={[styles.container, style]}>
      <div style={{ flex: 1, width: '100%', height: '100%' }}>
        <MapContainer 
          center={initCenter} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController region={region} mapRef={ref} />
          {children}
        </MapContainer>
      </div>
    </View>
  );
});

export default MapView;

const transformCoordinate = (coord: any) => [coord.latitude, coord.longitude] as LatLngExpression;

export const Marker: React.FC<any> = ({ coordinate, children, onPress }) => {
  if (!coordinate || typeof coordinate.latitude !== 'number' || typeof coordinate.longitude !== 'number') return null;
  return (
    <LeafletMarker 
      position={transformCoordinate(coordinate)}
      eventHandlers={{ click: () => onPress?.() }}
    >
    </LeafletMarker>
  );
};

export const Polyline: React.FC<any> = ({ coordinates, strokeColor, strokeWidth }) => {
  if (!coordinates || !coordinates.length) return null;
  const positions = coordinates.map(transformCoordinate);
  return (
    <LeafletPolyline 
      positions={positions} 
      pathOptions={{ color: strokeColor || 'blue', weight: strokeWidth || 3 }} 
    />
  );
};

export const Circle: React.FC<any> = ({ center, radius, fillColor, strokeColor }) => {
  if (!center || typeof center.latitude !== 'number' || typeof center.longitude !== 'number') return null;
  return (
    <LeafletCircle 
      center={transformCoordinate(center)} 
      radius={radius || 100} 
      pathOptions={{ fillColor: fillColor || 'red', color: strokeColor || 'red', fillOpacity: 0.3 }} 
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  }
});
