var inBattle;
var wins;
var gameover;

var chars = { // character info and initialization
  names: ["Federation", "Klingon", "Romulan", "Borg"],
  cap: [15, 5, 20, 25],
  image: ["assets/images/federation.jpg", "assets/images/klingon.jpg", "assets/images/romulan.jpg", "assets/images/borg.jpg"],
  hp: [],
  ap: [],
  baseAp: [8, 16, 5, 3],
  index: 0,
  currentEnemy: 0,

  initVars: function () {
    this.hp = [120, 100, 150, 180];
    this.ap = [8, 16, 7, 4];
  }
}

var animate = {
  shake: function (r) { //animations for cards
    $(r).css("position", "relative");
    for (var x = 1; x <= 3; x++) {
      $(r).animate({left: (-7)}, 40).animate({left: 7}, 80).animate({left: 0}, 40);
    }
  },

  spin: function (r) {
    $(r).animate({deg: 360}, {
      duration: 600,step: function (now) {
        $(this).css({transform: 'rotate(' + now + 'deg)'});
      }
    });
  },

  blink: function (r, num) {
    var b = ["fadeIn(100)"];
    for (var i = 1; i < num + 1; i++) {
      b += ".fadeOut(100).fadeIn(100)";
    }
    eval('$(r).' + b);
  },
}

var game = { // game code
  newGame: function () {
    inBattle = false;
    gameover = false;
    wins = 0;
    chars.initVars();
    for (var i = 0; i < chars.names.length; i++) {
      game.drawCharDiv('charSelect', 'player', i);
    }
    $("#title0").removeAttr("style");
    $("#title1,#title2,#logDiv,.defenderCard,.btn").attr("style", "display: none;");
    $('#player,#enemySelect').empty();
    animate.blink('#title0-col', 10);
    $(".playerCard").on("click", function () {
      game.selectPlayer($(this).attr("id"));
      $(".enemyCard").on("click", function () {
        if (!inBattle && !gameover) {
          game.selectEnemy($(this).attr("id"));
        }
      });
    });
  },

  drawCharDiv: function (parent, child, i, colWidth, colWidthSmall) { // draws cards
    if (colWidth === undefined) {
      colWidth = 2;
      colWidthSmall = 3; // resposiveness for small screens
    }
    $('#' + parent).append('<div class="col-' + colWidthSmall + ' col-md-' + colWidth + ' text-center rounded gameCard ' + child + 'Card" id="' + child + 'Card' + i + '">');
    $('#' + parent).append('<div class="d-none d-md-block col-1">');
    $('#' + child + 'Card' + i).append('<p class="p2" style="text-align:left;">' + chars.names[i] + '<span style="float:right;"> HP: ' + chars.hp[i] + '</span></p>');
    $('#' + child + 'Card' + i).append('<img src="' + chars.image[i] + '" class="img-fluid shipImage ' + child + 'Image" id="' + child + 'Image' + i + '"></img>');
    $('#' + child + 'Card' + i).append('<p class="p2" id="card-bottom" style="text-align:left;">' + chars.names[i] + '<span style="float:right;"> HP: ' + chars.hp[i] + '</span></p>');
  },

  selectPlayer: function (e) {
    var enemy = 0;
    var enemyToDraw = 0; // number in id of enemy
    chars.index = parseInt(e[e.length - 1]); // gets selected character index from id
    this.drawCharDiv('player', 'hero', chars.index, 8, 12);
    for (var i = 0; i < chars.names.length; i++) { // moves remaining characters to enemy area
      if (chars.index != enemy) {
        this.drawCharDiv('enemySelect', 'enemy', enemy, 3, 4);
        enemyToDraw++;
      }
      enemy++;
    }
    $("#title0").attr("style", "display: none;");
    $("#title1").removeAttr("style");
    $("#charSelect").empty();
    animate.blink('#enemies-col', 10);
    animate.spin('.heroCard');
    animate.shake(".enemyCard");
  },

  selectEnemy: function (e) {
    inBattle = true;
    chars.currentEnemy = parseInt(e[e.length - 1]); // gets selected character index from id
    $('#defender').empty();
    this.drawCharDiv('defender', 'defender', chars.currentEnemy, 8, 12);
    $("#" + e).attr("style", "visibility:hidden;");
    $("#battleLog").html("You have targeted the " + chars.names[chars.currentEnemy] + " ship.<br>Use the attack button to engage the target.");
    $("#title2,#attackBtn,#logDiv").removeAttr("style");
    animate.spin('.defenderCard');
  },

  attack: function () {
    var enemy = $("#defenderCard0").attr("value");
    chars.hp[chars.currentEnemy] -= chars.ap[chars.index]; {}
    chars.ap[chars.index] += chars.baseAp[chars.index];
    if (chars.hp[chars.currentEnemy] < 1) { // enemy destroyed
      wins++;
      inBattle = false;
      $("#defender").empty();
      chars.hp[chars.currentEnemy] = 0; // no negative hp
      this.drawCharDiv('defender', 'defender', chars.currentEnemy, 8, 12);
      $(".defenderImage").attr("src", "assets/images/explosion.jpg");
      $("#attackBtn").attr("style", "display: none;");
      animate.shake("#defender");
      if (wins === 3) { // last enemy, game won
        gameover = true;
        $("#battleLog").html("You Won!!! GAME OVER!!!");
        $("#refreshBtn").attr("style", "");
      } else { // more enemies remain
        $("#battleLog").html("You have defeated the " + chars.names[chars.currentEnemy] + ", you can choose to fight another enemy.");
        animate.shake("#enemySelect");
        animate.blink('#enemies-col', 10);
      }
    } else { // 
      chars.hp[chars.index] -= chars.cap[chars.currentEnemy];
      $("#player,#defender").empty();
      this.drawCharDiv('defender', 'defender', chars.currentEnemy, 8, 12);
      if (chars.hp[chars.index] < 1) {
        gameover = true;
        chars.hp[chars.index] = 0; // no negative hp
        this.drawCharDiv('player', 'hero', chars.index, 8, 12);
        $("#battleLog").html("You have been defeated... GAME OVER!!!");
        $(".heroImage").attr("src", "assets/images/explosion.jpg");
        $("#refreshBtn").attr("style", "");
        $("#attackBtn").attr("style", "display: none;");
        animate.shake(".heroCard");
      } else { // normal attack
        this.drawCharDiv('player', 'hero', chars.index, 8, 12);
        $("#battleLog").html("You attacked the " + chars.names[chars.currentEnemy] + " for " + chars.ap[chars.index] + " damage.<br>The " + chars.names[chars.currentEnemy] + " attacked you back for " + chars.cap[chars.currentEnemy] + " damage.");
        animate.blink(".defenderImage,.heroImage", 2);
      }
    }
  }
}

$(document).ready(function () {
  game.newGame();
  $("#attackBtn").on("click", function () {
    if (inBattle && !gameover) {
      game.attack();
    }
  });
  $("#refreshBtn").on("click", function () {
    game.newGame();
  });
});