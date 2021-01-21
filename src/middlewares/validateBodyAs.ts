import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RequestHandler } from 'express';


const validateBodyAs = (type: any): RequestHandler => {
  return async (req, res, next) => {
    const parsedBody = plainToClass(type, req.body, { excludeExtraneousValues: true });
    const validationErrors = await validate(parsedBody);

    if (validationErrors.length) {
      const message = validationErrors.map((error: ValidationError) => Object.values(error.constraints as Object)).join(', ');
      console.log({ message });
      console.log({ parsedBody });
      res.status(400).json({message});
    } else {
      req.body = parsedBody;
      next();
    }
  }
}

export default validateBodyAs