import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TouchableWithoutFeedback,
  FlatList
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const THEME_COLORS = [
  '#F472B6',
  '#6366F1',
  '#10B981',
  '#F59E0B',
  '#3B82F6',
  '#EF4444',
  '#8B5CF6',
];

interface ChatSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectTheme: (color: string) => void;
  isBlocked: boolean;
  onToggleBlock: () => void;
}

export const ChatSettingsModal = ({ 
  visible, 
  onClose, 
  onSelectTheme, 
  isBlocked, 
  onToggleBlock 
}: ChatSettingsModalProps) => {

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <View style={styles.header}>
                <Text style={styles.title}>Ajustes del Chat</Text>
                <TouchableOpacity onPress={onClose}>
                  <Feather name="x" size={24} color="#64748B" />
                </TouchableOpacity>
              </View>

              <Text style={styles.sectionTitle}>Color del tema</Text>
              <View style={styles.colorGrid}>
                {THEME_COLORS.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[styles.colorOption, { backgroundColor: color }]}
                    onPress={() => {
                      onSelectTheme(color);
                      onClose();
                    }}
                  />
                ))}
              </View>

              <View style={styles.divider} />

              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => {
                  onToggleBlock();
                  onClose();
                }}
              >
                <View style={[styles.iconBox, { backgroundColor: isBlocked ? '#DCFCE7' : '#FEE2E2' }]}>
                  <Feather 
                    name={isBlocked ? "unlock" : "slash"} 
                    size={20} 
                    color={isBlocked ? "#16A34A" : "#EF4444"} 
                  />
                </View>
                <Text style={[styles.actionText, { color: isBlocked ? "#16A34A" : "#EF4444" }]}>
                  {isBlocked ? "Desbloquear chat" : "Bloquear interacción"}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#F1F5F9',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    paddingVertical: 10,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 16,
    fontWeight: '700',
  },
});