with open("src/screens/LoginScreen.tsx", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace(
    """<View style={styles.footer}>
            <Text style={styles.footerText}>{isSignUp ? 'Already have an account? ' : "Don't have an account? "}</Text>
            <TextButton
              title={isSignUp ? 'Log in' : 'Sign up for free'}
              onPress={() => setIsSignUp(!isSignUp)}
              textStyle={styles.signUpLink}
            />
          </View>""",
    """<View style={styles.footer}>
            <Text style={styles.footerText}>{isSignUp ? 'Already have an account? ' : "Don't have an account? "}</Text>
            <TextButton
              title={isSignUp ? 'Log in' : 'Sign up for free'}
              onPress={() => { setIsSignUp(!isSignUp); }}
              textStyle={styles.signUpLink}
            />
          </View>"""
)

with open("src/screens/LoginScreen.tsx", "w", encoding="utf-8") as f:
    f.write(text)
