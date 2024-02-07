export const ErrorToThrowHandler = (
  errorToThrow: any,
  errorObject = {},
) => {
  const error: any = {
    code: '',
    message: '',
    errorObject: {},
  };

  if(typeof errorToThrow === 'object') {
    error.message = errorToThrow.message;
    error.status = errorToThrow.status;
  }

  return error;
};
