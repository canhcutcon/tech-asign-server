import Joi from "joi";
import { JoiSchema } from "joi-class-decorators";

export class IdParams {
    @JoiSchema(Joi.string().required())
    id: string;
}

export class Pagination {
    @JoiSchema(Joi.number().default(50))
    limit: number;

    @JoiSchema(Joi.number().default(1))
    page: number;
}

