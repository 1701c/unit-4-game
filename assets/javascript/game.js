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
};

var animator = {
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
};

var game = { // game code
  newGame: function () {
    inBattle = false;
    gameover = false;
    wins = 0;
    chars.initVars();
    for (var i = 0; i < chars.names.length; i++) {
      game.drawcharsDiv('charsDiv', 'player', i);
    }
    $("#charsTitleDiv").removeAttr("style");
    $("#charAndEnemyDiv,#battleTitleDiv,#logDiv,.defenderCard,.btn").attr("style", "display: none;");
    $('#heroDiv,#enemySelectDiv').empty();
    animator.blink('#sycTitleCol', 10);
    $(".playerCard").on("click", function () {
      game.selectPlayer($(this).attr("id"));
      $(".enemyCard").on("click", function () {
        if (!inBattle && !gameover) {
          game.selectEnemy($(this).attr("id"));
        }
      });
    });
  },

  drawcharsDiv: function (parent, child, i, colWidth, colWidthSmall) { // draws cards
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
    this.drawcharsDiv('heroDiv', 'hero', chars.index, 8, 12);
    for (var i = 0; i < chars.names.length; i++) { // moves remaining characters to enemy area
      if (chars.index != enemy) {
        this.drawcharsDiv('enemySelectDiv', 'enemy', enemy, 3, 4);
        enemyToDraw++;
      }
      enemy++;
    }
    $("#charsTitleDiv").attr("style", "display: none;");
    $("#charAndEnemyDiv").removeAttr("style");
    $("#charsDiv").empty();
    animator.blink('#enemiesTitleDiv', 10);
    animator.spin('.heroCard');
    animator.shake(".enemyCard");
  },

  selectEnemy: function (e) {
    inBattle = true;
    chars.currentEnemy = parseInt(e[e.length - 1]); // gets selected character index from id
    $('#defenderDiv').empty();
    this.drawcharsDiv('defenderDiv', 'defender', chars.currentEnemy, 8, 12);
    $("#" + e).attr("style", "visibility:hidden;");
    $("#battleLog").html("You have targeted the " + chars.names[chars.currentEnemy] + " ship.<br>Use the attack button to engage the target.");
    $("#battleTitleDiv,#attackBtn,#logDiv").removeAttr("style");
    animator.spin('.defenderCard');
  },

  attack: function () {
    chars.hp[chars.currentEnemy] -= chars.ap[chars.index]; {}
    chars.ap[chars.index] += chars.baseAp[chars.index];
    if (chars.hp[chars.currentEnemy] < 1) { // enemy destroyed
      wins++;
      inBattle = false;
      chars.hp[chars.currentEnemy] = 0; // no negative hp
      $("#defenderDiv").empty();
      this.drawcharsDiv('defenderDiv', 'defender', chars.currentEnemy, 8, 12);
      $(".defenderImage").attr("src", "assets/images/explosion.jpg");
      $("#attackBtn").attr("style", "display: none;");
      animator.shake("#defenderDiv");
      if (wins === 3) { // last enemy, game won
        gameover = true;
        $("#battleLog").html("You Won!!! GAME OVER!!!");
        $("#refreshBtn").attr("style", "");
      } else { // more enemies remain
        $("#battleLog").html("You have defeated the " + chars.names[chars.currentEnemy] + ", you can choose to fight another enemy.");
        animator.shake("#enemySelectDiv");
        animator.blink('#enemiesTitleDiv', 10);
      }
    } else { // 
      chars.hp[chars.index] -= chars.cap[chars.currentEnemy];
      $("#heroDiv,#defenderDiv").empty();
      this.drawcharsDiv('defenderDiv', 'defender', chars.currentEnemy, 8, 12);
      if (chars.hp[chars.index] < 1) {
        gameover = true;
        chars.hp[chars.index] = 0; // no negative hp
        this.drawcharsDiv('heroDiv', 'hero', chars.index, 8, 12);
        $("#battleLog").html("You have been defeated... GAME OVER!!!");
        $(".heroImage").attr("src", "assets/images/explosion.jpg");
        $("#refreshBtn").attr("style", "");
        $("#attackBtn").attr("style", "display: none;");
        animator.shake(".heroCard");
      } else { // normal attack
        this.drawcharsDiv('heroDiv', 'hero', chars.index, 8, 12);
        $("#battleLog").html("You attacked the " + chars.names[chars.currentEnemy] + " for " + chars.ap[chars.index] + " damage.<br>The " + chars.names[chars.currentEnemy] + " attacked you back for " + chars.cap[chars.currentEnemy] + " damage.");
        animator.blink(".defenderImage,.heroImage", 2);
      }
    }
  }
};

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