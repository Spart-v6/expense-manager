import { constants as types } from "../actionTypes";

// For expenses

export const addData = payload => ({
  type: types.ADD_DATA,
  payload,
});

export const updateData = (sameId, updatedObj) => {
  return {
    type: types.UPDATE_DATA,
    payload: { sameId, updatedObj }
  }
}

export const deleteData = payload => ({
  type: types.DELETE_DATA,
  payload,
});

export const storeData = (payload) => ({
  type: types.STORE_DATA,
  payload
});

// For Account cards

export const addCard = payload => ({
  type: types.ADD_CARD,
  payload
});

export const updateCard = (sameId, updatedCard) => {
  return {
    type: types.UPDATE_CARD,
    payload: {sameId, updatedCard}
  }
};

export const deleteCard = payload => ({
  type: types.DELETE_CARD,
  payload
});

export const storeCard = payload => ({
  type: types.STORE_CARD,
  payload
})

// For recurrences

export const addRecurrences = payload => ({
  type: types.ADD_RECURRENCE,
  payload
});

export const updateRecurrences = (sameId, updatedRecurrence) => {
  return {
    type: types.UPDATE_RECURRENCE,
    payload: {sameId, updatedRecurrence}
  }
};

export const deleteRecurrences = payload => ({
  type: types.DELETE_RECURRENCE,
  payload
});

export const storeRecurrences = payload => ({
  type: types.STORE_RECURRENCE,
  payload
})

// For groups

export const addGroups = payload => ({
  type: types.ADD_GROUPS,
  payload: payload
});

export const deleteGroups = payload => ({
  type: types.DELETE_GROUPS,
  payload
});

export const storeGroups = payload => ({
  type: types.STORE_GROUPS,
  payload
})

// For sections inside groups

export const addSections = payload => ({
  type: types.ADD_SECTIONS,
  payload: payload
});

export const deleteSections = payload => ({
  type: types.DELETE_SECTIONS,
  payload
});

export const storeSections = payload => ({
  type: types.STORE_SECTIONS,
  payload
})