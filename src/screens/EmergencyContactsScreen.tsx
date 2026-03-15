import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SHADOWS, SPACING, TYPOGRAPHY } from '../theme';

interface Contact {
  id: string;
  name: string;
  phone: string;
}

export const EmergencyContactsScreen = () => {
  const navigation = useNavigation();
  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'Mom', phone: '+1 234 567 8900' },
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const handleAddContact = () => {
    if (newName && newPhone) {
      setContacts([
        ...contacts,
        { id: Date.now().toString(), name: newName, phone: newPhone },
      ]);
      setNewName('');
      setNewPhone('');
      setIsAdding(false);
    }
  };

  const renderContact = ({ item }: { item: Contact }) => (
    <View style={[styles.contactCard, SHADOWS.sm]}>
      <View style={styles.contactAvatar}>
        <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactPhone}>{item.phone}</Text>
      </View>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => setContacts(contacts.filter(c => c.id !== item.id))}
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
            keyExtractor={(item) => item.id}
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
    ...TYPOGRAPHY.h2,
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
    ...TYPOGRAPHY.h3,
    color: COLORS.primary,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  contactPhone: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  deleteButton: {
    padding: SPACING.xs,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
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
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.surface,
    marginLeft: SPACING.sm,
  },
  addForm: {
    padding: SPACING.md,
  },
  formTitle: {
    ...TYPOGRAPHY.h2,
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
    ...TYPOGRAPHY.body,
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
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  buttonTextWhite: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.surface,
  },
});
