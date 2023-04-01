import { constants as types } from "../actionTypes";

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

export const updateCard = (id, updatedCard) => {
  return {
    type: types.UPDATE_CARD,
    payload: {id, updatedCard}
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