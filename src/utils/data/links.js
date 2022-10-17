module.exports = {
	Login: "http://himaquest.com/top_LoginGame2.php",
	Logout: "http://himaquest.com/top_ExitGame.php",
	Guild: {
		Info: "http://himaquest.com/guild_Window.php",
		SendMessage: "http://himaquest.com/chat_HatugenGuild.php",
		ChatEntry: "http://himaquest.com/chat_GuildChatEntry.php"
	},
	User: {
		Info: "http://himaquest.com/UserWindow.php",
		JoinGuilds: "http://himaquest.com/load_MyGuildList.php",
		Manage: "http://himaquest.com/block_UserKanriWindow.php",
		SendDM: "http://himaquest.com/chat_HatugenKobetu.php"
	},
	Chat: {
		AreaMessage: "http://himaquest.com/chat_F5User.php",
		GuildMessage: "http://himaquest.com/chat_F5Guild.php",
	},
	Ranking: "http://himaquest.com/mission_Ranking.php",
	UpdateInfo: "http://himaquest.com/top_UpdateInfo.php",
	Attachment: {
		Upload:{ 
			Guild: "http://himaquest.com/photo_UploadGuild.php/",
			DM: "http://himaquest.com/photo_UploadKobetu.php/"
		},
		Delete: "http://himaquest.com/photo_Delete.php",
		PhotoGet: "http://himaquest.com/photo_Get.php",
		PhotoData: function (id, key, tag){
			return `http://himaquest.com/PhotoBBS/${id}${key}${tag}`
		}
	}
}
