var inBattle = false;
var wins = 0;
gameover = false;

var chars = { // character info and initialization
  names: ["Federation", "Klingon", "Romulan", "Borg"],
  cap: [15,5,20,25], 
  image: ["assets/images/federation.jpg", "assets/images/klingon.jpg", "assets/images/romulan.jpg", "assets/images/borg.jpg"],
  hp: [],
  ap: [],
  baseAp: [8,16,7,4],
  isEnemy: [],
  index: 0,               

  newGame: function () {
    this.isEnemy = [true, true, true, true];
    this.hp = [120,100,150,180];
    this.ap = [8,16,7,4];
    for (var i = 0; i < this.names.length; i++) {
      $("#playerName" + i).text(this.names[i]);
      $("#playerImage" + i).attr("src",this.image[i]);
      $("#playerHp" + i).text(this.hp[i]);
    }
  }
}

var game = { // game code
  forwardAvatars: function (r) { //rotation animation
    $(r).animate(
      { deg: 360 },
      {
        duration: 600,
        step: function(now) {
          $(this).css({ transform: 'rotate(' + now + 'deg)' });
        }
      }
    );
  },

  reverseAvatars: function (r) { //reverses rotation animation
    $(r).animate(
      { deg: 0 },
      {
        duration: 600,
        step: function(now) {
          $(this).css({ transform: 'rotate(' + now + 'deg)' });
        }
      }
    );
  },

  selectPlayer: function (e) {
    var enemy = 0; 
    var enemyToDraw = 0; // number in id of enemy
    chars.index = parseInt(e[e.length - 1]); // gets selected character index from id
    $("#heroName").text(chars.names[chars.index]); // moves to Your Character area
    $("#heroImage").attr("src",chars.image[chars.index]);
    $("#heroHp").text(chars.hp[chars.index]);
    for (var i = 0; i < chars.names.length; i++) { 
      $("#charSelect").attr("style","display: none;");
      $("#playerChar").attr("style","");
      $("#enemyChar").attr("style","");
      this.forwardAvatars('#heroImage');
    }
    for (var i = 0; i < chars.names.length; i++) { // moves remaining characters to enemy area
      if (chars.index != enemy) {
        $("#enemyName" + enemyToDraw).text(chars.names[enemy]);
        $("#enemyImage" + enemyToDraw).attr("src",chars.image[enemy]);
        $("#enemyCard" + enemyToDraw).attr("value",enemy);
        $("#enemyHp" + enemyToDraw).text(chars.hp[enemy]);
        enemyToDraw ++;
      }
      enemy ++;
    }
    $(".enemyImage").fadeIn(100).fadeOut(100).fadeIn(100); 
  },

  selectEnemy: function (e,v) { 
    $("#" + e).attr("style","display: none;");
    $("#defender").attr("style","");
    $("#defenderCard").attr("style","");
    $("#defenderName").text(chars.names[v]);
    $("#defenderImage").attr("src",chars.image[v]);
    if (wins == 1) { 
      this.reverseAvatars('#defenderImage');
    } else { 
      this.forwardAvatars('#defenderImage');
    }
    $("#defenderHp").text(chars.hp[v]);
    $("#defenderCard").attr("value",v);
  },

  attack: function () {
    var enemy = $("#defenderCard").attr("value");
    chars.hp[enemy] -= chars.ap[chars.index];{}
    chars.ap[chars.index] += chars.baseAp[chars.index];
    if (chars.hp[enemy] < 1) {
      wins++;
      if (wins === 3) {
        $("#battleLog").html("You Won!!! GAME OVER!!!");
        $("#defenderCard").attr("style","display: none;");
        $("#refreshBtn").attr("style","");
        gameover = true;
        inBattle = false;
      } else {
        $("#battleLog").html("You have defeated the " + chars.names[enemy] + ", you can choose to fight another enemy.");
        $(".enemyImage").fadeIn(100).fadeOut(100).fadeIn(100); 
        $("#defenderCard").attr("style","display: none;");
        inBattle = false;
      } 
    } else {
      chars.hp[chars.index] -= chars.cap[enemy];    
      $("#heroHp").text(chars.hp[chars.index]);
      $("#defenderHp").text(chars.hp[enemy]);
      if (chars.hp[chars.index] < 1) {
      $("#battleLog").html("You have been defeated... GAME OVER!!!");
      $("#heroImage").attr("src","assets/images/explosion.jpg");
      $("#heroImage").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100); 
      $("#refreshBtn").attr("style","");
      gameover = true;
      } else {
         $("#battleLog").html("You attacked the " + chars.names[enemy] + " for " + chars.ap[chars.index] + " damage.<br>The " + chars.names[enemy] + " attacked you back for " + chars.cap[enemy] + " damage.");
         $("#defenderImage").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
         $("#heroImage").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100); 
        }
      }    
    }    
  }

$(document).ready(function() {
  chars.newGame();
  $(".playerCard").on("click", function() {
    game.selectPlayer($(this).attr("id"));
  });
  $(".enemyCard").on("click", function() {
    if (!inBattle || gameover) {
      game.selectEnemy($(this).attr("id"),$(this).attr("value"));
      inBattle = true;
    }
  });
  $("#attackBtn").on("click", function() {
    if (inBattle && !gameover) {
      game.attack();
    }
  });
  $("#refreshBtn").on("click", function() {
    location.reload();
  });
});