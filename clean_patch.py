with open("src/screens/ProfileScreen.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# remove bad import
if "import FirebaseService from '../services/firebaseService';" in text and text.find("import FirebaseService from '../services/firebaseService';") > 500:
    text = text.replace("import FirebaseService from '../services/firebaseService';\n  const handleLogout", "const handleLogout")

# Ensure import at top
if "import FirebaseService" not in text:
    text = text.replace("import React", "import React", 1) # Find React
    text = "import FirebaseService from '../services/firebaseService';\n" + text

text = text.replace(
    """const handleLogout = () => {
    // Implement logout logic
    console.log('Logout pressed');
  };""",
    """const handleLogout = async () => {
    try {
      await FirebaseService.logout();
    } catch (e) {
      console.log('Logout error', e);
    }
  };"""
)

with open("src/screens/ProfileScreen.tsx", "w", encoding="utf-8") as f:
    f.write(text)
