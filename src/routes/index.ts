import Joi, { options } from 'joi';
import Service from 'service';

export const UploadFilePayload = {
    maxBytes: 209715200,
    output: 'file',
    parse: true,
    multipart: true,
}

/**
kelvin@canhcutcon ~ % curl -X POST http://localhost:3011/upload -H "Content-Type: multipart/form-data" -F "file=@/Users/kelvin/tech-assessment/tech-asign-server/src/data/data.csv"
curl -X GET http://localhost:3011/list-user-feedback?page=1&limit=10
curl -X GET "http://localhost:3011/list-user-feedback?page=1&limit=1"
*/
export default [
    {
        method: 'GET',
        path: '/hello',
        handler: () => 'Hello World!',
    },
    {
        method: 'POST',
        path: '/upload',
        options: {
            payload: UploadFilePayload,
        },
        handler: Service.upload,
    },
    {
        method: 'GET',
        path: '/list-user-feedback',
        options: {
            validate: {
                query: Joi.object({
                    page: Joi.number(),
                    limit: Joi.number(),
                    key: Joi.string().optional(),
                }),
            },

        },
        handler: Service.getListUSerFeedback,
    },
]