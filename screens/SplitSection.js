import { View, SafeAreaView, TouchableOpacity, Vibration } from "react-native";
import { Text, FAB, Card, Dialog, Button } from "react-native-paper";
import AppHeader from "../components/AppHeader";
import allColors from "../commons/allColors";
import React, { useState, useCallback, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { storeSections, deleteSections } from "../redux/actions";
import { ScrollView } from "react-native-gesture-handler";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import username from "../helper/constants";

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
  const [totalReceive, setTotalReceive] = useState(0);
  const [totalPay, setTotalPay] = useState(0);

  const sectionsData = useSelector((state) => state.sectionReducer.allSections);
  const specificGroupSection = sectionsData?.filter(
    (innerArray) =>
      innerArray.length >= 1 &&
      innerArray[innerArray.length - 1].groupIdentity === identity
  );

  const handleDeleteSection = (identity) => {
    setSelectedSectionToDelete(identity);
    setDeleteDialogVisible(true);
    Vibration.vibrate(1);
  };

  const handleDelete = () => {
    setDeleteDialogVisible(false);
    dispatch(deleteSections(selectedSectionToDelete));
  };

  useEffect(() => {
    let totalReceived = 0;
    let totalPaid = 0;
    let totalSpent = 0;

    specificGroupSection.forEach((innerArray) => {
      const { totalAmountSpent, whoPaid } = innerArray[innerArray.length - 1];
      totalSpent += +totalAmountSpent;

      if (whoPaid.length === 0) {
        const obj = innerArray.find((obj) => obj.name === username);
        if (obj) totalReceived += parseFloat(obj.amount);
      } else {
        innerArray.forEach((obj) => {
          if (obj.name === username) totalPaid += parseFloat(obj.amount);
        });
      }
    });

    setTotalReceive((totalSpent - totalReceived).toFixed(2));
    setTotalPay(totalPaid.toFixed(2));
  }, [specificGroupSection]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppHeader title={`${nameOfGrp}`} navigation={navigation} isPlus={true} />
      <View style={{ margin: 20, gap: 10, flex: 1 }}>
        <View style={{ flexDirection: "row", gap: 20 }}>
          <View style={{ flex: 0.5 }}>
            <Card style={{ backgroundColor: "darkgreen" }}>
              <Card.Title
                title={"Receive"}
                subtitle={`$${totalReceive}`}
                titleStyle={{ color: allColors.successColor }}
                subtitleStyle={{ color: allColors.successColor }}
              />
            </Card>
          </View>
          <View style={{ flex: 0.5 }}>
            <Card style={{ backgroundColor: "darkred" }}>
              <Card.Title
                title={"Pay"}
                subtitle={`$${totalPay}`}
                titleStyle={{ color: allColors.warningColor }}
                subtitleStyle={{ color: allColors.warningColor }}
              />
            </Card>
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text>Sections</Text>
          <ScrollView>
            {specificGroupSection.length > 0 ? (
              specificGroupSection?.map((subArray, index) => {
                const { sectionName, totalAmountSpent, whoPaid } =
                  subArray[subArray.length - 1];
                const { id } = subArray.find((obj) => obj.id);

                let payBack = 0,
                  receive = 0;
                if (whoPaid.length === 0) {
                  const { amount } = subArray.find(
                    (obj) => obj.name === username
                  );
                  receive = (totalAmountSpent - +amount).toFixed(2);
                } else {
                  const { amount } = subArray.find(
                    (obj) => obj.name === username
                  );
                  payBack = parseInt(amount).toFixed(2);
                }

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
                        title={
                          <View
                            style={{
                              flexDirection: "row",
                              width: 380,
                              justifyContent: "space-between",
                            }}
                          >
                            <Text>{sectionName}</Text>
                            <Text>${totalAmountSpent}</Text>
                          </View>
                        }
                      />
                      <Card.Content>
                        <Text>{`${
                          whoPaid === "" ? "You" : whoPaid
                        } paid`}</Text>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Text>Pay: ${payBack}</Text>
                          <Text>Receive: ${receive}</Text>
                        </View>
                      </Card.Content>
                    </Card>
                  </TouchableOpacity>
                );
              })
            ) : (
              <>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    flex: 1,
                    height: 700,
                  }}
                >
                  <MaterialCommunityIcons
                    name="playlist-plus"
                    size={60}
                    color={allColors.backgroundColorSecondary}
                  />
                  <Text variant="titleMedium">
                    Go ahead and create sections for this group.
                  </Text>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </View>

      <Dialog
        visible={isDeleteDialogVisible}
        onDismiss={() => setDeleteDialogVisible(false)}
        style={{ backgroundColor: allColors.backgroundColorLessPrimary }}
      >
        <Dialog.Title>Delete section?</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium" style={{ color: "white" }}>
            The section will be removed permanently
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
          navigation.navigate("PlusMoreSplitSection", {
            currGrpMems: value,
            grpIdentity: identity,
          })
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
