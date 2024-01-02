import { convertCsvToJson, paginationData, search } from "utils";
import fs from 'fs';


export default class Service {
    static upload = async (req: any) => {
        const files = req?.payload?.file;
        const headers = ['postId', 'id', 'name', 'email', 'body'];
        if (files && Array.isArray(files)) {
            for (const file of files) {
                const filePath = file.path;
                convertCsvToJson(filePath, 'output.json', headers);
            }
        } else {
            const filePath = files.path;
            convertCsvToJson(filePath, 'output.json', headers);
        }

        return {
            message: 'Upload successfully',
            status: 200,
        }
    }

    static getListUSerFeedback = async (req: any) => {
        const { page, limit, key } = req?.query;
        const data = await fs.readFileSync('output.json', 'utf8');
        const dataParse = JSON.parse(`${data}`)
        const {
            items,
            total,
            totalPages,
        } = paginationData(dataParse.shift()
            , { page, limit, skip: 0 });

        return {
            data: key ? search(items, key) : items,
            total,
            totalPages,
            status: 200,
        }
    }


}
