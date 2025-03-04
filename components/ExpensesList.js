import React, { useState, useEffect, useCallback } from "react";
import { View, SafeAreaView, SectionList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import moment from "moment";
import useDynamicColors from "../commons/useDynamicColors";
import MyText from "../components/MyText";
import Expenses from "./Expenses";
import { useSelector, useDispatch } from "react-redux";
import { addData, updateRecurrences } from "../redux/actions";
import { storeData, storeRecurrences } from "../redux/actions";

const Separator = () => {
  const allColors = useDynamicColors();
  return (
    <View
      style={{
        height: 1,
        width: "190%",
        backgroundColor: allColors.backgroundColorTertiary,
        alignSelf: "center",
        opacity: 0.5
      }}
    />
  );
}

const ExpensesList = ({ filter }) => {
  const allColors = useDynamicColors();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [currentFilter, setCurrentFilter] = useState("Daily");

  useEffect(() => {
    setCurrentFilter(filter);
  }, [filter]);

  // #region Fetching expenses

  useEffect(() => {
    const loadData = async () => {
      const totalIncome = JSON.parse(await AsyncStorage.getItem("TOTAL_INCOME")) || 0;
      const totalExpense = JSON.parse(await AsyncStorage.getItem("TOTAL_EXPENSE")) || 0;
      const totalIncomeForMonth = JSON.parse(await AsyncStorage.getItem("MONTHLY_INCOME")) || 0;
      const totalExpenseForMonth = JSON.parse(await AsyncStorage.getItem("MONTHLY_EXPENSE")) || 0;
      const allExpenses = JSON.parse(await AsyncStorage.getItem("ALL_EXPENSES")) || [];
    
      dispatch({
        type: "SET_INITIAL_TOTALS",
        payload: { totalIncome, totalExpense, totalIncomeForMonth, totalExpenseForMonth, allExpenses },
      });
    };
  
    loadData();
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
  // #endregion
    
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

  const renderItem = useCallback(({ item, index }) => (
    <Expenses
      item={item}
      index={index}
      onPress={(item) =>
        navigation.navigate("PlusMoreHome", { updateItem: item })
      }
    />
  ), [allColors]);

  const getItemLayout = (data, index) => {
    const itemHeight = 10;
    const offset = itemHeight * index;

    return {
      length: itemHeight,
      offset,
      index,
    };
  };

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
      data: ["You haven't added any expense for today"],
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
    } catch (e) {}
  };

  const recurrencesData = useSelector(
    (state) => state.recurrenceReducer.allRecurrences
  );

  const [isProcessing, setIsProcessing] = useState(false);

  const addRecurringExpenses = useCallback(() => {
    if (isProcessing) return; // Prevent duplicate processing
    setIsProcessing(true);
  
    const expenses = [];
    const currentDate = moment().format("DD MM YY");
  
    recurrencesData.forEach((obj) => {
      const { recurrenceStartDate, frequency, processedDates } = obj;
      const frequencyDays = {
        Daily: 1,
        Weekly: 7,
        Monthly: 30,
        Yearly: 365,
      };
      const daysToAdd = frequencyDays[frequency];
  
      const futureDate = moment(recurrenceStartDate, "DD MM YY")
        .add(daysToAdd, "days")
        .format("DD MM YY");
  
      // Skip if already processed or not due
      if (
        processedDates?.includes(currentDate) ||
        moment(futureDate, "DD MM YY").isAfter(moment(currentDate, "DD MM YY"))
      ) {
        return;
      }
  
      const numOccurrences = Math.floor(
        moment(currentDate, "DD MM YY").diff(
          moment(recurrenceStartDate, "DD MM YY"),
          "days"
        ) / daysToAdd
      );
  
      for (let i = 0; i < numOccurrences; i++) {
        const newObj = {
          ...obj,
          recurrenceStartDate: moment(recurrenceStartDate, "DD MM YY")
            .add(daysToAdd * (i + 1), "days")
            .format("DD MM YY"),
        };
        expenses.push(newObj);
      }
  
      const updatedRecurrenceStartDate = moment(recurrenceStartDate, "DD MM YY")
        .add(numOccurrences * daysToAdd, "days")
        .format("DD MM YY");
  
      dispatch(
        updateRecurrences(obj.id, updatedRecurrenceStartDate, currentDate)
      );
    });
  
    const updatedExpenses = expenses.map((expense) => ({
      ...expense,
      date: moment(expense.recurrenceStartDate, "DD MM YY").format("YYYY/MM/DD"),
      id: Math.random() * 10,
      selectedCategory: { iconCategory: "FontAwesome", iconName: "repeat" },
    }));
  
    if (updatedExpenses.length > 0) dispatch(addData(updatedExpenses));
  
    setIsProcessing(false); // Reset processing flag
  }, [recurrencesData, dispatch, isProcessing]);

  useEffect(() => {
    addRecurringExpenses();
  }, [recurrencesData]);
  
  
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
                    <MyText variant="titleMedium" style={{color: allColors.universalColor}}>{item}</MyText>
                  </View>
                )}
                renderSectionHeader={({ section: { title } }) => (
                  <MyText
                    variant="titleMedium"
                    style={{ marginTop: 7, marginBottom: 7, color: allColors.universalColor }}
                  >
                    {title}
                  </MyText>
                )}
                ItemSeparatorComponent={Separator}
              />
            )}
            <SectionList
              scrollEnabled={false}
              sections={sectionListData}
              keyExtractor={(item, index) => item.id + index}
              renderItem={renderItem}
              initialNumToRender={10}
              getItemLayout={getItemLayout}
              maxToRenderPerBatch={5}
              removeClippedSubviews={true}
              windowSize={10}
              renderSectionHeader={({ section: { title } }) => (
                <MyText
                  variant="titleMedium"
                  style={{ marginTop: 7, marginBottom: 7, color: allColors.universalColor }}
                >
                  {title}
                </MyText>
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
