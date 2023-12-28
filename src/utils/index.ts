import { ethers } from "ethers";
import { Pagination } from "./request-type";

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

export const readDataFromCSV = (csv: string) => {
	const lines = csv.split("\n")
	const result = []
	const headers = lines[0].split(",")
	for (let i = 1; i < lines.length; i++) {
		const obj = {}
		const currentline = lines[i].split(",")
		for (let j = 0; j < headers.length; j++) {
			obj[headers[j]] = currentline[j]
		}
		result.push(obj)
	}
	return result
}

