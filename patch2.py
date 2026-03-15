with open('src/screens/HomeScreen.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

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

if '</SafeAreaView>' in text:
    text = text.replace('</SafeAreaView>', drawer_insert)

imports_insert = "import { PlaceDrawer, PlaceData } from '../components/PlaceDrawer';\nimport { RouteInfoCard"
if "import { RouteInfoCard" in text and "PlaceDrawer" not in text:
    text = text.replace("import { RouteInfoCard", imports_insert)

with open('src/screens/HomeScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('Done padding drawer')
