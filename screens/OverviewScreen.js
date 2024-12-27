import React from 'react';
import MyText from "../components/MyText";
import { Dimensions, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import useDynamicColors from '../commons/useDynamicColors';
import AppHeader from '../components/AppHeader';

import { BarChart, LineChart, PieChart, PopulationPyramid } from "react-native-gifted-charts";
import { useSelector } from 'react-redux';

const AppHeaderMemoized = React.memo(AppHeader);
const data=[ {value:50}, {value:80}, {value:90}, {value:70} ]

const OverviewScreen = ({navigation}) => {
    const allColors = useDynamicColors();
    const chartData = useSelector(data => data.expenseReducer.chartData);
    // console.log("Chart data: " + chartData["2024"].expense.daily);
    // todo: make a button to select, year, month and week to see daily chart
    // select None in daily to see for week chart,
    // select None in weekly to see for month chart,
    // select None in month to see for year chart,

    
    // TODO: make chart data , i mean store chart data based on weekly, monthly and yearly.. so there should be a reducer for storing weekly, monthly and yearly data.. 
    //  causing less overhead in fetching chart data

    const data = [
      {value: 2500, frontColor: '#006DFF', gradientColor: '#009FFF', spacing: 6, label:'Jan'},
      {value: 2400, frontColor: '#3BE9DE', gradientColor: '#93FCF8'},
  
      {value: 3500, frontColor: '#006DFF', gradientColor: '#009FFF', spacing: 6, label:'Feb'},
      {value: 3000, frontColor: '#3BE9DE', gradientColor: '#93FCF8'},
  
      {value: 4500, frontColor: '#006DFF', gradientColor: '#009FFF', spacing: 6, label:'Mar'},
      {value: 4000, frontColor: '#3BE9DE', gradientColor: '#93FCF8'},
  
      {value: 5200, frontColor: '#006DFF', gradientColor: '#009FFF', spacing: 6, label:'Apr'},
      {value: 4900, frontColor: '#3BE9DE', gradientColor: '#93FCF8'},
  
      {value: 3000, frontColor: '#006DFF', gradientColor: '#009FFF', spacing: 6, label:'May'},
      {value: 2800, frontColor: '#3BE9DE', gradientColor: '#93FCF8'},

    ];
    // TODO: for daily, show Sunday to saturday bar graphs
    // TODO: for weekly, show week wise for a month, like week 23 of june, week 25 of july etc..
    // TODO: for monthly, show Jan to Dec month wise
    // TODO: for yearly, yearly like 2023 whole, 2022 whole like that
    // todo: bug in recent transacstion date at left side 
    // bug: in total expenses amount and in icnome and expense as well and in cards as well.. wrongly shown the amount (done)
    // todo: bug, when updating the date for a expense, it does not replicate the given date in dateText field rather the calendar shows today's date instead
    // todo: for susbscription page: manage all your subcriptions here
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor={"transparent"} barStyle={allColors.barStyle}/>
      <AppHeaderMemoized
        title="Overview"
        navigation={navigation}
        isMenuNeeded={false}
        isParent={true}
      />
      <View style={{ margin: 20, padding: 10, borderRadius: 20, backgroundColor: allColors.backgroundColorLessPrimary}}>
        <MyText style={{color: 'white', fontSize: 16, }}>
          Income vs Expense
        </MyText>
        <View style={{padding: 20, alignItems: 'center'}}>
          <BarChart
            data={data}
            barWidth={16}
            initialSpacing={10}
            spacing={14}
            barBorderRadius={4}
            showGradient
            yAxisThickness={0}
            xAxisType={'dashed'}
            xAxisColor={'lightgray'}
            yAxisTextStyle={{color: 'lightgray'}}
            stepValue={1000}
            maxValue={6000}
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

          />
        </View>
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