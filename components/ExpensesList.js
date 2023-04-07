import { View, SafeAreaView, SectionList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text } from "react-native-paper";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useState, useEffect, useCallback } from "react";
import moment from "moment";
import allColors from "../commons/allColors";
import Expenses from "./Expenses";
import { useSelector, useDispatch } from "react-redux";
import { storeData } from "../redux/actions";

const Separator = () => (
  <View
    style={{
      height: 1,
      width: "80%",
      backgroundColor: allColors.backgroundColorTertiary,
      alignSelf: "center"
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

  const groupedData = groupByCategory(expensesData, currentFilter);
  const sectionListData = JSON.parse(JSON.stringify(groupedData));

  return (
    <SafeAreaView style={{ margin: 20 }}>
      <View style={{ marginBottom: 120 }}>
        {sectionListData && (
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
        )}
      </View>
    </SafeAreaView>
  );
};

export default ExpensesList;
