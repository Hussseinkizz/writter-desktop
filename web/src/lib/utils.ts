import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Executes a function and returns a SafeResult with the result or error.
 * @param fn - The synchronous or asynchronous function to execute.
 * @param throwTheError - If true, rethrows the error on catch.
 * @returns An object containing the result or error.
 */
export const safeTry = async <T>(
	fn: () => Promise<T>,
	throwTheError = false,
) => {
	let result: T | null = null;
	let error: unknown = null;
	try {
		result = await fn();
	} catch (e) {
		console.error(e);
		if (throwTheError) {
			throw e;
		}
		error = e;
	}

	return { result, error };
};
