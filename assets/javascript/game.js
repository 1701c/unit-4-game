var inBattle;
var wins;
var gameover;

var chars = { // character info and initialization
  names: ["Federation", "Klingon", "Romulan", "Borg"],
  cap: [15, 5, 20, 25],
  image: ["assets/images/federation.jpg", "assets/images/klingon.jpg", "assets/images/romulan.jpg", "assets/images/borg.jpg"],
  hp: [],
  ap: [],
  baseAp: [8, 16, 7, 4],
  index: 0,
  currentEnemy: 0,

  initVars: function () {
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
  newGame: function() {
    inBattle = false;
    gameover = false;
    wins = 0;
    chars.initVars();
    for (var i = 0; i < chars.names.length; i++) {
      game.drawCharDiv('charSelect', 'player', i,2);
    }
    $("#title0").removeAttr("style");
    $("#title1").attr("style", "display: none;");
    $("#title2").attr("style", "display: none;");
    $("#logDiv").attr("style", "display: none;");
    // $('#battleLog').empty();
    $('#player').empty();
    $(".btn").attr("style", "display: none;");
    animate.blink('#title0-col',10);
    // document.getElementById("heroCard0").style.boxShadow = "10px 20px 30px blue";
   },

  drawCharDiv: function (parent, child, i, colWidth) {
    if (colWidth === undefined) {
      colWidth = 8;
    }
    $('#' + parent).append('<div class="col-' + colWidth + ' text-center rounded gameCard ' + child + 'Card" id="' + child + 'Card' + i + '">');
    $('#' + parent).append('<div class="col-1">');
    $('#' + child + 'Card' + i).append('<p class="p2" style="text-align:left;">' + chars.names[i] + '<span style="float:right;"> HP: ' + chars.hp[i] + '</span></p>');
    $('#' + child + 'Card' + i).append('<img src="' + chars.image[i] + '" class="img-fluid shipImage ' + child + 'Image" id="' + child + 'Image' + i + '"></img>');
    $('#' + child + 'Card' + i).append('<p class="p2" id="card-bottom" style="text-align:left;">' + chars.names[i] + '<span style="float:right;"> HP: ' + chars.hp[i] + '</span></p>');
    // $("#card-bottom").toggleClass('flip');
    // animate.blink("#card-bottom",10);
    // $('#' + parent).append('<div class="col-1">');
  },

  selectPlayer: function (e) {
    console.log('selectPlayer');
    var enemy = 0;
    var enemyToDraw = 0; // number in id of enemy
    chars.index = parseInt(e[e.length - 1]); // gets selected character index from id
    this.drawCharDiv('player', 'hero', chars.index);
    for (var i = 0; i < chars.names.length; i++) { // moves remaining characters to enemy area
      if (chars.index != enemy) {
        this.drawCharDiv('enemySelect', 'enemy', enemy, 3);
        enemyToDraw++;
      }
      enemy++;
    }
    $("#title0").attr("style", "display: none;");
    $("#title1").removeAttr("style");
    $("#charSelect").empty();
    animate.blink('#enemies-col',10);
    animate.spin('.heroCard');
    animate.shake("#enemySelect");
  },

  selectEnemy: function (e) {
    chars.currentEnemy = parseInt(e[e.length - 1]); // gets selected character index from id
    this.drawCharDiv('defender', 'defender', chars.currentEnemy, 12);
    // if (wins == 2) {
      $("#" + e).attr("style", "visibility:hidden;"); // keeps div spaced when last emeny removed
    // } else {
    //   $("#" + e).attr("style", "display: none;");
    // }
    $("#battleLog").html("You have targeted the " + chars.names[chars.currentEnemy] + " ship.<br>Use the attack button to engage the target.");
    $("#title2").removeAttr("style");
    $("#attackBtn").removeAttr("style");
    $("#logDiv").removeAttr("style");

    animate.spin('.defenderCard');
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
        $("#attackBtn").attr("style", "display: none;");
        gameover = true;
        inBattle = false;
      } else {
        $("#battleLog").html("You have defeated the " + chars.names[chars.currentEnemy] + ", you can choose to fight another enemy.");
        $("#attackBtn").attr("style", "display: none;");
        animate.shake("#enemySelect");
        $("#defender").empty();
        inBattle = false;
      }
    } else {
      chars.hp[chars.index] -= chars.cap[chars.currentEnemy];
      $("#player").empty();
      this.drawCharDiv('player', 'hero', chars.index);
      $("#defender").empty();
      this.drawCharDiv('defender', 'defender', chars.currentEnemy, 12);
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
  
  game.newGame();
  
  
  // $("#battleLog").html("Select a player to begin.");
 
  
  $(".playerCard").on("click", function () {
    game.selectPlayer($(this).attr("id"));
    console.log("click");
    
    $("#battleLog").html("Select an enemy to attack.");
    $(".enemyCard").on("click", function () {
      if (!inBattle && !gameover) {
        animate.blink('#defender-col',10);
        
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
    game.newGame();
  });

});