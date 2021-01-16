import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RequestHandler } from 'express';


const validateBodyAs = (type: any): RequestHandler => {
  return async (req, _, next) => {
    const parsedBody = plainToClass(type, req.body, { excludeExtraneousValues: true });
    const validationErrors = await validate(parsedBody);

    if (validationErrors.length) {
      const message = validationErrors.map((error: ValidationError) => Object.values(error.constraints as Object)).join(', ');
      next(new Error(message));
    } else {
      req.body = parsedBody;
      next();
    }
  }
}

export default validateBodyAs