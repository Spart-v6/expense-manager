import { View, StyleSheet, Dimensions } from "react-native";
import { Card, Tooltip } from "react-native-paper";
import React, { useCallback, useEffect, useRef, useState } from "react";
import useDynamicColors from "../commons/useDynamicColors";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import MyText from "../components/MyText";
import { getCurrencyFromStorage } from "../helper/constants";
import formatNumberWithCurrency from "../helper/formatter";
import AsyncStorage from "@react-native-async-storage/async-storage";

const makeStyles = (allColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: allColors.defaultHomeRecurrCard,
      borderRadius: 25,
      margin: 16,
      padding: 16,
    },
    incomeCard: {
      backgroundColor: allColors.backgroundColorCard,
      borderRadius: 25,
      elevation: 1,
      margin: 15,
      marginTop: 4,
      marginBottom: 20,
      padding: 0,
      flex: 1,
      justifyContent: "center",
    },
    incomeContent: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingLeft: 16,
      paddingTop: 16,
      paddingRight: 16,
    },
    expenseCard: {
      backgroundColor: allColors.backgroundColorCard,
      borderRadius: 25,
      elevation: 1,
      margin: 15,
      marginTop: 4,
      marginBottom: 20,
      padding: 0,
      height: 100,
      flex: 1,
    },
    expenseContent: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingLeft: 16,
      paddingTop: 16,
      paddingRight: 16,
    },
    header: {
      alignItems: "flex-start",
      borderBottomColor: "#ddd",
      paddingBottom: 8,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
    },
    content: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 10,
      gap: 20,
    },
    text: {
      fontSize: 16,
    },
    cardContainer: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: allColors.backgroundColorCard,
      borderRadius: 25,
      marginHorizontal: 10,
      elevation: 1,
    },
    contentRow: {
      flex: 1, 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center'
    },
    iconCircle: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
    },
    item: {
      flex: 1,
      backgroundColor: allColors.defaultHomeRecurrCard,
      borderRadius: 25,
      margin: 16,
      padding: 16,
    },
    carouselContainer: {
      justifyContent: 'center',
    },
    paginationContainer: {
      position: 'absolute',
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    dot: {
      width: 5,
      height: 5,
      borderRadius: 4,
      marginHorizontal: 4,
    },
    activeDot: {
      backgroundColor: 'white',
    },
    inactiveDot: {
      backgroundColor: 'gray',
    },
  });

