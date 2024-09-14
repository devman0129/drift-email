//network response constant
const STATUS_CODE = {
  OK: {
    KEY: 'OK',
    CODE: 200,
    TITLE: 'OK',
  },
  NOT_FOUND: {
    KEY: 'NOT_FOUND',
    CODE: 404,
    TITLE: 'Not Found',
  },
  INTERNAL_SERVER_ERROR: {
    KEY: 'INTERNAL_SERVER_ERROR',
    CODE: 500,
    TITLE: 'Internal Server Error',
  },
  BAD_REQUEST: {
    KEY: 'BAD_REQUEST',
    CODE: 400,
    TITLE: 'Bad Request',
  },
  UNAUTHORIZED: {
    KEY: 'UNAUTHORIZED',
    CODE: 401,
    TITLE: 'Unauthorized',
  },
  ALREADY_EXIST: {
    KEY: 'ALREADY_EXIST',
    CODE: 422,
    TITLE: 'Already Exist',
  },
};
//user status constant
const ACTIVE_STATUS = {
  DISACTIVE: {
    CODE: 0,
    DESCRIPTION: 'Disactived User',
  },
  ACTIVE: {
    CODE: 1,
    DESCRIPTION: 'Actived User',
  },
};
//inbox integration response constant
const INBOX_STATUS_CODE = {
  SUCCESS: {
    CODE: 200,
    KEY: 'OK',
    TITLE: 'Action performed successfully',
  },
  FAILED: {
    CODE: 400,
    KEY: 'FAILED',
    TITLE: 'Action failed',
  },
  ERROR: {
    CODE: 500,
    KEY: 'ERROR',
    TITLE: 'Something went wrong',
  },
};

module.exports = { STATUS_CODE, ACTIVE_STATUS, INBOX_STATUS_CODE };
