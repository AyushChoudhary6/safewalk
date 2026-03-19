with open("c:/Users/DELL/OneDrive/Desktop/App/safewalk/src/navigation/RootNavigator.tsx", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace(
    "import { ActivityIndicator, View } from 'react-native';",
    "import { ActivityIndicator, View } from 'react-native';\nimport '../services/firebaseService';"
)

with open("c:/Users/DELL/OneDrive/Desktop/App/safewalk/src/navigation/RootNavigator.tsx", "w", encoding="utf-8") as f:
    f.write(text)
print("done")
