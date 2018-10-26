var inBattle = false;
var wins = 0;
gameover = false;

var chars = { // character info and initialization
  names: ["Federation", "Klingon", "Romulan", "Borg"],
  cap: [15, 5, 20, 25],
  image: ["assets/images/federation.jpg", "assets/images/klingon.jpg", "assets/images/romulan.jpg", "assets/images/borg.jpg"],
  hp: [],
  ap: [],
  baseAp: [8, 16, 7, 4],
  index: 0,
  currentEnemy: 0,

  newGame: function () {
    this.hp = [120, 100, 150, 180];
    this.ap = [8, 16, 7, 4];
  }
}

var animate = {
  shake: function (r) {
    $(r).css("position", "relative");
    for (var x = 1; x <= 3; x++) {
      $(r).animate({
          left: (-7)
        }, 40)
        .animate({
          left: 7
        }, 80)
        .animate({
          left: 0
        }, 40);
    }
  },

  spin: function (r) { //rotation animation
    $(r).animate({
      deg: 360
    }, {
      duration: 600,
      step: function (now) {
        $(this).css({
          transform: 'rotate(' + now + 'deg)'
        });
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
  drawCharDiv: function (parent, child, i) {
    $('#' + parent).append('<div class="col-2 text-center rounded ' + child + 'Card" id="' + child + 'Card' + i + '">');
    $('#' + child + 'Card' + i).append(chars.names[i] + '<img src="' + chars.image[i] + '" class="img-fluid ' + child + 'Image" id="' + child + 'Image' + i + '"> HP: ' + chars.hp[i]);
    // $('#' + parent).append('<div class="col-1">');
  },

  selectPlayer: function (e) {
    var enemy = 0;
    var enemyToDraw = 0; // number in id of enemy
    chars.index = parseInt(e[e.length - 1]); // gets selected character index from id
    this.drawCharDiv('player', 'hero', chars.index);
    $("#charSelect").empty();
    animate.spin('#heroImage0');
    for (var i = 0; i < chars.names.length; i++) { // moves remaining characters to enemy area
      if (chars.index != enemy) {
        this.drawCharDiv('enemySelect', 'enemy', enemy);
        enemyToDraw++;
      }
      enemy++;
    }
    animate.shake("#enemySelect");
  },

  selectEnemy: function (e) {
    if (wins == 2) {
      $("#" + e).attr("style", "visibility:hidden;"); // keeps div spaced when last emeny removed
    } else {
      $("#" + e).attr("style", "display: none;");
    }
    chars.currentEnemy = parseInt(e[e.length - 1]); // gets selected character index from id
    this.drawCharDiv('defender', 'defender', chars.currentEnemy);
    animate.spin('.defenderImage');
  },

  attack: function () {
    var enemy = $("#defenderCard0").attr("value");
    chars.hp[chars.currentEnemy] -= chars.ap[chars.index]; {}
    chars.ap[chars.index] += chars.baseAp[chars.index];
    if (chars.hp[chars.currentEnemy] < 1) {
      wins++;
      if (wins === 3) {
        $("#battleLog").html("You Won!!! GAME OVER!!!");
        $(".defenderCard").attr("style", "display: none;");
        $("#refreshBtn").attr("style", "");
        gameover = true;
        inBattle = false;
      } else {
        $("#battleLog").html("You have defeated the " + chars.names[chars.currentEnemy] + ", you can choose to fight another enemy.");
        animate.shake("#enemySelect");
        $("#defender").empty();
        inBattle = false;
      }
    } else {
      chars.hp[chars.index] -= chars.cap[chars.currentEnemy];
      $("#player").empty();
      this.drawCharDiv('player', 'hero', chars.index);
      $("#defender").empty();
      this.drawCharDiv('defender', 'defender', chars.currentEnemy);
      if (chars.hp[chars.index] < 1) {
        $("#battleLog").html("You have been defeated... GAME OVER!!!");
        $("#heroImage0").attr("src", "assets/images/explosion.jpg");
        // animate.blink(".enemyCard",5);
        $("#refreshBtn").attr("style", "");
        gameover = true;
      } else {
        $("#battleLog").html("You attacked the " + chars.names[chars.currentEnemy] + " for " + chars.ap[chars.index] + " damage.<br>The " + chars.names[chars.currentEnemy] + " attacked you back for " + chars.cap[chars.currentEnemy] + " damage.");
        animate.blink(".defenderImage", 2);
        animate.blink(".heroImage", 2);
      }
    }
  }
}

$(document).ready(function () {
  chars.newGame();
  for (var i = 0; i < chars.names.length; i++) {
    game.drawCharDiv('charSelect', 'player', i);
  }
  $("#battleLog").html("Select a player to begin.");
  animate.blink('#battleLog',10);
  $(".playerCard").on("click", function () {
    game.selectPlayer($(this).attr("id"));
    $("#battleLog").html("Select an enemy to attack.");
    $(".enemyCard").on("click", function () {
      if (!inBattle && !gameover) {
        $("#battleLog").html("Use the attack button to engage target.");
        game.selectEnemy($(this).attr("id"));
        inBattle = true;
      }
    });
  });
  $("#attackBtn").on("click", function () {
    if (inBattle && !gameover) {
      game.attack();
    }
  });
  $("#refreshBtn").on("click", function () {
    location.reload();
  });
});