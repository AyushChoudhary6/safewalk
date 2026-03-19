with open("src/screens/LoginScreen.tsx", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace(
    "const [loading, setLoading] = useState(false);",
    "const [loading, setLoading] = useState(false);\n  const [isSignUp, setIsSignUp] = useState(false);"
)

text = text.replace(
    "const handleLogin = async () => {",
    """const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      if (isSignUp) {
        await FirebaseService.register(email, password);
      } else {
        await FirebaseService.login(email, password);
      }
      if (onLogin) onLogin();
    } catch (error: any) {
      Alert.alert(isSignUp ? 'Sign Up Failed' : 'Login Failed', error.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const unusedHandleLogin = async () => {"""
)

# Fix title
text = text.replace(
    "<Text style={styles.title}>Welcome to SafeWalk</Text>",
    "<Text style={styles.title}>{isSignUp ? 'Create an Account' : 'Welcome to SafeWalk'}</Text>"
)
text = text.replace(
    "<Text style={styles.subtitle}>Login to continue your safe journey</Text>",
    "<Text style={styles.subtitle}>{isSignUp ? 'Sign up to start your safe journey' : 'Login to continue your safe journey'}</Text>"
)

text = text.replace(
    """title="Continue\"""",
    """title={isSignUp ? 'Sign Up' : 'Continue'}"""
)

# Footer handling
text = text.replace(
    """<View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TextButton
              title="Sign up for free"
              onPress={onSignUp}
              textStyle={styles.signUpLink}
            />
          </View>""",
    """<View style={styles.footer}>
            <Text style={styles.footerText}>{isSignUp ? 'Already have an account? ' : \"Don't have an account? \"}</Text>
            <TextButton
              title={isSignUp ? 'Log in' : 'Sign up for free'}
              onPress={() => setIsSignUp(!isSignUp)}
              textStyle={styles.signUpLink}
            />
          </View>"""
)

with open("src/screens/LoginScreen.tsx", "w", encoding="utf-8") as f:
    f.write(text)
