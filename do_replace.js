const fs = require("fs");
let content = fs.readFileSync("src/screens/ProfileScreen.tsx", "utf8");

content = content.replace(
    /\{\/\* Profile \*\/}[ \t\r\n]*<TouchableOpacity style=\{styles\.settingItem\}>/g,
    "{/* Profile */}\n          <TouchableOpacity style={styles.settingItem} onPress={() => handleFeatureNotReady(\"Edit Profile\")}>"
);
content = content.replace(
    /\{\/\* Timeline \*\/}[ \t\r\n]*<TouchableOpacity style=\{styles\.settingItem\}>/g,
    "{/* Timeline */}\n          <TouchableOpacity style={styles.settingItem} onPress={() => handleFeatureNotReady(\"Timeline History\")}>"
);
content = content.replace(
    /\{\/\* Location sharing \*\/}[ \t\r\n]*<TouchableOpacity style=\{styles\.settingItem\}>/g,
    "{/* Location sharing */}\n          <TouchableOpacity style={styles.settingItem} onPress={() => handleFeatureNotReady(\"Location Sharing\")}>"
);
content = content.replace(
    /\{\/\* Offline maps \*\/}[ \t\r\n]*<TouchableOpacity style=\{styles\.settingItem\}>/g,
    "{/* Offline maps */}\n          <TouchableOpacity style={styles.settingItem} onPress={() => handleFeatureNotReady(\"Offline Maps\")}>"
);
content = content.replace(
    /\{\/\* Your data in maps \*\/}[ \t\r\n]*<TouchableOpacity style=\{styles\.settingItem\}>/g,
    "{/* Your data in maps */}\n          <TouchableOpacity style={styles.settingItem} onPress={() => handleFeatureNotReady(\"Your Data & Privacy\")}>"
);
content = content.replace(
    /<TouchableOpacity style=\{styles\.settingItem\}>[ \t\r\n]*<View style=\{styles\.settingIcon\}>[ \t\r\n]*<MaterialCommunityIcons[ \t\r\n]*name="help-circle"/g,
    "<TouchableOpacity style={styles.settingItem} onPress={handleSupport}>\n            <View style={styles.settingIcon}>\n              <MaterialCommunityIcons\n                name=\"help-circle\""
);

fs.writeFileSync("src/screens/ProfileScreen.tsx", content, "utf8");

