import { ethers } from "ethers";
import { Pagination } from "./request-type";
import fs from 'fs';
import csv from 'csv-parser';

export function trimslash(s: string) {
	return s[s.length - 1] === "/" ? s.slice(0, s.length - 1) : s;
}

export const randomString = (numberCharacter: number) => {
	return `${ethers.hexlify(ethers.randomBytes(numberCharacter)).toUpperCase()}`
}
export const getPagination = (query: Pagination, defaultLimit = 50) => {
	const page = query.page || 1
	const limit = query.limit || defaultLimit
	const skip = (page - 1) * limit
	delete query.page
	delete query.limit
	return {
		page,
		skip,
		limit,
	}
}

export const paginationData = function (value: any, pagination: { skip: number; page: number; limit: number }) {
	const { limit, page, skip } = pagination
	const total = value?.length || 0
	const totalPages = Math.ceil(total / limit)
	const paginatedItems = value.slice(skip, skip + limit)

	return {
		items: paginatedItems,
		total,
		page,
		limit,
		totalPages,
	}
}

export const convertCsvToJson = (filePath: string, jsonFilePath: string, headers: string[]) => {
	const results = [];
	fs.createReadStream(filePath)
		.pipe(csv({ headers: headers })) // Adjust headers based on your CSV file
		.on('data', (data) => {
			results.push(data);
		})
		.on('end', () => {
			const jsonData = JSON.stringify(results, null, 2);
			fs.writeFileSync('output.json', jsonData);
			console.log(`Conversion complete. JSON data written to ${jsonFilePath}`);
		})
		.on('error', (error) => {
			console.error('Error converting CSV to JSON:', error.message);
		});

	return results.pop();
};