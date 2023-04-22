import { View, SafeAreaView, SectionList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text } from "react-native-paper";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useState, useEffect, useCallback } from "react";
import moment from "moment";
import allColors from "../commons/allColors";
import Expenses from "./Expenses";
import { useSelector, useDispatch } from "react-redux";
import { addData, updateRecurrences } from "../redux/actions";
import { storeData, storeRecurrences, deleteRecurrences } from "../redux/actions";

const Separator = () => (
  <View
    style={{
      height: 1,
      width: "80%",
      backgroundColor: allColors.backgroundColorTertiary,
      alignSelf: "center",
    }}
  />
);

const ExpensesList = ({ filter }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [currentFilter, setCurrentFilter] = useState("Daily");

  useEffect(() => {
    setCurrentFilter(filter);
  }, [filter]);

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
    } catch (e) {
      console.log("error: ", e);
    }
  };

  const expensesData = useSelector((state) => state.expenseReducer.allExpenses);

  const sortedData = expensesData.sort((a, b) => {
    const aMoment = moment(`${a.date} ${a.time}`, "YYYY/MM/DD HH:mm:ss");
    const bMoment = moment(`${b.date} ${b.time}`, "YYYY/MM/DD HH:mm:ss");

    if (aMoment.isSame(bMoment)) {
      return moment(a.date, "YYYY/MM/DD").isBefore(moment(b.date, "YYYY/MM/DD"))
        ? 1
        : -1;
    }

    return aMoment.isBefore(bMoment) ? 1 : -1;
  });

  const renderItem = ({ item, index }) => (
    <Expenses
      item={item}
      index={index}
      onPress={(item) =>
        navigation.navigate("PlusMoreHome", { updateItem: item })
      }
    />
  );

  const groupByCategory = (data, category) => {
    let groupedData = [];
    switch (category) {
      case "Daily":
        groupedData = data?.reduce((acc, item) => {
          const date = moment(item.date, "YYYY/MM/DD").format("Do MMMM, YYYY");
          const index = acc.findIndex((group) => group.title === date);
          if (index >= 0) {
            acc[index].data?.push(item);
          } else {
            acc.push({
              title: date,
              data: [item],
            });
          }
          return acc;
        }, []);
        break;
      case "Weekly":
        groupedData = data?.reduce((acc, item) => {
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
        return groupedData?.map((group) => ({
          ...group,
          data: group.data?.map((item) => ({ ...item })),
        }));
      case "Monthly":
        groupedData = data?.reduce((acc, item) => {
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
        return groupedData?.map((group) => ({
          ...group,
          data: [...group.data],
        }));
      case "Yearly":
        groupedData = data?.reduce((acc, item) => {
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
        return groupedData?.map((group) => ({
          ...group,
          data: group.data?.map((item) => ({ ...item })),
        }));
      case "All":
        groupedData = [
          {
            title: "All",
            data: data,
          },
        ];
        break;
      default:
        groupedData = [{ title: "All", data }];
        break;
    }
    return groupedData;
  };

  const groupedData = groupByCategory(sortedData, currentFilter);
  const sectionListData = JSON.parse(JSON.stringify(groupedData));

  // checking if user has already created today's expense or not
  const today = moment().format("YYYY/MM/DD");
  const foundDate = expensesData.find((obj) => {
    return moment(obj.date, "YYYY/MM/DD").format("YYYY/MM/DD") === today;
  });

  const DATA = [
    {
      title: moment().format("Do MMMM, YYYY"),
      data: ["You havent added any expense for today"],
    },
  ];

  // #region checking and adding recurrence expenses in home screen
  useFocusEffect(
    useCallback(() => {
      fetchRecurrencesData();
    }, [])
  );

  const fetchRecurrencesData = async () => {
    try {
      const res = await AsyncStorage.getItem("ALL_RECURRENCES");
      let newData = JSON.parse(res);
      if (newData !== null) dispatch(storeRecurrences(newData));
    } catch (e) {
      console.log("error: ", e);
    }
  };

  const recurrencesData = useSelector(
    (state) => state.recurrenceReducer.allRecurrences
  );

  const addRecurringExpenses = useCallback(() => {
    const today = moment();

    const expenses = [];

    for (const expense of recurrencesData) {
      const {
        frequency,
        recurrenceStartDate,
        recurrenceEndDate,
        repeatRecurrrence,
      } = expense;
      let fre = "";
      if (frequency === "Daily") fre = "days";
      if (frequency === "Weekly") fre = "weeks";
      if (frequency === "Monthly") fre = "months";
      if (frequency === "Yearly") fre = "years";

      const startDate = moment(recurrenceStartDate, "DD MM YY");
      if (repeatRecurrrence) {
        let nextDate = startDate.clone();
        while (nextDate.isSameOrBefore(today, "day")) {
          expenses.push({
            ...expense,
            recurrenceStartDate: nextDate.format("DD MM YY"),
          });
          nextDate = nextDate.add(1, fre);
          dispatch(updateRecurrences(expense.id, nextDate.format("DD MM YY")));
        }
      }
      if (!repeatRecurrrence && startDate.add(1, fre).isSameOrBefore(today, "day")) {
        expenses.push({
          ...expense,
          recurrenceStartDate: startDate.format("DD MM YY"),
        });
        dispatch(deleteRecurrences(expense.id))
      }
    }
    const updatedExpenses = expenses.map(expense => {
      const { recurrenceAmount, recurrenceName, recurrenceStartDate, paymentNetwork, paymentType, time } = expense;
    
      return {
        amount: recurrenceAmount,
        desc: `${recurrenceName} recurrence`,
        id: Math.random() * 10,
        date: moment(recurrenceStartDate, "DD MM YY").format("YYYY/MM/DD"),
        name: recurrenceName,
        selectedCard: paymentNetwork,
        selectedCategory: { iconCategory: "FontAwesome", iconName: "repeat" },
        time: time,
        type: paymentType
      };
    });
    if (updatedExpenses.length > 0) dispatch(addData(updatedExpenses));
  }, [recurrencesData, dispatch]);

  useEffect(() => {
    addRecurringExpenses();
  }, [addRecurringExpenses]);
  // #endregion

  return (
    <SafeAreaView style={{ margin: 20 }}>
      <View style={{ marginBottom: 120 }}>
        {sectionListData && (
          <>
            {!foundDate && (
              <SectionList
                scrollEnabled={false}
                sections={DATA}
                keyExtractor={(item, index) => item.id + index}
                renderItem={({ item }) => (
                  <View style={{ alignItems: "center" }}>
                    <Text variant="titleMedium">{item}</Text>
                  </View>
                )}
                renderSectionHeader={({ section: { title } }) => (
                  <Text
                    variant="titleMedium"
                    style={{ marginTop: 7, marginBottom: 7 }}
                  >
                    {title}
                  </Text>
                )}
                ItemSeparatorComponent={Separator}
              />
            )}
            <SectionList
              scrollEnabled={false}
              sections={sectionListData}
              keyExtractor={(item, index) => item.id + index}
              renderItem={renderItem}
              renderSectionHeader={({ section: { title } }) => (
                <Text
                  variant="titleMedium"
                  style={{ marginTop: 7, marginBottom: 7 }}
                >
                  {title}
                </Text>
              )}
              ItemSeparatorComponent={Separator}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ExpensesList;
