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
