with open('c:/Users/DELL/OneDrive/Desktop/App/safewalk/src/navigation/RootNavigator.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(
    "import React from 'react';",
    "import React, { useEffect, useState } from 'react';\nimport { getAuth, onAuthStateChanged, User } from 'firebase/auth';\nimport { ActivityIndicator, View } from 'react-native';"
)

text = text.replace(
    "export const RootNavigator: React.FC = () => {",
    """export const RootNavigator: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }"""
)

# find initialRouteName="Main"
import re
new_text = re.sub(
    r'initialRouteName="Main"\s*>\s*<Stack\.Screen name="Main" component=\{TabNavigator\} />\s*<Stack\.Screen\s*name="Auth"(.*?)\{\(\) => <LoginScreen />\}\s*</Stack\.Screen>\s*<Stack\.Screen',
    r'>\n        {user ? (\n          <>\n            <Stack.Screen name="Main" component={TabNavigator} />\n\n            <Stack.Screen',
    text,
    flags=re.DOTALL
)

if new_text != text:
    new_text = new_text.replace(
        """</Stack.Screen>\n      </Stack.Navigator>""",
        """</Stack.Screen>\n          </>\n        ) : (\n          <Stack.Screen\n            name="Auth"\n            options={{ animationEnabled: false }}\n          >\n            {() => <LoginScreen />}\n          </Stack.Screen>\n        )}\n      </Stack.Navigator>"""
    )
    with open('c:/Users/DELL/OneDrive/Desktop/App/safewalk/src/navigation/RootNavigator.tsx', 'w', encoding='utf-8') as f:
        f.write(new_text)
    print("Patched successfully")
else:
    print("Could not match the replacement string")
