export const isStatusOk = (status) => {
  return status > 199 && status < 300;
};

export const isEmptyObject = (obj) => {
  return Object.keys(obj).length == 0;
};
