const fetch = require("node-fetch");

const url = "https://entry-point.fandom.com";

module.exports = {
	// Callback hell
	recentChanges(interval, client) {
		setInterval(() => {
			const now = Math.floor(Date.now() / 1000);
			const before = now - interval / 1000;
			// Make api call
			fetch(`${url}/api.php?action=query&list=recentchanges&rcprop=title|ids|sizes|comment|user&rcnamespace=0&rcstart=${now}&rcend=${before}&format=json`)
				.then((response) => {
					// Send returned edits in edit log channel
					response.json().then((jsonResponse) => {
						try {
							processChanges(jsonResponse, client);
						} catch (error) {
							console.error(error);
						}
					});
				})
				.catch((error) => console.error(error));
		}, interval);
	}
};

let previousChanges = [];

const processChanges = (response, client) => {
	// Prevent duplicate logging
	let editList = response.query.recentchanges.reverse().filter((edit) => {
		return edit.type == "edit" && !previousChanges.includes(edit);
	});
	previousChanges = editList.slice();

	editList.forEach((edit) => {
		let { title, user, comment, revid, old_revid, oldlen, newlen } = edit;
		// Underscores for valid links
		title = title.replaceAll(" ", "_");
		user = user.replaceAll(" ", "_");

		// Parse links in edit summary
		comment = comment.replace("User talk", "Message_Wall");
		let wikiTextLinks = comment.match(/\[\[[^\]]+]]/g);
		if (wikiTextLinks)
			wikiTextLinks.forEach((match) => {
				let matchUrl = match.slice(2, -2);
				if (matchUrl.includes("|")) {
					matchUrl = `[${matchUrl.split("|")[1]}](${url}/wiki/${matchUrl.split("|")[0].replaceAll(" ", "_")})`;
				} else {
					matchUrl = `[${matchUrl}](${url}/wiki/${matchUrl.replaceAll(" ", "_")})`;
				}
				comment = comment.replace(match, matchUrl);
			});

		// Create embed
		const delta = (newlen - oldlen < 0 ? "" : "+") + (newlen - oldlen);
		const description =
			`New edit by [${user.replaceAll("_", " ")}](${url}/wiki/User:${user})` +
			` (${delta}) ([diff](${url}/wiki/${title}?type=revision&diff=${revid}&oldid=${old_revid}))`;
		const embed = {
			color: global.purple,
			title: title.replaceAll("_", " "),
			url: `${url}/wiki/${title}`,
			description: description,
			fields: [
				{
					name: "Edit summary",
					value: comment ? comment : "No edit summary"
				}
			],
			timestamp: new Date()
		};

		client.wikiServer.editLog.send({ embeds: [embed] }).catch((error) => console.error(error));
	});
};
