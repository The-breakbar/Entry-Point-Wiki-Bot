const WikiBot = require("nodemw");

let client = new WikiBot({
	protocol: "https",
	server: "entry-point.fandom.com",
	path: ""
});

client.logIn(process.env.WIKI_USERNAME, process.env.WIKI_PASSWORD, (err) => {
	if (err) {
		console.log(err);
		return;
	}
	console.log("Logged in!");

	client.getArticle("Template:DailyChallenge", (err, content) => {
		if (err) {
			console.log(err);
			return;
		}
		console.log(content);
	});
});
