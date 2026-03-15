with open('src/screens/HomeScreen.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = "import { PlaceDrawer, PlaceData } from '../components/PlaceDrawer';\n" + text

with open('src/screens/HomeScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('Fixed import')
