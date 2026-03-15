import re
with open('src/screens/HomeScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Imports
content = content.replace("import { RouteInfoCard", "import { PlaceDrawer, PlaceData } from '../components/PlaceDrawer';\nimport { RouteInfoCard")

# 2. State
content = content.replace("const searchTimeout = useRef<NodeJS.Timeout | null>(null);", "const searchTimeout = useRef<NodeJS.Timeout | null>(null);\n  const [selectedPlace, setSelectedPlace] = useState<PlaceData | null>(null);")

# 3. Markers
replacement = '''showsMyLocationButton={false}
      >
        {location && (
          <>
            <Marker
              coordinate={{ latitude: location.latitude + 0.005, longitude: location.longitude + 0.005 }}
              title="Central Park"
              pinColor="green"
              onPress={() => setSelectedPlace({
                id: '1',
                name: 'Central Park',
                address: '123 Park Ave, New York, NY 10022',
                duration: '15 min',
                distance: '2.5 km',
                type: 'Park',
                photos: ['https://picsum.photos/400/400?random=4', 'https://picsum.photos/200/200?random=5', 'https://picsum.photos/200/200?random=6']
              })}
            />
            <Marker
              coordinate={{ latitude: location.latitude - 0.005, longitude: location.longitude - 0.005 }}
              title="City Coffee"
              pinColor="orange"
              onPress={() => setSelectedPlace({
                id: '2',
                name: 'City Coffee',
                address: '456 Cafe St, New York, NY 10021',
                duration: '5 min',
                distance: '0.8 km',
                type: 'Cafe',
                photos: ['https://picsum.photos/400/400?random=1', 'https://picsum.photos/200/200?random=2', 'https://picsum.photos/200/200?random=3']
              })}
            />
          </>
        )}'''

content = re.sub(r'showsMyLocationButton=\{false\}\s*>', replacement, content)

# 4. Drawer
drawer_insert = '''
      <PlaceDrawer 
        place={selectedPlace} 
        onClose={() => setSelectedPlace(null)}
        onDirections={(place) => {
           if (location) {
             calculateRoute({
                latitude: location.latitude + 0.005, 
                longitude: location.longitude + 0.005 
             }, routeMode);
           }
        }}
      />
    </SafeAreaView>
'''
content = content.replace('</SafeAreaView>', drawer_insert)

with open('src/screens/HomeScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Patched successfully!')
