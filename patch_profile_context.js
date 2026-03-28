const fs = require('fs');
let content = fs.readFileSync('src/screens/ProfileScreen.tsx', 'utf8');

// 1. Imports
content = content.replace(
    /import FirebaseService from '\.\.\/services\/firebaseService';/,
    "import FirebaseService, { auth } from '../services/firebaseService';"
);
content = content.replace(
    /import React, \{ useState \} from 'react';/,
    "import React, { useState, useEffect } from 'react';"
);
content = content.replace(
    /    View,\n\} from 'react-native';/,
    "    View,\n    Linking,\n} from 'react-native';"
);

// 2. State & logic
const state_insert = \  const [emergencyAlerts, setEmergencyAlerts] = useState(true);

  const [userData, setUserData] = useState<{ name: string; email: string }>({   
    name: 'SafeWalk User',
    email: 'Loading...',
  });

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserData({
        name: currentUser.displayName || currentUser.email?.split('@')[0] || 'SafeWalk User',
        email: currentUser.email || 'user@example.com',
      });
    }
  }, []);

  const handleFeatureNotReady = (featureName: string) => {
    Alert.alert(
      featureName,
      'This feature is currently under development. Check back in a future update!',
      [{ text: 'Got it' }]
    );
  };

  const handleSupport = () => {
    Linking.openURL('mailto:support@safewalk.app?subject=SafeWalk Help & Support Request')
      .catch((err) => Alert.alert('Error', 'Unable to open email client.'));    
  };\;

content = content.replace(
    /  const \[emergencyAlerts, setEmergencyAlerts\] = useState\(true\);/,
    state_insert
);

// 3. Dynamic header
content = content.replace(
    /<Text style=\{styles\.userName\}>Alex Johnson<\/Text>\s*<Text style=\{styles\.userEmail\}>alex@example\.com<\/Text>/,
    \<Text style={styles.userName}>{userData.name}</Text>\n            <Text style={styles.userEmail}>{userData.email}</Text>\
);

// 4. onPress injections
content = content.replace(
    /\{\/\* Profile \*\/\}\s*<TouchableOpacity style=\{styles\.settingItem\}>/,
    \{/* Profile */}\n          <TouchableOpacity style={styles.settingItem} onPress={() => handleFeatureNotReady('Edit Profile')}>\
);
content = content.replace(
    /\{\/\* Timeline \*\/\}\s*<TouchableOpacity style=\{styles\.settingItem\}>/,
    \{/* Timeline */}\n          <TouchableOpacity style={styles.settingItem} onPress={() => handleFeatureNotReady('Timeline History')}>\
);
content = content.replace(
    /\{\/\* Location sharing \*\/\}\s*<TouchableOpacity style=\{styles\.settingItem\}>/,
    \{/* Location sharing */}\n          <TouchableOpacity style={styles.settingItem} onPress={() => handleFeatureNotReady('Location Sharing')}>\
);
content = content.replace(
    /\{\/\* Offline maps \*\/\}\s*<TouchableOpacity style=\{styles\.settingItem\}>/,
    \{/* Offline maps */}\n          <TouchableOpacity style={styles.settingItem} onPress={() => handleFeatureNotReady('Offline Maps')}>\
);
content = content.replace(
    /\{\/\* Your data in maps \*\/\}\s*<TouchableOpacity style=\{styles\.settingItem\}>/,
    \{/* Your data in maps */}\n          <TouchableOpacity style={styles.settingItem} onPress={() => handleFeatureNotReady('Your Data & Privacy')}>\
);
content = content.replace(
    /\{\/\* Help \& Support \*\/\}\s*<TouchableOpacity style=\{styles\.settingItem\}\s*>/,
    \{/* Help & Support */}\n          <TouchableOpacity style={styles.settingItem} onPress={handleSupport}>\
);

fs.writeFileSync('src/screens/ProfileScreen.tsx', content, 'utf8');
