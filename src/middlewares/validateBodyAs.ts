import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RequestHandler } from 'express';


const validateBodyAs = (type: any): RequestHandler => {
  return async (req, res, next) => {
    const parsedBody = plainToClass(type, req.body, { excludeExtraneousValues: true });
    const validationErrors = await validate(parsedBody);

    if (validationErrors.length) {
      let message = '';
      if (validationErrors[0].children) {
        message = 'Invalid nested data structure';
      } else {
        message = validationErrors.map((error: ValidationError) => Object.values(error.constraints as Object)).join(', ');
      }

      res.status(400).json({message});
    } else {
      req.body = parsedBody;
      next();
    }
  }
}

export default validateBodyAs