var fs = require('fs');
var Steam = require('steam');
var SteamTrade = require('steam-trade');

var steamIDtoTrade = ''
var inTrade = false;
var inventory;

// if we've saved a server list, use it
if (fs.existsSync('servers')) {
  Steam.servers = JSON.parse(fs.readFileSync('servers'));
}


var bot = new Steam.SteamClient();
var steamTrade = new SteamTrade();

bot.logOn({
    accountName: '', //Your username here
     password: '', //Your password here
     shaSentryfile: fs.readFileSync("sentryfileLiam")
});

bot.on('loggedOn', function() {
    console.log('Logged in!');
    bot.setPersonaState(Steam.EPersonaState.Online); // to display your bot's status as "Online"
});

bot.on('sentry',function(sentryHash) {
  fs.exists('sentryfile' + steamName, function(exists){
    if(!exists){
      fs.writeFile('sentryfile',sentryHash,function(err) {
      if(err){
        console.log(err);
      } else {
        console.log('Saved sentry file hash as "sentryfile"');
      }
      });
    } else {
      console.log("Sentry file already exists.")
    }
  })
  
});

bot.on('webSessionID', function(sessionID){
	steamTrade.sessionID = sessionID;
    bot.webLogOn(function(cookies){
         cookies.forEach(function(part) { // Share the cookie between libraries
            steamTrade.setCookie(part); // Now we can trade!
            console.log(part)
        });
        steamTrade.loadInventory(730,2, function(data){
            require('fs').writeFile('JSONOUTPUT.json',JSON.stringify(data),function(err) {
                if(err){
                    console.log(err);
                } else {
                    console.log('Saved to JSONOUTPUT.json');
                }
            });
        	inventory = data;
        });
    });
});

bot.on('sessionStart', function(steamID){
	inTrade = true;
	steamTrade.open(steamID, function(){
		console.log("trade successfully started");
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

steamTrade.on('end', function(status, getItems){
	if (status =='complete'){
		getItems(function(items){
			console.log(items);
		});
	}
  inTrade = false;
});