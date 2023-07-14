import React, { useMemo } from "react";
import {
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  View,
  Dimensions,
} from "react-native";
import moment from "moment";
import Expenses from "./Expenses";
import useDynamicColors from "../commons/useDynamicColors";
import BigList from "react-native-big-list";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storeData } from "../redux/actions";
import MyText from "../components/MyText";
import formatNumberWithCurrency from "../helper/formatter";
import { getCurrencyFromStorage } from "../helper/constants";

export default function BigSectionList({ filter }) {
  const navigation = useNavigation();
  const allColors = useDynamicColors();
  const dispatch = useDispatch();
  const styles = makeStyles(allColors);

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

  useFocusEffect(
    useCallback(() => {
      fetchExpensesData();
    }, [])
  );

  const fetchExpensesData = async () => {
    try {
      const res = await AsyncStorage.getItem("ALL_EXPENSES");
      let newData = JSON.parse(res);
      if (newData !== null) dispatch(storeData(newData));
    } catch (e) {}
  };

  const expensesData = useSelector((state) => state.expenseReducer.allExpenses);

  // Sort expenses data by date and time
  const sortedData = useMemo(() => {
    return expensesData.sort((a, b) => {
      const aMoment = moment(`${a.date} ${a.time}`, "YYYY/MM/DD HH:mm:ss");
      const bMoment = moment(`${b.date} ${b.time}`, "YYYY/MM/DD HH:mm:ss");
      return bMoment - aMoment;
    });
  }, [expensesData]);

  // Group expenses data based on the selected filter

  const groupedData = useMemo(() => {
    switch (filter) {
      case "Daily":
        return groupByDay(sortedData).map((group) => group.data.flat());
      case "Weekly":
        return groupByWeek(sortedData).map((group) => group.data.flat());
      case "Monthly":
        return groupByMonth(sortedData).map((group) => group.data.flat());
      case "Yearly":
        return groupByYear(sortedData).map((group) => group.data.flat());
      default:
        return sortedData;
    }
  }, [filter, sortedData]);

  const sectionListData = JSON.parse(JSON.stringify(groupedData));

  const renderItem = ({ item, index }) => {
    return (
      <View
        style={{ alignItems: "center", width: "95%", alignSelf: "center" }}
        key={Math.random()}
      >
        <View>
          <Expenses
            item={item}
            index={index}
            onPress={(item) =>
              navigation.navigate("PlusMoreHome", { updateItem: item })
            }
          />
          <View style={styles.separator} />
        </View>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={{height: Dimensions.get("screen").height / 1.3, justifyContent: 'center', alignItems: 'center'}}>
      <MyText variant="titleMedium" style={{color: allColors.universalColor}}>All expenses will be shown here</MyText>
    </View>
  )

  const renderSectionHeader = (section) => {
    let sectionTitle = "";
    let totalAmount = 0;
    if (filter === "Daily") {
      sectionTitle = sectionListData[section].map(({ date }) =>
        moment(date, "YYYY/MM/DD").format("Do MMMM YYYY")
      )[0];
      sectionListData[section].forEach(({ amount, type }) => {
        if (type === "Expense") totalAmount -= +amount;
        else if (type === "Income") totalAmount += +amount;
      });
    }
    if (filter === "Weekly") {
      sectionTitle = sectionListData[section].map(({ date }) => {
        const startDate = date;
        const startWeek = moment(startDate, "YYYY/MM/DD").format("Wo");
        const year = moment(startDate, "YYYY/MM/DD").format("YYYY");
        const weekString = `${startWeek} week of ${year}`;
        return weekString;
      })[0];
      sectionListData[section].forEach(({ amount, type }) => {
        if (type === "Expense") totalAmount -= +amount;
        else if (type === "Income") totalAmount += +amount;
      });
    }
    if (filter === "Monthly") {
      sectionTitle = sectionListData[section].map(({ date }) => {
        const month = moment(date, "YYYY/MM/DD").format("MMMM");
        const year = moment(date, "YYYY/MM/DD").format("YYYY");
        const monthString = `${month}, ${year}`;
        return monthString;
      })[0];
      sectionListData[section].forEach(({ amount, type }) => {
        if (type === "Expense") totalAmount -= +amount;
        else if (type === "Income") totalAmount += +amount;
      });
    }
    if (filter === "Yearly") {
      sectionTitle = sectionListData[section].map(({ date }) => {
        const year = moment(date, "YYYY/MM/DD").format("YYYY");
        return year;
      })[0];
      sectionListData[section].forEach(({ amount, type }) => {
        if (type === "Expense") totalAmount -= +amount;
        else if (type === "Income") totalAmount += +amount;
      });
    }

    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', width: "95%"}}>
        <View style={styles.outerContainer}>
          <>
            <View
              style={{
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexDirection: "row",
                width: '100%',
              }}
              >
              <MyText variant="titleMedium" style={{color: allColors.textColorPrimary}}>{sectionTitle}</MyText>
              <MyText variant="titleMedium" style={{color: allColors.universalColor}}>
                {totalAmount > 0 ? 
                  "+" + formatNumberWithCurrency(totalAmount, currency.curr)
                  : formatNumberWithCurrency(totalAmount, currency.curr)
                }
              </MyText>
            </View>
          </>
        </View>
        <View
          style={{
            ...StyleSheet.absoluteFill,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          }}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.container}>
        {
          sectionListData.length > 0 ? (
            <BigList
            style={styles.container}
            sections={sectionListData}
            // Item
            itemHeight={70}
            renderItem={renderItem}
            renderEmpty={renderEmpty}
            controlItemRender
            // Section
            sectionHeaderHeight={40}
            renderSectionHeader={renderSectionHeader}
            bounces={true}
            />
          ):
          (
            renderEmpty()
          )
        }
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const makeStyles = allColors =>
  StyleSheet.create({
    container: {
        flex: 1,
      },
      separator: {
        height: 1,
        backgroundColor: "#80808029",
        width: Dimensions.get("screen").width * 0.8,
        alignSelf: "center",
      },
      outerContainer: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignSelf: "center",
        alignItems: "flex-start",
        paddingLeft: 5,
        paddingRight: 5,
        backgroundColor: allColors.backgroundColorPrimary,
    },
});

// Helper functions to group expenses data

const groupByDay = (data) => {
  return data.reduce((acc, item) => {
    const date = moment(item.date, "YYYY/MM/DD").format("Do MMMM, YYYY");
    const index = acc.findIndex((group) => group.title === date);
    if (index >= 0) {
      acc[index].data.push(item);
    } else {
      acc.push({
        title: date,
        data: [item],
      });
    }
    return acc;
  }, []);
};

const groupByWeek = (data) => {
  return data.reduce((acc, item) => {
    const week = moment(item.date, "YYYY/MM/DD").format("W");
    const year = moment(item.date, "YYYY/MM/DD").format("YYYY");
    const title = `${week}th Week of ${year}`;
    const index = acc.findIndex((group) => group.title === title);
    if (index >= 0) {
      acc[index].data.push(item);
    } else {
      acc.push({
        title: title,
        data: [item],
      });
    }
    return acc;
  }, []);
};

const groupByMonth = (data) => {
  return data.reduce((acc, item) => {
    const month = moment(item.date, "YYYY/MM/DD").format("MMMM");
    const year = moment(item.date, "YYYY/MM/DD").format("YYYY");
    const title = `${month}, ${year}`;
    const index = acc.findIndex((group) => group.title === title);
    if (index >= 0) {
      acc[index].data.push(item);
    } else {
      acc.push({
        title: title,
        data: [item],
      });
    }
    return acc;
  }, []);
};

const groupByYear = (data) => {
  return data.reduce((acc, item) => {
    const year = moment(item.date, "YYYY/MM/DD").format("YYYY");
    const title = year;
    const index = acc.findIndex((group) => group.title === title);
    if (index >= 0) {
      acc[index].data.push(item);
    } else {
      acc.push({
        title: title,
        data: [item],
      });
    }
    return acc;
  }, []);
};
