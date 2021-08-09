module.exports = [
	// Page 1
	{
		embed: {
			title: "Select ping type",
			description:
				"Please select what you want to ping for. The expansion pings are for requesting a host, if you can host and just need a squad, please use the Stealth/Loud ping."
		},
		selectMenu: {
			customId: "pingselect",
			placeholder: "Select ping type",
			options: [
				{
					label: "Stealth ping",
					description: "For any stealth mission (including expansions)",
					value: "stealth"
				},
				{
					label: "Loud ping",
					description: "For any loud mission (including expansions)",
					value: "loud"
				},
				{
					label: "Ironman ping",
					description: "For Ironman",
					value: "ironman"
				},
				{
					label: "Shadow War ping",
					description: "For Shadow War in the private server",
					value: "shadowwar"
				},
				{
					label: "Night Heist ping",
					description: "Request a host for a Night Heist mission",
					value: "nightheist"
				},
				{
					label: "Freelance Heist ping",
					description: "Request a host for a Freelance Heist mission",
					value: "freelanceheist"
				},
				{
					label: "Daily Challenge ping",
					description: "For the daily challenge",
					value: "daily"
				}
			]
		}
	},

	// Page 2
	{
		embed: {
			stealth: {
				title: "Select missions and difficulties",
				description: "Select up to 3 missions and any difficulties",
				missions: [
					"The Blacksite",
					"The Financier",
					"The Deposit",
					"The Lakehouse",
					"The Withdrawal",
					"The Scientist",
					"The SCRS",
					"Black Dusk",
					"The Killhouse",
					"The Auction",
					"The Gala",
					"The Cache",
					"The Setup",
					"The Lockup"
				]
			},
			loud: {
				title: "Select missions and difficulties",
				description: "Select up to 3 missions and any difficulties",
				missions: [
					"The Blacksite",
					"The Financier",
					"The Deposit",
					"The Lakehouse",
					"The Withdrawal",
					"The Scientist",
					"The SCRS",
					"Black Dusk",
					"The Killhouse",
					"The Lockup",
					"The Score"
				]
			},
			ironman: {
				title: "Select method and difficulties",
				description: "You can select multiple difficulties. You can not ping for Legend Stealth Ironman.",
				method: ["Stealth", "Loud", "Mixed"]
			},
			nightheist: {
				title: "Select mission and difficulty",
				description: "This is for requesting a mission host, if you need a squad, please use the Stealth/Loud ping.",
				missions: ["The Auction", "The Gala", "The Cache"]
			},
			freelanceheist: {
				title: "Select mission and difficulty",
				description:
					"This is for requesting a mission host, if you need a squad, please use the Stealth/Loud ping. You can not ping for Setup loud/Score stealth.",
				missions: ["The Setup", "The Lockup", "The Score"],
				method: ["Stealth", "Loud"]
			},
			daily: {
				title: "Select difficulties",
				description: "You can select multiple difficulties."
			}
		},
		selectMenu: {
			mission: {
				customId: "mission",
				placeholder: "Select mission"
			},
			method: {
				customId: "method",
				placeholder: "Select method"
			},
			difficulty: {
				customId: "difficulty",
				placeholder: "Select difficulty"
			}
		}
	},

	// Page 3
	{
		stealth: {
			title: "Stealth ping",
			color: ""
		},
		loud: {
			title: "Loud ping",
			color: ""
		},
		ironman: {
			title: "Ironman ping",
			color: ""
		},
		shadowwar: {
			title: "Shadow War ping",
			color: ""
		},
		nightheist: {
			title: "Night Heist ping",
			color: ""
		},
		freelanceheist: {
			title: "Freelance Heist ping",
			color: ""
		},
		daily: {
			title: "Daily Challenge ping",
			color: ""
		}
	}
];
