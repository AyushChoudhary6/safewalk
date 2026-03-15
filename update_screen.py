import re

with open('src/screens/ReportIncidentScreen.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Imports
text = text.replace(
    "import { SafeAreaView } from 'react-native-safe-area-context';",
    "import { SafeAreaView } from 'react-native-safe-area-context';\nimport MapView, { Marker } from 'react-native-maps';\nimport { getCurrentLocation } from '../services/locationService';\nimport { fetchAddressFromCoordinates } from '../services/mapsService';"
)

# Replace hook state and effects
hook_str = """
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
"""
new_hook_str = """
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const [locationAddress, setLocationAddress] = useState<string>('Locating...');

  React.useEffect(() => {
    const fetchLoc = async () => {
      const loc = await getCurrentLocation();
      if (loc) setLocation({ latitude: loc.latitude, longitude: loc.longitude });
    };
    fetchLoc();
  }, []);

  React.useEffect(() => {
    if (location) {
      setLocationAddress('Fetching address...');
      fetchAddressFromCoordinates(location)
        .then(addr => setLocationAddress(addr))
        .catch(() => setLocationAddress(`${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`));
    }
  }, [location]);
"""
text = text.replace(hook_str.strip(), new_hook_str.strip())

# Replace mock region with default region logic
text = text.replace("""  const mockRegion = {
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };""", """  const defaultRegion = {
    latitude: location?.latitude || 37.7749,
    longitude: location?.longitude || -122.4194,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };""")

# replace handleSubmit location access
text = text.replace("location: mockRegion,", "location: location || defaultRegion,")

# Replace Map inside mini map
map_str = """          {/* Mini Map */}
        <View style={styles.mapContainer}>
          <SafeWalkMapView initialRegion={mockRegion} />"""
new_map_str = """          {/* Interactive Map */}
        <View style={styles.mapContainer}>
          <MapView
            style={StyleSheet.absoluteFillObject}
            region={defaultRegion}
            onPress={(e) => setLocation(e.nativeEvent.coordinate)}
          >
            {location && (
              <Marker
                coordinate={location}
                draggable
                onDragEnd={(e) => setLocation(e.nativeEvent.coordinate)}
              />
            )}
          </MapView>"""
text = text.replace(map_str, new_map_str)

# Replace the text inputs to also include coordinates
coords_input = """
          {/* Location Coordinates Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Selected Location</Text>
            <View style={[styles.coordinatesBox, SHADOWS.sm]}>
              <MaterialCommunityIcons name="map-marker" size={20} color={COLORS.primary} />
              <TextInput
                style={styles.coordinatesInput}
                value={
                  location
                    ? `${locationAddress} | ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`
                    : 'Locating...'
                }
                editable={false}
                multiline={true}
              />
            </View>
          </View>

          {/* Description Input */}"""
text = text.replace("{/* Description Input */}", coords_input)

# Move buttons into scroll view
buttons_str = """        {/* Action Buttons */}
        <View style={[styles.actions, SHADOWS.lg]}>
          <TouchableOpacity
            style={[styles.cancelButton, SHADOWS.sm]}
            onPress={onCancel}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <PrimaryButton
            title="Submit Report"
            onPress={handleSubmit}
            loading={loading}
            disabled={!selectedType || loading}
            style={{ flex: 1 }}
          />
        </View>"""

if buttons_str in text:
    text = text.replace(buttons_str, "")
    text = text.replace("</ScrollView>", buttons_str + "\n        </ScrollView>")

with open('src/screens/ReportIncidentScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print("done")