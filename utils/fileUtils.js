const fs = require("fs");
const path = require("path");

module.exports = {
	getJsFiles(eventPath) {
		return fs
			.readdirSync(eventPath)
			.filter((file) => file.endsWith(".js"))
			.map((file) => path.join(eventPath, file));
	}
};
