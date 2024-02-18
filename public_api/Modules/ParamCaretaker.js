/**
 * ValidationError - Custom error class for validation errors.
 *
 * @class
 * @extends Error
 */
class ValidationError extends Error {
	/**
     * Create a ValidationError instance.
     *
     * @param {string} message - The error message.
     */
	constructor(message) {
		super(message);
		this.name = 'ValidationError';
	}
}

/**
 * ParamCaretaker - A class for parameter validation.
 *
 * @class
 */
class ParamCaretaker {
	/**
     * Validate the type of a parameter.
     *
     * @param {string} paramName - The name of the parameter.
     * @param {any} paramValue - The value of the parameter.
     * @param {string} expectedType - The expected type of the parameter.
     * @throws {ValidationError} Throws a validation error if the type is
     *     incorrect.
     */
	validateType(paramName, paramValue, expectedType) {
		// Validation logic for type
		if (expectedType === 'int' && !Number.isInteger(paramValue)) {
			throw new ValidationError(`${paramName} should be an integer`);
		} else if (expectedType === 'float' && isNaN(paramValue)) {
			throw new ValidationError(
				`${paramName} should be a floating point number`);
		} else if (
			expectedType === 'string' && typeof paramValue !== 'string') {
			throw new ValidationError(`${paramName} should be a string`);
		}
	}

	/**
     * Validate the length of a parameter.
     *
     * @param {string} paramName - The name of the parameter.
     * @param {string} paramValue - The value of the parameter.
     * @param {number} expectedLength - The expected length of the parameter.
     * @throws {ValidationError} Throws a validation error if the length is
     *     incorrect.
     */
	validateLength(paramName, paramValue, expectedLength) {
		// Validation logic for length
		if (typeof paramValue === 'string' && paramValue.length !== expectedLength) {
			throw new ValidationError(
				`${paramName} should have a length of ${expectedLength}`);
		}
	}

	/**
     * Validate the range of a parameter.
     *
     * @param {string} paramName - The name of the parameter.
     * @param {number} paramValue - The value of the parameter.
     * @param {number[]} range - The allowed range for the parameter.
     * @throws {ValidationError} Throws a validation error if the value is
     *     outside the range.
     */
	validateRange(paramName, paramValue, range) {
		// Validation logic for range
		if (typeof paramValue === 'number' && (paramValue < range[0] || paramValue > range[1])) {
			throw new ValidationError(`${paramName} should be in the range [${
				range[0]}, ${range[1]}]`);
		}
	}

	/**
     * Validate the values of a parameter against allowed values.
     *
     * @param {string} paramName - The name of the parameter.
     * @param {string} paramValue - The value of the parameter.
     * @param {string[]} allowedValues - The allowed values for the parameter.
     * @throws {ValidationError} Throws a validation error if the value is not
     *     in the allowed values.
     */
	validateValues(paramName, paramValue, allowedValues) {
		// Validation logic for allowed values
		const valuesToCheck = paramValue.split(' ');
		for (const value of valuesToCheck) {
			if (allowedValues && allowedValues.indexOf(value) === -1) {
				throw new ValidationError(
					`${paramName} should have a value among ${
						allowedValues.join(', ')}`);
			}
		}
	}

	/**
     * Validate parameters based on an endpoint's definition.
     *
     * @param {object} endpoint - The definition of an endpoint containing
     *     parameters.
     * @param {object} requestData - The data to validate against the endpoint
     *     definition.
     * @returns {null|object} Returns null if validation is successful,
     *     otherwise returns an error object.
     * @throws {ValidationError} Throws a validation error if any validation
     *     fails.
     */
	validate(endpoint, requestData) {
		try {
			// Check for missing mandatory parameters
			const missingParameters = endpoint.params.filter(
				param => param.mandatory && !requestData[param.name]);
			if (missingParameters.length > 0) {
				throw new ValidationError(`Parameter(s) required missing: ${
					missingParameters.map(param => param.name).join(', ')}`);
			}

			// Validate each parameter in the request data
			Object.keys(requestData).forEach(paramName => {
				const endpointsParams = endpoint.params;
				const foundParam = endpointsParams.find(param => param.name === paramName);

				if (foundParam) {
					// Validate length, type, range, and values based on
					// endpoint definition
					if (foundParam.length) {
						this.validateLength(
							paramName, requestData[paramName],
							foundParam.length);
					}
					if (foundParam.type) {
						this.validateType(
							paramName, requestData[paramName], foundParam.type);
					}
					if (foundParam.range) {
						this.validateRange(
							paramName, requestData[paramName],
							foundParam.range);
					}
					if (foundParam.values) {
						this.validateValues(
							paramName, requestData[paramName],
							foundParam.values);
					}
				} else {
					// Throw an error if the parameter is not found in the
					// endpoint definition
					throw new ValidationError(
						`Unknown parameter: ${paramName}`);
				}
			});

			// Return null if validation is successful
			return null;
		} catch (error) {
			// Catch and handle ValidationError
			if (error instanceof ValidationError) {
				return {
					error : error.message,
					status_code : 400,
				};
			}
			// Re-throw other errors
			throw error;
		}
	}
}

// Export the ParamCaretaker class for use in other modules
module.exports = ParamCaretaker;

// Example Usage:
/*
const paramCaretaker = new ParamCaretaker();

// Example endpoint definition
const endpoint = {
  params: [
    { name: 'param1', mandatory: true, type: 'int', range: [1, 10] },
    { name: 'param2', mandatory: false, length: 5, values: ['value1', 'value2']
},
  ],
};

// Example request data
const requestData = {
  param1: 5,
  param2: 'value1',
};

// Validate the request data against the endpoint definition
const validationResult = paramCaretaker.validate(endpoint, requestData);

// Log the validation result
console.log(validationResult);
*/
