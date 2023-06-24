import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Animated,
  Easing,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
  Vibration,
} from "react-native";
import { Dialog, Text, Portal, Button, Divider } from "react-native-paper";
import useDynamicColors from "../commons/useDynamicColors";
import moment from "moment";
import Feather from "react-native-vector-icons/Feather";

const compareDates = (date1, month1, year1, date2, month2, year2) => {
  const date1String = `${year1}-${month1}-${date1}`;
  const date2String = `${year2}-${month2}-${date2}`;

  const momentDate1 = moment(date1String, 'YYYY-MMM-DD');
  const momentDate2 = moment(date2String, 'YYYY-MMM-DD');

  return momentDate2.isAfter(momentDate1);
};

const Calendar = ({ year, month, onDateChange, selectedDate, setSelectedDate, disableTheDates }) => {
  const allColors = useDynamicColors();
  const styles = makeStyles(allColors);
  const todayDate = moment().date();
  const todayMonth = moment().month("MMMM").format("MMMM");
  const todayYear = moment().year();
  
  const monthNumber = moment(month, 'MMMM').format('M');
  moment.updateLocale('en', {
    weekdaysShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  });
  const weekdays = moment.weekdaysShort();
  const startDate = moment({ year, month: monthNumber - 1 }).startOf('month');
  const startDay = startDate.day();
  const daysInMonth = startDate.daysInMonth();

  const calendarArray = [];
  for (let i = 0; i < startDay; i++) calendarArray.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarArray.push(i);

  const renderItem = ({ item }) => {

    const handleDatePress = () => {
      setSelectedDate(item);
      onDateChange(item);
      Vibration.vibrate(1);
    }

    if (item === null) return <View style={styles.nullCell} />;

    const disableDates = compareDates(todayDate, todayMonth, todayYear, item, month, year);

    return (
      <TouchableWithoutFeedback onPress={handleDatePress} disabled={disableDates && disableTheDates}>
        <View style={[styles.cell,
          selectedDate === item && {backgroundColor: allColors.selectedDateColor},
          disableDates && disableTheDates && {backgroundColor: 'transparent'}
        ]}>
          <Text style={[styles.dateText, 
            selectedDate === item && {color: allColors.selectedDateTextColor},
            disableDates && disableTheDates && {color: allColors.backgroundColorTertiary}
          ]}>
            {item}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View style={styles.calendarContainer}>
      <FlatList
        data={calendarArray}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={7}
        contentContainerStyle={styles.flatListContent}
        ListHeaderComponent={
          <View style={styles.weekdaysContainer}>
            {weekdays.map((day, index) => 
              <Text key={index} style={[styles.weekdayText, {color: allColors.backgroundColorTertiary}]}>{day}</Text>
            )}
          </View>
        }
      />
    </View>
  );

};

const generateYearList = () => {
  const currentYear = moment().year();
  const startYear = 1950;
  const years = [];

  for (let year = startYear; year <= currentYear; year++) {
    years.push({ id: Math.random() * 10, name: year });
  }

  return years;
};

const MyDatePicker = ({
  open,
  setOpen,
  fetchDates,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  selectedDate,
  setSelectedDate,
  disableTheDates
}) => {
  const allColors = useDynamicColors();
  const styles = makeStyles(allColors);

  const todayDate = moment().date();
  const todayMonth = moment().month("MMMM").format("MMMM");
  const todayYear = moment().year();

  const [showYears, setShowYears] = useState(false);
  const currentDate = moment();
  const rotationAngle = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-1000)).current;
  const years = generateYearList();

  const [titleDay, setTitleDay] = useState(currentDate.format("dddd").substring(0,3));
  const [titleMonth, setTitleMonth] = useState(currentDate.format("MMM DD"));

  const closeModal = () => setOpen(false);

  const handleShowMoreYear = () => {
    const toValue = showYears ? 0 : 180;
    setShowYears((prevState) => !prevState);
    Animated.timing(rotationAngle, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleDateChange = newDate => setSelectedDate(newDate);

  const renderItem = ({ item }) => {
    const isSelected = item.name === selectedYear;

    const handleYearPress = () => {
      handleShowMoreYear();
      setSelectedYear(isSelected ? null : item.name);
    };

    return (
      <TouchableOpacity onPress={handleYearPress}>
        <View style={styles.itemContainer}>
          {item.name === moment().year() &&
            <View style={{backgroundColor: allColors.textColorPrimary, width: "90%", height: '120%', position: 'absolute', top: 18, left: 5, borderRadius: 50}}/>
          }
          <Text variant="titleMedium" style={[{ color: allColors.universalColor} ,item.name === moment().year() &&{color: allColors.backgroundColorSecondary}]} allowFontScaling={false}>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  const handleLeftArrowPress = () => {
    const previousMonth = moment(`${selectedMonth} ${selectedYear}`, 'MMMM YYYY').subtract(1, 'month');
    setSelectedMonth(previousMonth.format('MMMM'));
    setSelectedYear(previousMonth.format('YYYY'));
  };

  const handleRightArrowPress = () => {
    const nextMonth = moment(`${selectedMonth} ${selectedYear}`, 'MMMM YYYY').add(1, 'month');
    setSelectedMonth(nextMonth.format('MMMM'));
    setSelectedYear(nextMonth.format('YYYY'));
  };

  const formatTitle = (date, tempMonth, year) => {
    const month = moment().month(tempMonth).format('M');
    const dateString = `${year}-${month}-${date}`;
    const formattedDay = moment(dateString, 'YYYY-M-D').format("dddd").substring(0,3);
    const rest = moment(dateString, 'YYYY-M-D').format('MMM D');
    return {formattedDay, rest};
  };

  const submitDates = () => {
    fetchDates({selectedDate, selectedMonth, selectedYear});
    closeModal();
  };

  const disableDates = compareDates(todayDate, todayMonth, todayYear, selectedDate, selectedMonth, selectedYear);

  useEffect(() => {
    let animation;

    if (showYears) {
      translateY.setValue(-30);

      animation = Animated.timing(translateY, {
        toValue: 0,
        duration: 100,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      });

      animation.start();
    }

    return () => {
      if (animation) animation.stop();
    };
  }, [showYears, translateY]);

  useEffect(() => {
    const {formattedDay, rest} = formatTitle(selectedDate, selectedMonth, selectedYear);
    setTitleDay(formattedDay);
    setTitleMonth(rest);
  }, [selectedDate, selectedMonth, selectedYear]);

  // #region Animations for left and right arrow btns
  const [animation] = useState(new Animated.Value(0));
  const [animation2] = useState(new Animated.Value(0));

  const handlePressIn = (animation) => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handlePressOut = (animation) => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };
  const animatedStyle1 = {
    opacity: animation,
  };
  const animatedStyle2 = {
    opacity: animation2,
  };
  // #endregion

  return (
    <>
      <Portal>
        <Dialog
          visible={open}
          onDismiss={closeModal}
          style={{
            backgroundColor: allColors.backgroundColorLessPrimary,
            width: "80%",
            alignSelf: "center"
          }}
          theme={{
            colors: {
              backdrop: "#00000099",
            },
          }}
        >
          <Dialog.Title
            style={{
              backgroundColor: allColors.calendarTopColor,
              marginTop: 0,
              marginBottom: 10,
              marginLeft: 0,
              marginRight: 0,
              padding: 30,
              paddingBottom: 20,
              borderTopLeftRadius: 27,
              borderTopEndRadius: 27,
              borderTopRightRadius: 27,
              borderTopStartRadius: 27
            }}
          >
            {/* First Section */}
            <Text variant="displaySmall">{titleDay},</Text>{" "}
            <Text variant="displaySmall">{titleMonth}</Text>
          </Dialog.Title>
          <Dialog.Content style={{alignItems: 'center', maxHeight: 300, height: 270 }}>
            {/* Second Section */}
            <View style={styles.navigationContainer}>
                <TouchableOpacity
                  onPress={handleShowMoreYear}
                  style={{
                    flex: 0.8,
                    flexDirection: "row",
                    gap: 5,
                    alignItems: "center",
                  }}
                  activeOpacity={1}
                >
                  <View style={{flexDirection: 'row'}}>
                    <Text variant="titleMedium" style={{color: allColors.universalColor}}>
                      {selectedMonth} {selectedYear}
                    </Text>
                    <Animated.View
                      style={{
                        transform: [
                          {
                            rotateX: rotationAngle.interpolate({
                              inputRange: [0, 180],
                              outputRange: ["0deg", "180deg"],
                            }),
                          },
                        ],
                      }}
                    >
                      <Feather
                        name="chevron-down"
                        size={18}
                        color={allColors.textColorPrimary}
                        style={{ marginTop: 2, marginLeft: 5 }}
                      />
                    </Animated.View>
                  </View>

                </TouchableOpacity>
              <Divider style={{backgroundColor: allColors.textColorSecondary, height: '70%', maxWidth: 1, flex: 1, marginRight: 10, opacity: 0.5}}/>
              <View style={{flexDirection: "row", gap: 10}}>
                {/* Left arrow button */}
                <TouchableWithoutFeedback onPressIn={() => handlePressIn(animation)} onPressOut={() => handlePressOut(animation)} onPress={handleLeftArrowPress}>
                  <View style={styles.buttonContainer}>
                    <Animated.View style={[styles.rippleEffect, animatedStyle1]} />
                    <Feather
                      name="chevron-left"
                      size={18}
                      color={allColors.textColorPrimary}
                    />
                  </View>
                </TouchableWithoutFeedback>

                {/* Right arrow button */}
                <TouchableWithoutFeedback onPressIn={() => handlePressIn(animation2)} onPressOut={() => handlePressOut(animation2)} onPress={handleRightArrowPress}>
                  <View style={styles.buttonContainer}>
                    <Animated.View style={[styles.rippleEffect, animatedStyle2]} />
                    <Feather
                      name="chevron-right"
                      size={18}
                      color={allColors.textColorPrimary}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
            {showYears ? (
              <>
                <Animated.View
                  style={{
                    transform: [{ translateY }],
                  }}
                >
                  <ScrollView>
                    <FlatList
                      data={years.reverse()}
                      showsHorizontalScrollIndicator={false} 
                      showsVerticalScrollIndicator={false}
                      renderItem={renderItem}
                      keyExtractor={(item) => item.id.toString()}
                      scrollEnabled={false}
                      numColumns={4}
                    />
                  </ScrollView>
                </Animated.View>
              </>
            ) : (
              <Calendar year={selectedYear} month={selectedMonth} onDateChange={handleDateChange}
              selectedDate={selectedDate} setSelectedDate={setSelectedDate} disableTheDates={disableTheDates}
              />
            )}
          </Dialog.Content>
          <Dialog.Actions style={{marginTop: 10, height: 60}}>
            <Button onPress={closeModal}>
              <Text style={{ color: allColors.textColorPrimary }}>Cancel</Text>
            </Button>
            <Button onPress={submitDates} contentStyle={{ width: 60 }} disabled={disableDates && disableTheDates}>
              <Text style={{ color: allColors.textColorPrimary }}>OK</Text>
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const makeStyles = allColors => 
StyleSheet.create({
  navigationContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 8,
  },
  weekdayText: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
  },
  calendarDaysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  currentDayText: {
    fontWeight: "bold",
    color: "blue",
  },
  flatListContent: {
    flexGrow: 1,
    alignItems: "flex-start",
  },
  itemContainer: {
    width: Dimensions.get("window").width / 4,
    padding: 10,
    paddingTop: 20,
    paddingLeft: 20,
    alignItems: "flex-start",
  },
  calendarContainer: {
    flex: 1,
    paddingTop: 10,
    width: "100%"
  },
  weekdayText: {
    fontWeight: 'bold',
    fontSize: 14,
    width: "13%",
    textAlign: 'center',
    color: allColors.backgroundColorTertiary
  },
  flatListContent: {
    flexGrow: 1
  },
  weekdaysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cell: {
    justifyContent: 'space-between',
    alignItems: 'center',
    width: "13%",
    borderRadius: 50,
    paddingVertical: 5,
    margin: 2
  },
  dateText: {
    fontSize: 14,
    color: allColors.universalColor,
  },
  nullCell: {
    flex: 1,
    margin: 2
  },
  buttonContainer: {
    position: 'relative',
  },
  rippleEffect: {
    position: 'absolute',
    backgroundColor: allColors.backgroundColorQuaternary,
    borderRadius: 100,
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
  },
});

export default MyDatePicker;
