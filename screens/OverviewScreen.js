import React from 'react';
import MyText from "../components/MyText";
import { Dimensions, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import useDynamicColors from '../commons/useDynamicColors';
import AppHeader from '../components/AppHeader';
import moment from 'moment';
import { Button, Menu, Divider, TouchableRipple } from 'react-native-paper';
import Octicons from "react-native-vector-icons/Octicons";
import { BarChart, LineChart, PieChart, PopulationPyramid } from "react-native-gifted-charts";
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storeData } from '../redux/actions';

const AppHeaderMemoized = React.memo(AppHeader);

const OverviewScreen = ({navigation}) => {
    const dispatch = useDispatch();
    const allColors = useDynamicColors();

    React.useEffect(() => {      
      const loadData = async () => {
        const totalIncome = JSON.parse(await AsyncStorage.getItem("TOTAL_INCOME")) || 0;
        const totalExpense = JSON.parse(await AsyncStorage.getItem("TOTAL_EXPENSE")) || 0;
        const totalIncomeForMonth = JSON.parse(await AsyncStorage.getItem("MONTHLY_INCOME")) || 0;
        const totalExpenseForMonth = JSON.parse(await AsyncStorage.getItem("MONTHLY_EXPENSE")) || 0;
        const allExpenses = JSON.parse(await AsyncStorage.getItem("CHART_DATA")) || [];
        const chartData = JSON.parse(await AsyncStorage.getItem("CHART_DATA")) || {};
        
        dispatch({
          type: "SET_INITIAL_TOTALS",
          payload: { totalIncome, totalExpense, totalIncomeForMonth, totalExpenseForMonth, allExpenses, chartData },
        });
      };
    
      loadData();
    }, []);

    useFocusEffect(
      React.useCallback(() => {
        fetchCharts();
      }, [])
    );
  
    const fetchCharts = async () => {
      try {
        const res = await AsyncStorage.getItem("CHART_DATA");
        let chartData = JSON.parse(res);
        
        if (chartData !== null) dispatch(storeData(chartData));
      } catch (e) {}
    };

    
    const chartData = useSelector(data => data.expenseReducer.chartData || {});
    
    // todo: make a button to select, year, month and week to see daily chart
    // select None in daily to see for week chart,
    // select None in weekly to see for month chart,
    // select None in month to see for year chart,

    // #region Set Menus Openings and Closings
    const [visibleYear, setVisibleYear] = React.useState(false);
    const openYearMenu = () => setVisibleYear(true);
    const closeYearMenu = () => setVisibleYear(false);

    const [visibleMonth, setVisibleMonth] = React.useState(false);
    const openMonthMenu = () => setVisibleMonth(true);
    const closeMonthMenu = () => setVisibleMonth(false);


    const [visibleWeek, setVisibleWeek] = React.useState(false);
    const openWeekMenu = () => setVisibleWeek(true);
    const closeWeekMenu = () => setVisibleWeek(false);

    const [visibleDaily, setVisibleDaily] = React.useState(false);
    const openDailyMenu = () => setVisibleDaily(true);
    const closeDailyMenu = () => setVisibleDaily(false);

    // #endregion

    // #region Setting the Menu Items for Year only and making constants for rest
    const [years, setYears] = React.useState([]);

    React.useEffect(() => {
      if (chartData && Object.keys(chartData).length > 0) {
        const yearKeys = Object.keys(chartData);
        setYears(yearKeys);
      }
    }, [chartData]);


    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov","Dec"];
    const weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];
    const daily = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // #endregion

    // #region Selecting default values for drop-down menus
    const [selectedYear, setSelectedYear] = React.useState(() => {
      const keys = Object.keys(chartData);
      return keys.length > 0 ? keys[0] : null; 
    });

    React.useEffect(() => {
      if (chartData) {
        const keys = Object.keys(chartData);
        setSelectedYear(keys[0]);
      }
      setSelectedYear("2024");
    }, [chartData]);

    const [selectedMonth, setSelectedMonth] = React.useState("Jan");
    const [selectedWeek, setSelectedWeek] = React.useState("Week 1");
    const [selectedDaily, setSelectedDaily] = React.useState("Sun");

    const [selectedAllYears, setSelectedAllYears] = React.useState(false);
    
    // #endregion


    // #region Populating data

    const generateYearData = (chartData) => {
      return Object.keys(chartData).flatMap((year) => [
        {
          value: Number(chartData[year]?.expense?.yearly || 0),
          frontColor: '#006DFF',
          gradientColor: '#009FFF',
          spacing: 6,
          label: year,
        },
        {
          value: Number(chartData[year]?.income?.yearly || 0),
          frontColor: '#3BE9DE',
          gradientColor: '#93FCF8',
        },
      ]);
    };
    
    const generateMonthWiseData = (chartData, selectedYear) => {      
      if (!chartData[selectedYear]) {
        return [];
      }
    
      const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
      ];
      const yearData = chartData[selectedYear];
      return months.flatMap((month, index) => [
        {
          value: Number(yearData.expense?.monthly[index] || 0),
          frontColor: '#006DFF',
          gradientColor: '#009FFF',
          spacing: 6,
          label: month,
        },
        {
          value: Number(yearData.income?.monthly[index] || 0),
          frontColor: '#3BE9DE',
          gradientColor: '#93FCF8',
        },
      ]);
    };
    
    // #endregion

    const getData = () => {
      if (selectedAllYears) {
        return generateYearData(chartData);
      }
      if (selectedYear) {
        return generateMonthWiseData(chartData, selectedYear);
      }
      return [];
    };
    

    // TODO: for daily, show Sunday to saturday bar graphs
    // TODO: for weekly, show week wise for a month, like week 23 of june, week 25 of july etc..
    // TODO: for monthly, show Jan to Dec month wise
    // TODO: for yearly, yearly like 2023 whole, 2022 whole like that
    // todo: bug in recent transacstion date at left side 
    // todo: for susbscription page: manage all your subcriptions here
    // TODO: try adding a disabled state, sos month, week and daily will be disabled until user selects a year, month or day.. one by one
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor={"transparent"} barStyle={allColors.barStyle}/>
      <AppHeaderMemoized
        title="Overview"
        navigation={navigation}
        isMenuNeeded={false}
        isParent={true}
      />

      <MyText style={{color: 'white', fontSize: 16, marginLeft: 25, marginBottom: 10, marginTop: 10 }}>
        Income vs Expense
      </MyText>

      <View style={{backgroundColor: allColors.backgroundColorCard, marginLeft: 20, marginRight: 20, borderRadius: 20}}>
      {Object.keys(chartData).length !== 0 ?
        <>
        <View style={{ flexDirection: "row", margin: 20, padding: 10, justifyContent: "flex-end", borderRadius: 20, backgroundColor: allColors.backgroundColorLessPrimary}}>

          {/* Select Year */}
          <View style={{ flexDirection: 'row', paddingRight: 0, paddingLeft: 0, alignSelf: "flex-end" }}>
            <Menu
              anchorPosition="bottom"
              contentStyle={{top: 70, backgroundColor: allColors.backgroundColorLessPrimary}}
              visible={visibleYear}
              onDismiss={closeYearMenu}
              anchor={
                <View style={{flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 10, width: "100%", alignItems: "center"}}>
                  <TouchableRipple style={{padding: 10}} rippleColor="rgba(0, 0, 0, .22)" onPress={openYearMenu}>
                    <View style={{flexDirection: "row", gap: 20, alignItems: "center"}}>
                      <MyText variant="bodyLarge" style={{ color: allColors.universalColor}} fontWeight= "bold">
                        { selectedAllYears && !selectedYear ? "All" : selectedYear }
                      </MyText>
                      <Octicons
                        name="filter"
                        size={20}
                        color={allColors.addBtnColors}
                        style={{ alignSelf: "center" }}
                      />
                    </View>
                  </TouchableRipple>
                  <MyText>{ selectedAllYears && !selectedYear ? "Showing avaible data" : "Showing data from Jan - Dec"}</MyText>
                </View>
            }>
              {years.length > 0 ? (
                <>
                  {years.map((year, index) => (
                    <Menu.Item
                      onPress={() => {
                        setSelectedYear(year);
                        setSelectedAllYears(false);
                        closeYearMenu();
                      }}
                      title={year}
                      titleStyle={{ color: allColors.universalColor }}
                      key={index}
                    />
                  ))}
                  <Menu.Item
                    onPress={() => {
                      setSelectedAllYears(true);
                      setSelectedYear(null);
                      closeYearMenu();
                    }}
                    title={"All"}
                    titleStyle={{ color: allColors.universalColor }}
                  />
                </>
              ) : (
                <Menu.Item title="No data" disabled />
              )}
            </Menu>
          </View>

        </View>

        <View style={{ margin: 20, padding: 20, alignItems: 'center'}}>
          <BarChart
            data={getData()}
            barWidth={15}
            initialSpacing={10}
            spacing={24}
            barBorderRadius={4}
            showGradient
            yAxisThickness={0}
            xAxisType={'dashed'}
            xAxisColor={'lightgray'}
            yAxisTextStyle={{color: 'lightgray'}}
            stepValue={20000}
            maxValue={100000}
            noOfSections={6}
            // yAxisLabelTexts={['0', '2k', '3k', '4k', '5k', '6k']}
            labelWidth={40}
            xAxisLabelTextStyle={{color: 'lightgray', textAlign: 'center'}}
            showLine
            lineConfig={{
              color: '#F29C6E',
              thickness: 3,
              curved: true,
              hideDataPoints: true,
              shiftY: 20,
              initialSpacing: -30,
            }}
            scrollAnimation={true}
            isAnimated={true}
            animationDuration={2}
            // hideYAxis={false}
            // hideRulesBelowChart={false} 
            // rulesColor="#E0E0E0"
            // rulesPadding={10}
            parentWidth={6}
          />
        </View>
        </>
      :
        <View>
          <MyText>
            wait
          </MyText>
        </View>
      }
      </View>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2A2A2A',
    padding: 20,
  },
  title: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
});


export default OverviewScreen