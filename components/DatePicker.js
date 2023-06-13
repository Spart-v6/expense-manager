import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Animated,
  Easing,
  Dimensions,
  ScrollView,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Vibration,
} from "react-native";
import { Dialog, Text, Portal, Button, Divider } from "react-native-paper";
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import allColors from "../commons/allColors";
import moment from "moment";
import Feather from "react-native-vector-icons/Feather";

const Calendar = ({ year, month, onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState(moment().date());
  const monthNumber = moment(month, 'MMMM').format('M');
  moment.updateLocale('en', {
    weekdaysShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  });
  const weekdays = moment.weekdaysShort();
  const startDate = moment({ year, month: monthNumber - 1 }).startOf('month');
  const startDay = startDate.day(); // Sunday: 0, Monday: 1, ..., Saturday: 6
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

    if (item === null) {
      return <View style={styles.nullCell} />;
    }
    return (
      <TouchableWithoutFeedback onPress={handleDatePress} >
        <View style={[styles.cell, selectedDate === item && {backgroundColor: allColors.textColorPrimary}]}>
          <Text style={[styles.dateText, selectedDate === item && {color: allColors.textColorFour}]}>{item}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View style={styles.calendarContainer}>
      {/* Calendar days */}
      <FlatList
        data={calendarArray}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={7}
        contentContainerStyle={styles.flatListContent}
        ListHeaderComponent={<View style={styles.weekdaysContainer}>{weekdays.map((day, index) => <Text key={index} style={styles.weekdayText}>{day}</Text>)}</View>}
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

const MyDatePicker = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [showYears, setShowYears] = useState(false);
  const currentDate = moment();
  const rotationAngle = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-1000)).current;
  const years = generateYearList();

  const [selectedMonth, setSelectedMonth] = useState(currentDate.format("MMMM"));
  const [selectedYear, setSelectedYear] = useState(currentDate.format("YYYY"))
  const [selectedDate, setSelectedDate] = useState(currentDate.date());

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

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
            <View style={{backgroundColor: allColors.textColorPrimary, width: "80%", height: '120%', position: 'absolute', top: 18, left: 4, borderRadius: 50}}/>
          }
          <Text variant="titleMedium" style={item.name === moment().year() &&{color: allColors.textColorTertiary}}>
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
    <GestureHandlerRootView>
      <TouchableOpacity onPress={openModal}>
        <Text>Open Date Picker</Text>
      </TouchableOpacity>

      <Portal>
        <Dialog
          visible={modalVisible}
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
              backgroundColor: allColors.backgroundColorPrimary,
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
            <Text variant="displaySmall">{currentDate.format("dddd").substring(0,3)},</Text>{" "}
            <Text variant="displaySmall">{currentDate.format("MMM DD")}</Text>
          </Dialog.Title>
          <Dialog.Content style={{alignItems: 'center', maxHeight: 300, height: 290 }}>
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
                    <Text variant="titleMedium">
                      {selectedMonth} {selectedYear}
                    </Text>
                    <Animated.View
                      style={{
                        transform: [
                          {
                            rotate: rotationAngle.interpolate({
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
                        style={{ marginTop: 4, marginLeft: 1 }}
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
              <Calendar year={selectedYear} month={selectedMonth} onDateChange={handleDateChange}/>
            )}
          </Dialog.Content>
          <Dialog.Actions style={{marginTop: 10}}>
            <Button onPress={closeModal}>
              <Text style={{ color: allColors.textColorPrimary }}>Cancel</Text>
            </Button>
            <Button onPress={closeModal} contentStyle={{ width: 60 }}>
              <Text style={{ color: allColors.textColorPrimary }}>OK</Text>
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
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
    // borderWidth: 1,
    // borderColor: '#ccc',
    width: "13%",
    borderRadius: 50,
    paddingVertical: 5,
    margin: 2
  },
  dateText: {
    fontSize: 14,
    color: allColors.backgroundColorQuaternary,
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
    backgroundColor: '#FFD3D3D3', // Default ripple color
    borderRadius: 100,
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
  },
});

export default MyDatePicker;
