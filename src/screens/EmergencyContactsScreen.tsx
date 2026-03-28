import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Switch, // added
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SHADOWS, SPACING, TYPOGRAPHY } from '../theme';
// Import from the new SOS Service
import { getContacts, saveContact, removeContact, EmergencyContact } from '../services/sosService';

export const EmergencyContactsScreen = () => {
  const navigation = useNavigation();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newTwilioConfig, setNewTwilioConfig] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);

  // Load contacts from AsyncStorage on mount
  useEffect(() => {
    const loadContacts = async () => {
       const saved = await getContacts();
       setContacts(saved);
    };
    loadContacts();
  }, [isAdding]); // refresh list after adding

  const handleAddContact = async () => {
    if (newName && newPhone) {
      const newContact: EmergencyContact = {
        id: Date.now().toString(),
        name: newName,
        phone: newPhone,
        twilioSender: newTwilioConfig || undefined,
        isPrimary: isPrimary
      };
      
      // Save to device storage securely
      await saveContact(newContact);
      
      // Reset form
      setNewName('');
      setNewPhone('');
      setNewTwilioConfig('');
      setIsPrimary(false);
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    await removeContact(id);
    const updated = await getContacts();
    setContacts(updated);
  };

  const renderContact = ({ item }: { item: EmergencyContact }) => (
    <View style={[styles.contactCard, SHADOWS.sm]}>
      <View style={styles.contactAvatar}>
        <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name} {item.isPrimary ? ' ⭐' : ''}</Text>
        <Text style={styles.contactPhone}>{item.phone}</Text>
        {item.twilioSender && <Text style={{fontSize: 10, color: '#666'}}>via: {item.twilioSender}</Text>}
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id || '')}
      >
        <MaterialCommunityIcons name="trash-can-outline" size={20} color={COLORS.danger} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emergency Contacts</Text>
      </View>

      {!isAdding ? (
        <View style={styles.content}>
          <FlatList
            data={contacts}
            renderItem={renderContact}
            keyExtractor={(item) => item.id || item.phone}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No emergency contacts added yet.</Text>
            }
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setIsAdding(true)}
          >
            <MaterialCommunityIcons name="plus" size={24} color={COLORS.surface} />
            <Text style={styles.addButtonText}>Add Contact</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.addForm}>
          <Text style={styles.formTitle}>New Contact</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={newName}
            onChangeText={setNewName}
            placeholderTextColor={COLORS.text.tertiary}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={newPhone}
            onChangeText={setNewPhone}
            keyboardType="phone-pad"
            placeholderTextColor={COLORS.text.tertiary}
          />
          <TextInput
            style={styles.input}
            placeholder="Your Sender Twilio Number (Optional)"
            value={newTwilioConfig}
            onChangeText={setNewTwilioConfig}
            keyboardType="phone-pad"
            placeholderTextColor={COLORS.text.tertiary}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, paddingHorizontal: 5 }}>
            <Switch
              value={isPrimary}
              onValueChange={setIsPrimary}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
            />
            <Text style={{ marginLeft: 10, color: COLORS.text.primary, ...TYPOGRAPHY.styles.body }}>
              Set as Primary Emergency Contact
            </Text>
          </View>
          <View style={styles.formActions}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]}
              onPress={() => setIsAdding(false)}
            >
              <Text style={styles.buttonTextBlack}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.saveButton]}
              onPress={handleAddContact}
            >
              <Text style={styles.buttonTextWhite}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: SPACING.xs,
    marginRight: SPACING.md,
  },
  headerTitle: {
    ...TYPOGRAPHY.styles.h2,
    color: COLORS.text.primary,
  },
  content: {
    flex: 1,
  },
  listContainer: {
    padding: SPACING.md,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${COLORS.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    ...TYPOGRAPHY.styles.h3,
    color: COLORS.primary,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    ...TYPOGRAPHY.styles.body,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  contactPhone: {
    ...TYPOGRAPHY.styles.caption,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  deleteButton: {
    padding: SPACING.xs,
  },
  emptyText: {
    ...TYPOGRAPHY.styles.body,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginTop: SPACING.xl,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    margin: SPACING.md,
    padding: SPACING.md,
    borderRadius: 12,
  },
  addButtonText: {
    ...TYPOGRAPHY.styles.body,
    fontWeight: '600',
    color: COLORS.surface,
    marginLeft: SPACING.sm,
  },
  addForm: {
    padding: SPACING.md,
  },
  formTitle: {
    ...TYPOGRAPHY.styles.h2,
    marginBottom: SPACING.md,
    color: COLORS.text.primary,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...TYPOGRAPHY.styles.body,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
  },
  button: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SPACING.sm,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    marginLeft: SPACING.sm,
  },
  buttonTextBlack: {
    ...TYPOGRAPHY.styles.body,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  buttonTextWhite: {
    ...TYPOGRAPHY.styles.body,
    fontWeight: '600',
    color: COLORS.surface,
  },
});
