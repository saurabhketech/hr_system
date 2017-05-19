import * as BaseProvider from "./BaseProvider";
import util from "util";

const assignTag = (validate, body, validationResult) => {
	return new Promise((resolve, reject) => {
		validate("tag_id", "tag_id cannot be empty").notEmpty();
		validate("mongo_id", "mongo_id cannot be empty").notEmpty();
		validationResult.then(function(result) {
			if (!result.isEmpty()) {
				reject(util.inspect(result.array()));
			} else {
				resolve(body);
			}
		});
	});
};

const changeUnreadStatus = (validate, body, validationResult) => {
	return new Promise((resolve, reject) => {
		validate("mongo_id", "mongo_id cannot be empty").notEmpty();
		validationResult.then(function(result) {
			if (!result.isEmpty()) {
				reject(util.inspect(result.array()));
			} else {
				resolve(body);
			}
		});
	});
};

const deleteEmail = (validate, body, validationResult) => {
	return new Promise((resolve, reject) => {
		validate("mongo_id", "mongo_id cannot be empty").notEmpty();
		validationResult.then(function (result) {
			if (!result.isEmpty()) {
				reject(util.inspect(result.array()));
			} else {
				resolve(body);
			}
		});
	});
};
export default {
	BaseProvider,
	assignTag,
	changeUnreadStatus,
	deleteEmail
};
