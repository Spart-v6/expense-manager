import React, { useState, useCallback } from "react";
import { View, StyleSheet, ScrollView, useColorScheme, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Text, TextInput, Divider, FAB, IconButton, Button, Snackbar } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeContext } from "../context/ThemeContext";
import { useFocusEffect } from "@react-navigation/native";

const PlusMoreSplit = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const { theme } = useThemeContext();
  const styles = makeStyles(theme, colorScheme);

  const [selfName, setSelfName] = useState('');

  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const name = await AsyncStorage.getItem("username");
          setSelfName(name);
        } catch (error) {
          console.error("Failed to load data:", error);
        }
      };
      fetchData();
    }, [])
  );

  const addMember = () => {
    setMembers([...members, ""]);
  };

  const removeMember = (index) => {
    const updated = [...members];
    updated.splice(index, 1);
    setMembers(updated);
  };

  const updateMember = (index, value) => {
    const updated = [...members];
    updated[index] = value;
    setMembers(updated);
  };

  const showError = (msg) => {
    setError(msg);
    setSnackbarVisible(true);
  };

  const saveGroup = async () => {
    if (!groupName.trim()) {
      return showError('Group name cannot be empty.');
    }

    const filteredMembers = members.filter(m => m.trim() && m !== selfName); // TODO: need to create this username function from async storage
    if (filteredMembers.length === 0) {
      return showError('Add at least one member other than yourself.');
    }

    const newGroup = {
      id: Date.now().toString(),
      name: groupName.trim(),
      members: [selfName, ...members], // includues ur name too in the group
      expenses: []
    };

    try {
      const storedGroups = await AsyncStorage.getItem('groups');
      const groups = storedGroups ? JSON.parse(storedGroups) : [];
      groups.push(newGroup);
      await AsyncStorage.setItem('groups', JSON.stringify(groups));
      navigation.goBack();

    } catch (err) {
      console.error('Error saving group', err);
      showError('Failed to save group.');
    }
  };

  return (
    <View style={{ flex: 1, marginTop: 20 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scroll}>
            <TextInput
              label="Group Name"
              mode="outlined"
              value={groupName}
              onChangeText={setGroupName}
              style={styles.input}
              left={<TextInput.Icon icon="account-group-outline" />}
              />

            <Divider style={styles.divider} />

            {/* Fixed username */}
            <View style={styles.fixedMember}>
              <TextInput
                label="Member"
                mode="outlined"
                value={selfName}
                editable={false}
                style={styles.fixedInput}
                left={<TextInput.Icon icon="account-circle-outline" />}
              />
            </View>

            {/* adds new text field when plus icon is tapped */}
            {members.map((member, index) => (
              <View key={index} style={styles.memberRow}>
                <TextInput
                  label="Name of group member"
                  mode="outlined"
                  value={member}
                  onChangeText={(text) => updateMember(index, text)}
                  style={styles.memberInput}
                  autoFocus={index === members.length - 1}
                />
                <IconButton
                  icon="close"
                  size={24}
                  onPress={() => removeMember(index)}
                  style={styles.removeIcon}
                />
              </View>
            ))}
          </ScrollView>

          <View style={styles.bottomButtons}>
            <Button
              mode="contained"
              style={styles.addGroupBtn}
              labelStyle={{ fontSize: 18 }}
              onPress={saveGroup}
            >
              <Text style={styles.saveButtonText}> Add Group </Text>
            </Button>
          </View>

          <FAB
            icon="plus"
            style={styles.fab}
            onPress={addMember}
            variant="tertiary"
            mode="flat"
            color={theme.dark.onPrimaryContainer}
          />
          <Snackbar
            style={{
              position: "absolute",
              left: 20,
              right: 0,
              bottom: 0,
            }}
            visible={snackbarVisible}
            onDismiss={() => setSnackbarVisible(false)}
            duration={3000}
            action={{
              label: "OK",
              onPress: () => setSnackbarVisible(false),
            }}
          >
            {error}
          </Snackbar>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const makeStyles = (theme, colorScheme) =>
StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scroll: {
    paddingBottom: 100,
  },
  input: {
    marginBottom: 12,
  },
  divider: {
    marginVertical: 12,
  },
  fixedMember: {
    marginBottom: 12,
  },
  fixedInput: {
    backgroundColor: "transparent",
    borderColor: theme[colorScheme].primary
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  memberInput: {
    flex: 1,
    backgroundColor: "transparent",
    borderColor: theme[colorScheme].primary,
  },
  removeIcon: {
    marginLeft: 8,
  },
  fab: {
    backgroundColor: theme.dark.primaryContainer,
    position: "absolute",
    right: 24,
    bottom: 80, 
    elevation: 5,
  },
  bottomButtons: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  addGroupBtn: {
    width: "100%",
    paddingVertical: 8,
    borderRadius: 12,
  },
  saveButtonText: {
    color: theme[colorScheme].onPrimary,
    fontSize: 18,
    textAlign: "center",
  },
});

export default PlusMoreSplit;
