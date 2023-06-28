import { View, SafeAreaView, TouchableOpacity, Vibration } from "react-native";
import { FAB, Card, Avatar, Portal } from "react-native-paper";
import AppHeader from "../components/AppHeader";
import useDynamicColors from "../commons/useDynamicColors";
import MyText from "../components/MyText";
import React, { useState, useCallback, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { storeSections, deleteSections } from "../redux/actions";
import { ScrollView } from "react-native-gesture-handler";
import { MaterialCommunityIcons, AntDesign } from "react-native-vector-icons";
import { getUsernameFromStorage, getCurrencyFromStorage } from "../helper/constants";
import moment from "moment";
import formatNumberWithCurrency from "../helper/formatter";
import DeleteDialog from "../components/DeleteDialog";
import { FlashList } from "@shopify/flash-list";

const Tab = createMaterialTopTabNavigator();

const AllSections = ({
  specificGroupSection,
  handleDeleteSection,
  navigation,
  username,
  currency
}) => {
  const allColors = useDynamicColors();
  const renderPayAndReceive = (payBack, receive) => {
    if (parseInt(payBack) === 0 && receive === 0) return <></>;
    return payBack !== 0 ? (
      <View style={{ flexDirection: "row", gap: 5 }}>
        <MyText
          style={{
            color: allColors.warningColor,
            textAlign: "right",
          }}
        >
          Pay:
        </MyText>
        <MyText
          style={{
            textAlign: "right",
            color: allColors.warningColor,
            maxWidth: 100,
          }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {formatNumberWithCurrency(payBack, currency)}
        </MyText>
      </View>
    ) : (
      <View style={{ flexDirection: "row", gap: 5 }}>
        <MyText
          style={{
            color: allColors.successColor,
            textAlign: "right",
          }}
        >
          Receive:
        </MyText>
        <MyText
          style={{
            textAlign: "right",
            color: allColors.successColor,
            maxWidth: 100,
          }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {formatNumberWithCurrency(receive, currency)}
        </MyText>
      </View>
    );
  };

  const renderArrow = (payBack, receive) => {
    if (parseInt(payBack) === 0 && receive === 0) return <></>;
    return payBack !== 0 ? (
      <AntDesign name="arrowright" size={25} color="red" />
    ) : (
      <AntDesign name="arrowleft" size={25} color="green" />
    );
  };

  specificGroupSection.sort((a, b) => {
    const lastObjA = a[a.length - 1];
    const lastObjB = b[b.length - 1];
    const dateA = moment(lastObjA.dateOfSection, 'DD/MM/YYYY');
    const dateB = moment(lastObjB.dateOfSection, 'DD/MM/YYYY');
    const timeA = moment(lastObjA.timeOfSection, 'HH:mm:ss');
    const timeB = moment(lastObjB.timeOfSection, 'HH:mm:ss');
  
    if (dateA.isAfter(dateB)) {
      return -1;
    } else if (dateA.isSame(dateB)) {
      if (timeA.isAfter(timeB)) {
        return -1;
      } else if (timeA.isSame(timeB)) {
        return 0;
      } else {
        return 1;
      }
    } else {
      return 1;
    }
  });

  const renderItem = ({ item }) => {
    const subArray = item;
    const { sectionName, totalAmountSpent, whoPaid } =
      subArray[subArray.length - 1];
    const { id } = subArray.find((obj) => obj.hasOwnProperty('id'));
    const tempAmount = subArray.find((obj) => obj.name === username);
    const amount = tempAmount ? tempAmount.amount : 0;
  
    let payBack = 0,
      receive = 0;
    if (
      whoPaid.length === 0 ||
      whoPaid.toLowerCase() === username?.toLowerCase()
    )
      receive = (totalAmountSpent - +amount).toFixed(2);
    else payBack = parseInt(amount).toFixed(2);
  
    return (
      <TouchableOpacity
        onLongPress={() => handleDeleteSection(id)}
        onPress={() => navigation.navigate('SplitDetailScreen', { subArray })}
        style={{ marginTop: 20 }}
        activeOpacity={0.9}
      >
        <Card
          style={{
            backgroundColor: allColors.backgroundColorLessPrimary,
            shadowColor: 'transparent',
          }}
        >
          <Card.Title
            title={sectionName}
            titleStyle={{ marginTop: 10, color: allColors.universalColor }}
            subtitle={`Amount paid: ${formatNumberWithCurrency(totalAmountSpent, currency)}`}
            subtitleStyle={{ color: allColors.universalColor }}
          />
          <Card.Content>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <MyText
                variant="titleMedium"
                style={{
                  color: allColors.textColorPrimary,
                  maxWidth: 180,
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {`${
                  whoPaid === '' ||
                  whoPaid.toLowerCase() === username?.toLowerCase()
                    ? 'You'
                    : whoPaid
                } paid`}
              </MyText>
              <View style={{ alignSelf: 'center' }}>
                {renderArrow(payBack, receive)}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  maxWidth: 180,
                }}
              >
                {renderPayAndReceive(payBack, receive)}
              </View>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };
  
  return (
    <View  style={{flex: 1, marginBottom: 80, marginTop: 0 }}>
      {specificGroupSection.length > 0 ? (
        <FlashList
          data={specificGroupSection}
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          estimatedItemSize={200}
          renderItem={renderItem}
        />
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
              color={allColors.textColorPrimary}
            />
            <MyText variant="titleMedium" style={{color: allColors.universalColor}}>
              Go ahead and create sections for this group.
            </MyText>
          </View>
        </>
      )}
    </View>

  );
};

const AllMembers = ({ allMembers }) => {
  const allColors = useDynamicColors();
  return (
    <>
      <View style={{marginLeft: 20, marginTop: 20}}>
        <MyText variant="titleMedium" style={{color: allColors.universalColor}}>{allMembers?.length} Members</MyText>
      </View>
      <ScrollView style={{ backgroundColor: allColors.backgroundColorPrimary }}>
        <View style={{ margin: 20, gap: 15 }}>
          {allMembers.map((e, index) => {
            const words = e.split(' ').map(word => word[0]).join('');
            return (
              <View key={index} style={{flexDirection: 'row', gap: 20, alignItems: 'center'}}>
                <Avatar.Text size={35} label={words} style={{backgroundColor: allColors.addBtnColors}} labelStyle={{color: allColors.selectedDateTextColor}}/>
                <MyText style={{color: allColors.universalColor, fontSize: 18, maxWidth: 350}} numberOfLines={2} ellipsizeMode="tail">{e}</MyText>
              </View>
            )}
          )}
        </View>
      </ScrollView>
    </>
  );
};

const SplitSection = ({ navigation, route }) => {
  const allColors = useDynamicColors();
  const [username, setUsername] = React.useState(null);

  React.useEffect(() => {
    const fetchUsername = async () => {
      const storedUsername = await getUsernameFromStorage();
      setUsername(storedUsername);
    };
    fetchUsername();
  }, []);

  const [currency, setCurrency] = React.useState({
    curr: "$"
  });

  React.useEffect(() => {
    const fetchCurrency = async () => {
      const storedCurrency = await getCurrencyFromStorage();
      setCurrency(storedCurrency);
    };
    fetchCurrency();
  }, []);


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
  const [namesSet, setNamesSet] = useState(new Set());
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

  const hideDialog = () => setDeleteDialogVisible(false);

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

      if (
        whoPaid.length === 0 ||
        whoPaid.toLowerCase() === username?.toLowerCase()
      ) {
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
            <Card style={{ backgroundColor: allColors.receiveGreenBg }}>
              <Card.Title
                title={"Receive"}
                titleStyle={{ color: allColors.universalColor }}
              />
                <MyText style={{
                  textAlignVertical: "center",
                  padding: 16,
                  paddingTop: 0,
                  marginTop: -15,
                  color: allColors.universalColor,
                }}>
                  {formatNumberWithCurrency(totalReceive, currency.curr)}
                </MyText>
            </Card>
          </View>
          <View style={{ flex: 0.5 }}>
            <Card style={{ backgroundColor: allColors.payRedBg }}>
              <Card.Title
                title={"Pay"}
                titleStyle={{ color: allColors.universalColor }}
              />
              <MyText style={{
                  textAlignVertical: "center",
                  padding: 16,
                  paddingTop: 0,
                  marginTop: -15,
                  color: allColors.universalColor,
                }}>
                  {formatNumberWithCurrency(totalPay, currency.curr)}
              </MyText>
            </Card>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <Tab.Navigator
            initialRouteName="Sections"
            screenOptions={{
              tabBarActiveTintColor: allColors.universalColor,
              tabBarLabelStyle: { fontSize: 15, fontWeight: 500 },
              tabBarIndicatorStyle: {
                backgroundColor: allColors.textColorPrimary,
              },
              tabBarStyle: {
                backgroundColor: "transparent",
                shadowColor: "transparent",
              },
              tabBarPressOpacity: 1,
            }}
          >
            <Tab.Screen name="Sections">
              {() => (
                <AllSections
                  specificGroupSection={specificGroupSection}
                  handleDeleteSection={handleDeleteSection}
                  navigation={navigation}
                  username={username}
                  currency={currency.curr}
                />
              )}
            </Tab.Screen>
            <Tab.Screen name="Members">
              {() => <AllMembers allMembers={value.sort()} />}
            </Tab.Screen>
          </Tab.Navigator>
        </View>
      </View>

      <Portal>
        <DeleteDialog
          visible={isDeleteDialogVisible}
          hideDialog={hideDialog}
          deleteExpense={handleDelete}
          allColors={allColors}
          title={"section"}
          content={"section"}
        />
      </Portal>

      <FAB
        animated
        icon="plus"
        onPress={() =>
          navigation.navigate("PlusMoreSplitSection", {
            currGrpMems: value,
            grpIdentity: identity,
          })
        }
        color={allColors.universalColor}
        mode="elevated"
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
