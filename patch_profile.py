with open("c:/Users/DELL/OneDrive/Desktop/App/safewalk/src/screens/ProfileScreen.tsx", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace(
    """const handleLogout = () => {
    // Implement logout logic
    console.log('Logout pressed');
  };""",
    """import FirebaseService from '../services/firebaseService';
  const handleLogout = async () => {
    try {
      await FirebaseService.logout();
    } catch (e) {
      console.log('Logout error', e);
    }
  };"""
)

with open("c:/Users/DELL/OneDrive/Desktop/App/safewalk/src/screens/ProfileScreen.tsx", "w", encoding="utf-8") as f:
    f.write(text)
