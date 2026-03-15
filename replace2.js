const fs = require('fs');
let content = fs.readFileSync('src/screens/HomeScreen.tsx', 'utf8');

const targetStr = '{!routeParams && (\\n        </SafeAreaView>';
const replacement = \
        {!routeParams && (
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
        )}
        {routeParams && (
          <RouteDrawer
            distance={routeParams.distance}
            duration={routeParams.duration}
            incidents={activeIncidents}
            isVisible={!!routeParams}
            onIncidentPress={(incident) => {
              if (mapRef.current) {
                mapRef.current.animateToRegion({
                  latitude: incident.latitude,
                  longitude: incident.longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }, 1000);
              }
            }}
          />
        )}
      </SafeAreaView>\;

content = content.replace(/\{\!routeParams && \(\s*<\/SafeAreaView>/, replacement);
fs.writeFileSync('src/screens/HomeScreen.tsx', content);

