import { HttpException } from '@nestjs/common';

export class HTTPExceptionHandler extends HttpException {
  constructor(error: any) {
    const statusCode = error.status;
    const message = error.message;

    const responseObject = {
      statusCode: statusCode ? statusCode : 400,
      message: message ? message : 'Error',
      errorObject: error.errorObject ? error.errorObject : {},
    };

    if (
      typeof responseObject.errorObject === 'object' &&
      Object.keys(responseObject.errorObject).length === 0
    ) {
      delete responseObject.errorObject;
    }
    super(responseObject, responseObject.statusCode);
  }
}
