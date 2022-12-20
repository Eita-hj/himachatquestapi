module.exports = {
	Login: "http://himaquest.com/top_LoginGame2.php",
	Logout: "http://himaquest.com/top_ExitGame.php",
	Guild: {
		Info: "http://himaquest.com/guild_Window.php",
		SendMessage: "http://himaquest.com/chat_HatugenGuild.php",
		ChatEntry: "http://himaquest.com/chat_GuildChatEntry.php",
		BBS: {
			Window: "http://himaquest.com/guild_BBSWindow.php",
			List: "http://himaquest.com/guild_BBSSerch.php",
			Create: "http://himaquest.com/guild_BBSCreate.php",
			Send: "http://himaquest.com/guild_BBSToukou.php"
		}
	},
	User: {
		Info: "http://himaquest.com/UserWindow.php",
		JoinGuilds: "http://himaquest.com/load_MyGuildList.php",
		Manage: "http://himaquest.com/block_UserKanriWindow.php",
		SendDM: "http://himaquest.com/chat_HatugenKobetu.php",
		Setting: {
			NameChange: "http://himaquest.com/myhouse_NameChange.php",
			ProfileChange: "http://himaquest.com/user_ShoukaiComplete.php"
		},
		Ignores: {
			List: "http://himaquest.com/block_LoadMusiList.php",
			Add: "http://himaquest.com/block_MusiAdd.php",
			Remove: "http://himaquest.com/block_MusiKaizyo.php"
		}
	},
	Chat: {
		AreaMessage: "http://himaquest.com/chat_F5User.php",
		GuildMessage: "http://himaquest.com/chat_F5Guild.php",
		DirectMessage: "http://himaquest.com/chat_F5HTalk.php"
	},
	Ranking: "http://himaquest.com/mission_Ranking.php",
	UpdateInfo: "http://himaquest.com/top_UpdateInfo.php",
	Attachment: {
		Upload:{ 
			Guild: "http://himaquest.com/photo_UploadGuild.php",
			DM: "http://himaquest.com/photo_UploadKobetu.php",
			BBS: "http://himaquest.com/photo_UploadBBS.php"
		},
		Delete: "http://himaquest.com/photo_Delete.php",
		PhotoGet: "http://himaquest.com/photo_Get.php",
		PhotoData: function (id, key, tag){
			return `http://himaquest.com/PhotoBBS/${id}${key}${tag}`
		}
	}
}
