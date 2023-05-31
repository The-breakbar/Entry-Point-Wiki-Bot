const WikiBot = require("nodemw");
const fs = require("fs");

// MediaWiki API Client
let client = new WikiBot({
	protocol: "https",
	server: "entry-point.fandom.com",
	path: ""
});

let isDST = () => {
	// Check daylight saving time in EST (correct until 2026)
	const now = new Date();
	const year = now.getUTCFullYear();
	const dstStart = new Date(`March 1, ${year} 02:00:00 EST`);
	const dstEnd = new Date(`November 1, ${year} 02:00:00 EST`);
	dstStart.setDate(dstStart.getDate() + (14 - dstStart.getDay()));
	dstEnd.setDate(dstEnd.getDate() + (7 - dstEnd.getDay()));
	return dstStart < now && now < dstEnd;
};

let getRemainingTime = () => {
	// Get remaining time until EST midnight
	const now = new Date();
	const wantedTime = new Date();
	wantedTime.setUTCHours(isDST() ? 4 : 5, 0, 0, 0);
	if (wantedTime < now) {
		wantedTime.setDate(wantedTime.getDate() + 1);
	}

	let delta = Math.round((wantedTime - now) / 1000);
	return delta;
};

let getESTDate = () => {
	let now = new Date();
	if (isDST()) {
		now.setUTCHours(now.getUTCHours() + 1);
	}
	let dateString = now.toLocaleString("en-GB", { timeZone: "EST" }).split(",")[0];
	return dateString.split("/").reverse().join("-");
};

let getDailyStrings = () => {
	// Read in the file "DailyChallengeList.txt"
	let lines = fs.readFileSync("utils/DailyChallengeList.txt", "utf8").split("\n");
	let dailyString = lines.find((line) => line.startsWith(getESTDate()));
	let nextDailyString = lines[lines.indexOf(dailyString) + 1];
	return [dailyString, nextDailyString];
};

const letterToClass = {
	G: "challenge-green",
	B: "challenge-blue",
	P: "challenge-purple",
	R: "challenge-red"
};

const missionToTemplate = {
	"The Setup": "{{Robux}} The Setup",
	"The Lockup": "{{Robux}} The Lockup",
	"The Score": "{{Robux}} The Score",
	"The Auction": "{{Robux}} The Auction",
	"The Gala": "{{Robux}} The Gala",
	"The Cache": "{{Robux}} The Cache"
};

let dailyStringIntoObject = (dailyString) => {
	let [, mission, method, c1, m1, c2, m2, c3, m3] = dailyString.split(",");
	return {
		mission: mission,
		templateMission: missionToTemplate[mission] ? missionToTemplate[mission] : mission,
		method: method,
		challenges: [
			{ class: letterToClass[c1], mod: m1, templateMod: m1.split(" ").join("") },
			{ class: letterToClass[c2], mod: m2, templateMod: m2.split(" ").join("") },
			{ class: letterToClass[c3], mod: m3, templateMod: m3.split(" ").join("") }
		]
	};
};

let dailyStrings;

let readDailyStrings = () => {
	return dailyStrings;
};

let initDaily = async () => {
	dailyStrings = getDailyStrings();
	setTimeout(updateDaily, (getRemainingTime() + 1) * 1000);
};

let updateDaily = async () => {
	// Update dailyStrings
	dailyStrings = getDailyStrings();

	client.logIn(process.env.WIKI_USERNAME, process.env.WIKI_PASSWORD, (err) => {
		if (err) {
			console.log(err);
			return;
		}

		// Get the daily challenge template page
		client.getArticle("Template:DailyChallenge", (err, content) => {
			if (err) {
				console.log(err);
				return;
			}

			// Replace the old daily challenge with the new one
			let dailyInfo = dailyStringIntoObject(dailyStrings[0]);

			// Change the mission header and the three challenge headers
			let matches = content.match(/!.*\|.*/g);
			content = content.replace(matches[0], `! colspan="3" style="text-align:center;"|${dailyInfo.templateMission} (${dailyInfo.method})`);
			content = content.replace(matches[1], `! style="text-align:center;"|<span class="${dailyInfo.challenges[0].class}">${dailyInfo.challenges[0].mod}</span>`);
			content = content.replace(matches[2], `! style="text-align:center;"|<span class="${dailyInfo.challenges[1].class}">${dailyInfo.challenges[1].mod}</span>`);
			content = content.replace(matches[3], `! style="text-align:center;"|<span class="${dailyInfo.challenges[2].class}">${dailyInfo.challenges[2].mod}</span>`);

			// Replace the challenge descriptions
			matches = content.match(/\|.*\|.*/g);
			content = content.replace(matches[0], `| style="width: 33%;" |{{ModifierDescription|${dailyInfo.challenges[0].templateMod}}}`);
			content = content.replace(matches[1], `| style="width: 33%;" |{{ModifierDescription|${dailyInfo.challenges[1].templateMod}}}`);
			content = content.replace(matches[2], `| style="width: 33%;" |{{ModifierDescription|${dailyInfo.challenges[2].templateMod}}}`);

			// Get token
			client.getToken("Template:DailyChallenge", "edit", (err, token) => {
				if (err) {
					console.log(err);
					return;
				}

				// Define edit params
				let params = {
					action: "edit",
					title: "Template:DailyChallenge",
					bot: true,
					text: content,
					summary: "Updated daily challenge",
					token: token
				};

				// Update the page
				client.api.call(
					params,
					(err, info, next) => {
						if (err) {
							console.log(err);
							return;
						}
					},
					"POST"
				);
			});
		});
	});
};

module.exports = { initDaily, getRemainingTime, readDailyStrings };
