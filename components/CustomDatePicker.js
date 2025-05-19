import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const CustomDatePicker = ({
  visible,
  onConfirm,
  onCancel,
  initialDate = new Date(),
  minDate,
  maxDate,
  buttonColors = {
    ok: '#4CAF50',       // green
    cancel: '#F44336',   // red
  },
}) => {
  const [tempDate, setTempDate] = useState(initialDate);

  const handleConfirm = () => {
    onConfirm?.(tempDate);
  };

  const handleCancel = () => {
    setTempDate(initialDate); // reset to initial date on cancel
    onCancel?.();
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={handleCancel}
    >
      <View style={styles.modalBackground}>
        <View style={styles.container}>
          <DateTimePicker
            value={tempDate}
            mode="date"
            display="spinner"
            onChange={(event, selectedDate) => {
              if (selectedDate) setTempDate(selectedDate);
            }}
            minimumDate={minDate}
            maximumDate={maxDate}
            themeVariant="light"
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={handleCancel}>
              <Text style={[styles.buttonText, { color: buttonColors.cancel }]}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleConfirm}>
              <Text style={[styles.buttonText, { color: buttonColors.ok }]}>
                OK
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#00000055',
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomDatePicker;
