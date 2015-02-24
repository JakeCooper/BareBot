var fs = require('fs');
var Steam = require('steam');
var SteamTrade = require('steam-trade');

var steamIDtoTrade = '76561198009923867'
var inTrade = false;
var inventory;

// if we've saved a server list, use it
if (fs.existsSync('servers')) {
  Steam.servers = JSON.parse(fs.readFileSync('servers'));
}


var bot = new Steam.SteamClient();
var steamTrade = new SteamTrade();

bot.logOn({
    accountName: 'sirrofl360',
     password: 'lightningrox',
     shaSentryfile: fs.readFileSync("sentryfileLiam")
});

bot.on('loggedOn', function() {
    console.log('Logged in!');
    bot.setPersonaState(Steam.EPersonaState.Online); // to display your bot's status as "Online"
});

/*bot.on('sentry',function(sentryHash) {
    require('fs').writeFile('sentryfile',sentryHash,function(err) {
      if(err){
        console.log(err);
      } else {
        console.log('Saved sentry file hash as "sentryfile"');
      }
    });
});*/

bot.on('webSessionID', function(sessionID){
	steamTrade.sessionID = sessionID;
    bot.webLogOn(function(cookies){
         cookies.forEach(function(part) { // Share the cookie between libraries
            steamTrade.setCookie(part); // Now we can trade!
            console.log(part)
        });
        steamTrade.loadInventory(730,2, function(data){
            /*require('fs').writeFile('JSONOUTPUT.json',JSON.stringify(data),function(err) {
                if(err){
                    console.log(err);
                } else {
                    console.log('Saved to JSONOUTPUT.json');
                }
            });*/
        	inventory = data;
        });
        bot.trade(steamIDtoTrade);
    });
});

bot.on('sessionStart', function(steamID){
	inTrade = true;
	steamTrade.open(steamID, function(){
		console.log("trade successfully started");
		steamTrade.chatMsg("Holy");
		/*steamTrade.addItem(inventory[0], function(){
			console.log(inventory[1]["id"]);
		});*/
	});
});

steamTrade.on('ready', function(){
	console.log(steamTrade.tradePartnerSteamID + ' readying');
	steamTrade.ready(function(){
		console.log("Bot Ready");
		steamTrade.confirm();
		console.log("Bot Confirming");
	});

});

/*steamTrade.on('offerChanged', function(added, item){
	
});*/

steamTrade.on('end', function(status, getItems){
	if (status =='complete'){
		getItems(function(items){
			console.log(items);
		});
	}
});


/*steamTrade.on('end', function(status, getItems) {
  if (status == 'complete') {
    getItems(function(items) {
      console.log(items);
    });
  }
});*/

/*bot.on('tradeResult', function(tradeID, EEconTradeResponse, SteamID){
	//bot.respondToTrade(tradeID, true);
	steamTrade.open(SteamID, function(){
		console.log("trade successfully started");
	});
});*/

/*bot.on('tradeProposed', function(tradeID, steamID){
	bot.respondToTrade(tradeID, true);
});*/

/*bot.on('servers', function(servers) {
  fs.writeFile('servers', JSON.stringify(servers));
});

bot.on('chatInvite', function(chatRoomID, chatRoomName, patronID) {
  console.log('Got an invite to ' + chatRoomName + ' from ' + bot.users[patronID].playerName);
  bot.joinChat(chatRoomID); // autojoin on invite
});

bot.on('message', function(source, message, type, chatter) {
  // respond to both chat room and private messages
  console.log('Received message: ' + message);
  if (message == 'ping') {
    bot.sendMessage(source, 'pong', Steam.EChatEntryType.ChatMsg); // ChatMsg by default
  }
});

bot.on('chatStateChange', function(stateChange, chatterActedOn, steamIdChat, chatterActedBy) {
  if (stateChange == Steam.EChatMemberStateChange.Kicked && chatterActedOn == bot.steamID) {
    bot.joinChat(steamIdChat);  // autorejoin!
  }
});

bot.on('announcement', function(group, headline) { 
  console.log('Group with SteamID ' + group + ' has posted ' + headline);
});*/
