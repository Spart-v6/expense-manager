import * as constants from './constants';

export const addData = payload => ({
  type: constants.ADD_DATA,
  payload,
});

export const updateData = payload => ({
  type: constants.UPDATE_DATA,
  payload,
});

export const deleteData = payload => ({
  type: constants.DELETE_DATA,
  payload,
});
export const getData = () => ({
  type: constants.GET_DATA,
});
