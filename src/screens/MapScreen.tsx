import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {
    createIncident,
    fetchIncidents,
    Incident,
    subscribeToIncidents
} from '../services/incidents';

export default function MapScreen() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Initial Load & Real-time Subscription Setup
  useEffect(() => {
    loadIncidents();

    // 2. Listen for Real-time Updates from Supabase
    const unsubscribe = subscribeToIncidents((payload) => {
      if (payload.eventType === 'INSERT') {
        const newIncident = payload.new as Incident;
        // Prepend the new incident to the list to reflect updates immediately
        setIncidents((prevIncidents) => [newIncident, ...prevIncidents]);
      } else if (payload.eventType === 'DELETE') {
        setIncidents((prev) => prev.filter(item => item.id !== payload.old.id));
      } else {
        // Fallback for UPDATE or other changes
        loadIncidents();
      }
    });

    // Clean up channel on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  const loadIncidents = async () => {
    try {
      setLoading(true);
      const data = await fetchIncidents();
      setIncidents(data);
    } catch (error) {
      console.error('Screen Error: Failed to load incidents', error);
      Alert.alert('Error', 'Could not load community incidents.');
    } finally {
      setLoading(false);
    }
  };

  // 3. User interaction to mock-create a new incident
  const handleReportIncident = async () => {
    try {
      const mockIncident = {
        type: 'Suspicious Activity',
        latitude: 37.7749 + (Math.random() * 0.01 - 0.005), // Randomize near SF
        longitude: -122.4194 + (Math.random() * 0.01 - 0.005),
        description: 'Random report for testing Real-time Supabase Data.',
        severity: Math.floor(Math.random() * 5) + 1, // Range 1-5
      };

      const result = await createIncident(mockIncident);
      if (result) {
        // Notice we don't manually add this to state here!
        // The real-time subscription will pick it up and update the UI automatically.
        Alert.alert('Success', 'Incident reported securely to database!');
      }
    } catch (error) {
       console.error('Screen Error: Failed to report incident', error);
       Alert.alert('Error', 'Could not submit your report.');
    }
  };

  const renderIncident = ({ item }: { item: Incident }) => {
    // Format timestamp nicely
    const dateStr = item.created_at ? new Date(item.created_at).toLocaleString() : 'Just now';
    
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.type}>{item.type}</Text>
          <Text style={styles.severityBadge}>Severity: {item.severity}</Text>
        </View>
        <Text style={styles.desc}>{item.description}</Text>
        <View style={styles.metaData}>
          <Text style={styles.coords}>Lat: {item.latitude.toFixed(4)}, Lng: {item.longitude.toFixed(4)}</Text>
          <Text style={styles.date}>{dateStr}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Live Map Incidents</Text>
        <TouchableOpacity style={styles.button} onPress={handleReportIncident}>
          <Text style={styles.buttonText}>+ Report</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={{ marginTop: 10 }}>Syncing Safewalk Base...</Text>
        </View>
      ) : (
        <FlatList
          data={incidents}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={renderIncident}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.centerBox}>
              <Text>No incidents reported in this area yet.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ebebeb',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  button: {
    backgroundColor: '#ff4b4b',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  list: {
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // for Android
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  type: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  severityBadge: {
    fontSize: 12,
    backgroundColor: '#ffefef',
    color: '#d32f2f',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
    fontWeight: 'bold',
  },
  desc: {
    fontSize: 15,
    color: '#555',
    marginBottom: 10,
    lineHeight: 20,
  },
  metaData: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  coords: {
    fontSize: 12,
    color: '#888',
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
