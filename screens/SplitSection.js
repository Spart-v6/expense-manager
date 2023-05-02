import { View, SafeAreaView, TouchableOpacity, Vibration } from "react-native";
import { Text, FAB, Card, Dialog, Button } from "react-native-paper";
import AppHeader from "../components/AppHeader";
import allColors from "../commons/allColors";
import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { storeSections, deleteSections } from "../redux/actions";
import { ScrollView } from "react-native-gesture-handler";

const SplitSection = ({ navigation, route }) => {
  const dispatch = useDispatch();
  // #region getting sections of groups stuff
  useFocusEffect(
    useCallback(() => {
      fetchAllSections();
    }, [])
  );

  const fetchAllSections = async () => {
    try {
      const res = await AsyncStorage.getItem("ALL_SECTIONS");
      let newData = JSON.parse(res);
      if (newData !== null) dispatch(storeSections(newData));
    } catch (e) {
      console.log("error: ", e);
    }
  };
  // #endregion =========== End

  const [identity, setIdentity] = useState(route.params.identity);
  const [nameOfGrp, setNameOfGrp] = useState(route.params.nameOfGrp);
  const [value, setValue] = useState(route.params.values);
  const [selectedSectionToDelete, setSelectedSectionToDelete] = useState(null);
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false);

  const sectionsData = useSelector((state) => state.sectionReducer.allSections);
  // TODO: while deleteing a group, delete it's all sections

  const handleDeleteSection = (identity) => {
    setSelectedSectionToDelete(identity);
    setDeleteDialogVisible(true);
    Vibration.vibrate(1);
  };

  const handleDelete = () => {
    setDeleteDialogVisible(false);
    dispatch(deleteSections(selectedSectionToDelete));
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppHeader
        title={`${nameOfGrp} group`}
        navigation={navigation}
        isPlus={true}
      />
      <View style={{ margin: 20, gap: 10, flex: 1 }}>
        <View style={{ flexDirection: "row", gap: 20 }}>
          <View style={{ flex: 0.5 }}>
            <Card style={{ backgroundColor: "darkgreen" }}>
              <Card.Title
                title={"Receive"}
                subtitle={"$ 35,000"}
                titleStyle={{ color: allColors.successColor }}
                subtitleStyle={{ color: allColors.successColor }}
              />
            </Card>
          </View>
          <View style={{ flex: 0.5 }}>
            <Card style={{ backgroundColor: "darkred" }}>
              <Card.Title
                title={"Pay"}
                subtitle={"$ 35,000"}
                titleStyle={{ color: allColors.warningColor }}
                subtitleStyle={{ color: allColors.warningColor }}
              />
            </Card>
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text>Sections</Text>
          <ScrollView>
            {sectionsData?.map((subArray, index) => {
              const { sectionName, totalAmountSpent } =
                subArray[subArray.length - 1];
              const objectCount = subArray.slice(0, -1).length;
              const { id } = subArray.find(obj => obj.id);

              return (
                <TouchableOpacity
                  key={index}
                  onLongPress={() => handleDeleteSection(id)}
                  onPress={() =>
                    navigation.navigate("SplitDetailScreen", { subArray })
                  }
                  style={{ marginTop: 20 }}
                  activeOpacity={0.8}
                >
                  <Card
                    key={index}
                    style={{
                      backgroundColor: allColors.backgroundColorLessPrimary,
                    }}
                  >
                    <Card.Title
                      title={sectionName}
                      subtitle={totalAmountSpent}
                    />
                    <Card.Content>
                      <Text>Object Count: {objectCount}</Text>
                    </Card.Content>
                  </Card>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>

      <Dialog
        visible={isDeleteDialogVisible}
        onDismiss={() => setDeleteDialogVisible(false)}
        style={{ backgroundColor: allColors.backgroundColorLessPrimary }}
      >
        <Dialog.Title>Delete group?</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium" style={{ color: "white" }}>
            The group will be removed permanently
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
          <Button
            onPress={handleDelete}
            mode="elevated"
            contentStyle={{ width: 60 }}
            buttonColor={allColors.warningColor}
          >
            <Text style={{ color: allColors.textColorTertiary }}>Sure</Text>
          </Button>
        </Dialog.Actions>
      </Dialog>

      <FAB
        animated
        icon="plus"
        onPress={() =>
          navigation.navigate("PlusMoreSplitSection", { currGrpMems: value })
        }
        mode="flat"
        style={{
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: 0,
          backgroundColor: allColors.backgroundColorSecondary,
        }}
        customSize={70}
      />
    </SafeAreaView>
  );
};

export default SplitSection;
