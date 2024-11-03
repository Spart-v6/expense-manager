import { constants as types } from "../actionTypes";
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
    smsList: [],
};

const saveSmsToStorage = async (smsList) => {
    try {
        await AsyncStorage.setItem('smsList', JSON.stringify(smsList));
    } catch (error) {
        console.error("Failed to save SMS to storage: ", error);
    }
};

const loadSmsFromStorage = async () => {
    try {
        const savedSms = await AsyncStorage.getItem('smsList');
        return savedSms ? JSON.parse(savedSms) : [];
    } catch (error) {
        console.error("Failed to load SMS from storage: ", error);
        return [];
    }
};

const smsReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.ADD_SMS:
            const newSmsList = action.payload.filter(
                (newSms) => !state.smsList.some((sms) => sms.id === newSms.id)
            );
            const updatedSmsList = [...state.smsList, ...newSmsList];

            saveSmsToStorage(updatedSmsList);

            return {
                ...state,
                smsList: updatedSmsList,
            };

        case types.READ_SMS:
            loadSmsFromStorage().then((loadedSmsList) => {
                return {
                    ...state,
                    smsList: loadedSmsList,
                };
            });
            return state;

        case types.DEL_SMS:
            const filteredSmsList = state.smsList.filter((sms) => sms.id !== action.payload);

            saveSmsToStorage(filteredSmsList);

            return {
                ...state,
                smsList: filteredSmsList,
            };

        case types.SET_SMS:
            return {
                ...state,
                smsList: action.payload,
            };

        default:
            return state;
    }
};

export default smsReducer;
