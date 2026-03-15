with open('src/screens/ProfileScreen.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import_str = "import {\n    BORDER_RADIUS,"
import_replacement = "import { EscortSection } from '../components/EscortSection';\nimport {\n    BORDER_RADIUS,"

if "EscortSection" not in text:
    text = text.replace(import_str, import_replacement)

# also replace the logout button part
logout_str = """          </View>

          {/* Logout Button */}
          <TouchableOpacity"""

logout_replacement = """          </View>

          {/* Escort Section */}
          <EscortSection />

          {/* Logout Button */}
          <TouchableOpacity"""
text = text.replace(logout_str, logout_replacement)

with open('src/screens/ProfileScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print("done")