const DashboardCard = ({ currency }) => {
  // --- New Swipable UI Cards (uncomment if needed, and comment below one)
  // #region New Swipable UI Cards
  // const allColors = useDynamicColors();
  // const styles = makeStyles(allColors);
  // const { width } = Dimensions.get('window');
  // const dotsOpacity = useRef(new Animated.Value(0)).current;
  // const timeoutRef = useRef(null);
  // const [currentIndex, setCurrentIndex] = useState(0);
  
  // const data = [1, 2];
  // const CARD_HEIGHT = 200;
  // const totalIncome = useSelector((state) => state.expenseReducer.totalIncome);
  // const totalExpense = useSelector((state) => state.expenseReducer.totalExpense);

  // const totalExpenseForMonth = useSelector((state) => state.expenseReducer.totalExpenseForMonth);
  // const totalIncomeForMonth = useSelector((state) => state.expenseReducer.totalIncomeForMonth);

  // const totalValue = totalIncome - totalExpense;
  
  // // Fade-in animation
  // const fadeInDots = () => {
  //   Animated.timing(dotsOpacity, {
  //     toValue: 1,
  //     duration: 300,
  //     easing: Easing.linear,
  //     useNativeDriver: true,
  //   }).start();
  // };
  
  // // Fade-out animation
  // const fadeOutDots = () => {
  //   Animated.timing(dotsOpacity, {
  //     toValue: 0,
  //     duration: 300,
  //     easing: Easing.linear,
  //     useNativeDriver: true,
  //   }).start();
  // };
  
  // // Handle animations and cleanup
  // const handleSnapToItem = (index) => {
  //   setCurrentIndex(index);
  //   fadeInDots();
  //   if (timeoutRef.current) clearTimeout(timeoutRef.current);
  //   timeoutRef.current = setTimeout(() => {
  //     fadeOutDots();
  //   }, 2500);
  // };
  
  // // Clear timeout on unmount
  // useEffect(() => {
  //   return () => {
  //     if (timeoutRef.current) clearTimeout(timeoutRef.current);
  //   };
  // }, []);
  
  // const renderItem = ({ item, index }) => {
  //   if (index === 0) {
  //     return (
  //       <View style={[styles.item]}>
  //         <View style={{ flex: 1, justifyContent: "space-between", padding: 15 }}>
  //           <MyText variant="titleLarge">My Balance</MyText>
  //           <MyText
  //             style={{ color: allColors.textColorSecondary }}
  //             variant="displaySmall"
  //           >
  //             {formatNumberWithCurrency(totalValue, currency)}
  //           </MyText>
  //         </View>
  //       </View>
  //     );
  //   } else if (index === 1) {
  //     return (
  //       <View style={styles.item}>
  //         <View style={{flex: 1, justifyContent: "space-between", padding: 15}}>
  //           <MyText
  //             variant="titleLarge"
  //             style={{ color: allColors.textColorPrimary }}
  //           >
  //             {moment().format("MMMM")} month
  //           </MyText>
  //           <View style={styles.content}>
  //             <View style={{ flex: 1 }}>
  //               <MyText style={{ color: allColors.textColorPrimary }} variant="titleMedium">
  //                 Income
  //               </MyText>
  //               <View style={{ flexDirection: "row", gap: 2 }}>
  //                 <AntDesign
  //                   name="caretup"
  //                   size={10}
  //                   color={allColors.successColor}
  //                   style={{ alignSelf: "center" }}
  //                 />
  //                 <MyText style={{ color: allColors.textColorSecondary }} variant="titleSmall">
  //                   {formatNumberWithCurrency(totalIncomeForMonth, currency)}
  //                 </MyText>
  //               </View>
  //             </View>
  //             <View style={{ flex: 1 }}>
  //               <MyText style={{ color: allColors.textColorPrimary }} variant="titleMedium">
  //                 Expense
  //               </MyText>
  //               <View style={{ flexDirection: "row", gap: 2 }}>
  //                 <AntDesign
  //                   name="caretdown"
  //                   size={10}
  //                   color={allColors.warningColor}
  //                   style={{ alignSelf: "center" }}
  //                 />
  //                 <MyText style={{ color: allColors.textColorSecondary }} variant="titleSmall">
  //                   {formatNumberWithCurrency(totalExpenseForMonth, currency)}
  //                 </MyText>
  //               </View>
  //             </View>
  //           </View>
  //         </View>
  //       </View>
  //     );
  //   } else {
  //     return (
  //       <View style={styles.item}>
  //         <Text style={{ color: 'red' }}>Unexpected card</Text>
  //       </View>
  //     );
  //   }
  // };
  
  // return (
  //   <View style={[styles.carouselContainer, { height: CARD_HEIGHT }]}>
  //     <Carousel
  //       width={width}
  //       height={CARD_HEIGHT}
  //       data={data}
  //       onSnapToItem={handleSnapToItem}
  //       renderItem={renderItem}
  //     />
  //     <Animated.View
  //       style={[
  //         styles.paginationContainer,
  //         { bottom: CARD_HEIGHT * 0.15 },
  //         { opacity: dotsOpacity },
  //       ]}
  //     >
  //       {data.map((_, index) => (
  //         <View
  //           key={index}
  //           style={[
  //             styles.dot,
  //             currentIndex === index ? styles.activeDot : styles.inactiveDot,
  //           ]}
  //         />
  //       ))}
  //     </Animated.View>
  //   </View>
  // );
  // #endregion
  
  // --- Old styled UI of cards (comment this one and uncomment above to use new)

  const allColors = useDynamicColors();
  const styles = makeStyles(allColors);

  const totalIncome = useSelector((state) => state.expenseReducer.totalIncome);
  const totalExpense = useSelector((state) => state.expenseReducer.totalExpense);

  const totalExpenseForMonth = useSelector((state) => state.expenseReducer.totalExpenseForMonth);
  const totalIncomeForMonth = useSelector((state) => state.expenseReducer.totalIncomeForMonth);

  const totalValue = totalIncome - totalExpense;

  return (
    <Card style={[styles.card]}>
      <Card.Title
        title="Available Balance"
        titleStyle={{
          color: allColors.universalColor,
          fontSize: 20,
          fontFamily: "Poppins_400Regular",
        }}
      />
      <MyText
        style={{
          fontSize: 30,
          textAlignVertical: "center",
          padding: 16,
          paddingTop: 0,
          marginTop: -15,
          color: allColors.textColorPrimary,
        }}
      >
        {formatNumberWithCurrency(totalValue, currency)}
      </MyText>
      <Card.Content>
        <MyText
          style={{ color: allColors.universalColor, fontSize: 20 }}
        >
          Spending in {moment().format("MMMM")}
        </MyText>
        <View style={styles.content}>
          <View style={{ flex: 1 }}>
            <MyText style={{ color: allColors.textColorPrimary }} variant="titleSmall">
              Income
            </MyText>
            <View style={{ flexDirection: "row", gap: 2 }}>
              <AntDesign
                name="caretup"
                size={10}
                color={allColors.successColor}
                style={{ alignSelf: "center" }}
              />
              <MyText style={{ color: allColors.textColorSecondary }} variant="titleSmall">
                + {formatNumberWithCurrency(totalIncomeForMonth, currency)}
              </MyText>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <MyText style={{ color: allColors.textColorPrimary }} variant="titleSmall">
              Expense
            </MyText>
            <View style={{ flexDirection: "row", gap: 2 }}>
              <AntDesign
                name="caretdown"
                size={10}
                color={allColors.warningColor}
                style={{ alignSelf: "center" }}
              />
              <MyText style={{ color: allColors.textColorSecondary }} variant="titleSmall">
                - {formatNumberWithCurrency(totalExpenseForMonth, currency)}
              </MyText>
            </View>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};
const IncomeCard = ({ currency }) => {
  const allColors = useDynamicColors();
  const styles = makeStyles(allColors);
  const totalIncome = useSelector((state) => state.expenseReducer.totalIncome);

  return (
    <View style={[styles.cardContainer, { marginLeft: 16 }]}>
      <View style={styles.contentRow}>
        <View style={[styles.iconCircle, {backgroundColor: allColors.receiveGreenBg}]}>
          <Feather name="trending-up" size={20} color={allColors.receiveGreenTextBg} />
        </View>
        <View>
          <Tooltip
            title={formatNumberWithCurrency(totalIncome, currency)}
            theme={{
              colors: {
                onSurface: allColors.backgroundColorSecondary,
                surface: allColors.textColorFour,
              },
            }}
          >
            <View>
              <MyText
                style={{
                  color: allColors.successColor,
                  maxWidth: Dimensions.get("window").width / 4,
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
                variant="labelMedium"
                allowFontScaling={false}
                >
                + {formatNumberWithCurrency(totalIncome, currency)}
              </MyText>
            </View>
          </Tooltip>
        </View>
      </View>
    </View>
  );
};

const ExpenseCard = ({ currency }) => {
  const allColors = useDynamicColors();
  const styles = makeStyles(allColors);
  const totalExpense = useSelector((state) => state.expenseReducer.totalExpense);

  return (
    <View style={[styles.cardContainer, {marginRight: 16}]}>
      <View style={styles.contentRow}>
        <View style={[styles.iconCircle, {backgroundColor: allColors.payRedBg}]}>
          <Feather name="trending-down" size={20} color={allColors.payRedTextBg} />
        </View>
        <Tooltip
          title={formatNumberWithCurrency(totalExpense, currency)}
          theme={{
            colors: {
              onSurface: allColors.backgroundColorSecondary,
              surface: allColors.textColorFour,
            },
          }}
          >
          <View>
            <MyText
              style={{
                color: allColors.warningColor,
                maxWidth: Dimensions.get("window").width / 4,
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
              variant="labelMedium"
              allowFontScaling={false}
              >
              - {formatNumberWithCurrency(totalExpense, currency)}
            </MyText>
          </View>
        </Tooltip>
      </View>
    </View>
  );
};


const HomeHeader = () => {
  const dispatch = useDispatch();
  //fetching currency
  const [currency, setCurrency] = React.useState({
    curr: "$",
  });

  React.useEffect(() => {
    const fetchCurrency = async () => {
      const storedCurrency = await getCurrencyFromStorage();
      setCurrency(storedCurrency);
    };
    fetchCurrency();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const totalIncome = JSON.parse(await AsyncStorage.getItem("TOTAL_INCOME")) || 0;
      const totalExpense = JSON.parse(await AsyncStorage.getItem("TOTAL_EXPENSE")) || 0;
      const totalIncomeForMonth = JSON.parse(await AsyncStorage.getItem("MONTHLY_INCOME")) || 0;
      const totalExpenseForMonth = JSON.parse(await AsyncStorage.getItem("MONTHLY_EXPENSE")) || 0;
    
      dispatch({
        type: "SET_INITIAL_TOTALS",
        payload: { totalIncome, totalExpense, totalIncomeForMonth, totalExpenseForMonth },
      });
    };
  
    loadData();
  }, []);
  



  return (
    <View>
      <DashboardCard currency={currency.curr} />
      <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
        <IncomeCard currency={currency.curr} />
        <ExpenseCard currency={currency.curr} />
      </View>
    </View>
  );
};

export default HomeHeader;
