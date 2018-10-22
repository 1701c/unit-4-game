var inBattle = false;

var chars = {
  names: ["Federation", "Klingon", "Romulan", "Borg"],
  cap: [0,5,20,25],
  image: ["assets/images/federation.jpg", "assets/images/klingon.jpg", "assets/images/romulan.jpg", "assets/images/borg.jpg"],
  hp: [],
  ap: [],
  baseAp: [8,0,0,0],
  isEnemy: [],
  index: 0,                
  // attackSound: new Audio("assets/audio/our_hero_death.wav"),

  newGame: function () {
    this.isEnemy = [true, true, true, true];
    this.hp = [120,100,150,180];
    this.ap = [8,0,0,0];
    for (var i = 0; i < this.names.length; i++) {
      console.log("updating images" + " " + this.image[i]);
      $("#playerName" + i).text(this.names[i]);
      $("#playerImage" + i).attr("src",this.image[i]);
      $("#playerHp" + i).text(this.hp[i]);
    }
  }
}

var game = {
  selectPlayer: function (e) {
    var enemy = 0;
    var enemyToDraw = 0;
    chars.index = parseInt(e[e.length - 1]);
    console.log(chars.index);
    $("#heroName").text(chars.names[chars.index]);
    $("#heroImage").attr("src",chars.image[chars.index]);
    $("#heroHp").text(chars.hp[chars.index]);
    for (var i = 0; i < chars.names.length; i++) {
      $("#charSelect").attr("style","display: none;");
      $("#playerChar").attr("style","");
      $("#enemyChar").attr("style","");
    }
    for (var i = 0; i < chars.names.length; i++) {
      if (chars.index != enemy) {
      $("#enemyName" + enemyToDraw).text(chars.names[enemy]);
      $("#enemyImage" + enemyToDraw).attr("src",chars.image[enemy]);
      $("#enemyCard" + enemyToDraw).attr("value",enemy);
      $("#enemyHp" + enemyToDraw).text(chars.hp[enemy]);
      enemyToDraw ++;
      }
      enemy ++;
    }
  },

  selectEnemy: function (e,v) {
    console.log(e + " " + v);
    console.log(e);
    $("#" + e).attr("style","display: none;");
    $("#defender").attr("style","");
    $("#defenderName").text(chars.names[v]);
    $("#defenderImage").attr("src",chars.image[v]);
    $("#defenderHp").text(chars.hp[v]);
    $("#defenderCard").attr("value",v);
  },

  attack: function () {
    var enemy = $("#defenderCard").attr("value");
    chars.hp[enemy] -= chars.ap[chars.index];
    chars.hp[chars.index] -= chars.cap[enemy];    
    $("#heroHp").text(chars.hp[chars.index]);
    $("#defenderHp").text(chars.hp[enemy]);
    if (chars.hp[enemy] < 1) {
      console.log("win if");
      $("#battleLog").html("You have defeated the " + chars.names[enemy] + ", you can choose to fight another enemy.");
      inBattle = false;
      
    } else {
      console.log("continue if");
      $("#battleLog").html("You attacked the " + chars.names[enemy] + " for " + chars.ap[chars.index] + " damage.<br>The " + chars.names[enemy] + " attacked you back for " + chars.cap[enemy] + " damage.");    
    }
    

    chars.ap[chars.index] += chars.baseAp[chars.index];

  }
}

$(document).ready(function() {
  chars.newGame();
  $(".playerCard").on("click", function() {
    game.selectPlayer($(this).attr("id"));
  });
  $(".enemyCard").on("click", function() {
    if (!inBattle) {
      game.selectEnemy($(this).attr("id"),$(this).attr("value"));
      inBattle = true;
    }
  });
  $("#attackBtn").on("click", function() {
    if (inBattle) {
      game.attack();
    }
  });
});
