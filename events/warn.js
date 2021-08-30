module.exports = {
	name: "warn",
	async execute(warning, client) {
		console.error(warning);
	}
};
