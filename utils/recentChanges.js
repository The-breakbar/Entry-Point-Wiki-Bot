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

const processChanges = (response, client) => {
	response.query.recentchanges.reverse().forEach((edit) => {
		if (edit.type == "edit") {
			let { title, user, comment, revid, old_revid, oldlen, newlen } = edit;
			// Underscores for valid links
			title = title.replace(" ", "_");
			user = user.replace(" ", "_");

			// Parse links in edit summary
			comment = comment.replace("User talk", "Message_Wall");
			let wikiTextLinks = comment.match(/\[\[[^\]]+]]/g);
			if (wikiTextLinks)
				wikiTextLinks.forEach((match) => {
					let matchUrl = match.slice(2, -2);
					if (matchUrl.includes("|")) {
						matchUrl = `[${matchUrl.split("|")[1]}](${url}/wiki/${matchUrl.split("|")[0].replace(" ", "_")})`;
					} else {
						matchUrl = `[${matchUrl}](${url}/wiki/${matchUrl.replace(" ", "_")})`;
					}
					comment = comment.replace(match, matchUrl);
				});

			// Create embed
			const delta = (newlen - oldlen < 0 ? "" : "+") + (newlen - oldlen);
			const description =
				`New edit by [${user.replace("_", " ")}](${url}/wiki/User:${user})` + ` (${delta}) ([diff](${url}/wiki/${title}?type=revision&diff=${revid}&oldid=${old_revid}))`;
			const embed = {
				color: global.purple,
				title: title.replace("_", " "),
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
		}
	});
};
