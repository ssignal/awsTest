const DIVIDER = '|';

const getSnakeCase = (key) =>
  key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
const getCamelCase = (key) =>
  key.replace(/_[a-z]/g, (letter) => letter.substr(1, 1).toUpperCase());

module.exports = {
  getServiceId: (code, service_type, group_id) =>
    `${code}${DIVIDER}${service_type}${DIVIDER}${group_id}`,
  // getServiceCode: (serviceId) => serviceId.split(DIVIDER)[0],
  replaceGroupId: (serviceId, groupId) => {
    const items = serviceId.split(DIVIDER);
    return items[0] + DIVIDER + items[1] + DIVIDER + groupId;
  },
  isTvWakeup: ({ service_code, service_type }) =>
    service_code == REQUEST_CODE_TV && service_type == REQUEST_TYPE_WAKUPCALL,
  toSnackCase: (obj) => {
    let newObj = {};
    for (const key in obj) {
      if (obj[key]) newObj[getSnakeCase(key)] = obj[key];
    }
    return newObj;
  },
  toCamelCase: (obj) => {
    let newObj = {};
    for (const key in obj) {
      if (obj[key]) newObj[getCamelCase(key)] = obj[key];
    }
    return newObj;
  },
};
