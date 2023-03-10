import { constants as types } from "../actionTypes";

export const addData = payload => ({
  type: types.ADD_DATA,
  payload,
});

export const updateData = payload => ({
  type: types.UPDATE_DATA,
  payload,
});

export const deleteData = payload => ({
  type: types.DELETE_DATA,
  payload,
});
export const getData = () => ({
  type: types.GET_DATA,
});
