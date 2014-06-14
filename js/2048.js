function game2048(container) {
    this.container = container;
    this.tiles = new Array(16);
}

game2048.prototype = {
    init: function () {
        for (var i = 0, len = this.tiles.length; i < len; i++) {
            var tile = this.newTile(0);
            tile.attr('index', i);
            this.container.append(tile);
            this.tiles[i] = tile;
        }
        this.randomTile();
        this.randomTile();
    },
    newTile: function (val) {
        var tile = $("<div></div>");
        this.setTileVal(tile, val)
        return tile;
    },
    setTileVal: function (tile, val) {
        tile.removeClass();
        tile.addClass("tile").addClass("tile" + val);
        tile.attr('val', val);
        tile.html(val > 0 ? val : '');
    },
    randomTile: function () {
        var zeroTiles = [];
        for (var i = 0, len = this.tiles.length; i < len; i++) {
            if (this.tiles[i].attr('val') == 0) {
                zeroTiles.push(this.tiles[i]);
            }
        }
        var rTile = zeroTiles[Math.floor(Math.random() * zeroTiles.length)];
        this.setTileVal(rTile, Math.random() < 0.8 ? 2 : 4);
    },
    move: function (direction) {
        var j;
        var isMerged = false;
        switch (direction) {
            case 'W':
                for (var i = 4, len = this.tiles.length; i < len; i++) {
                    j = i;
                    while (j >= 4) {
                        if (this.merge(this.tiles[j - 4], this.tiles[j])) {
                            isMerged = true;
                        }
                        j -= 4;
                    }
                }
                break;
            case 'S':
                for (var i = 11; i >= 0; i--) {
                    j = i;
                    while (j <= 11) {
                        this.merge(this.tiles[j + 4], this.tiles[j]);
                        j += 4;
                    }
                }
                break;
            case 'A':
                for (var i = 1, len = this.tiles.length; i < len; i++) {
                    j = i;
                    while (j % 4 != 0) {
                        this.merge(this.tiles[j - 1], this.tiles[j]);
                        j -= 1;
                    }
                }
                break;
            case 'D':
                for (var i = 14; i >= 0; i--) {
                    j = i;
                    while (j % 4 != 3) {
                        this.merge(this.tiles[j + 1], this.tiles[j]);
                        j += 1;
                    }
                }
                break;
        }
        if (isMerged) {
            this.randomTile();
        }
    },
    merge: function (prevTile, currTile) {
        var isMerged = false;
        var prevVal = prevTile.attr('val');
        var currVal = currTile.attr('val');
        if (currVal != 0) {
            if (prevVal == 0) {
                this.setTileVal(prevTile, currVal);
                this.setTileVal(currTile, 0);
                isMerged = true;
            }
            else if (prevVal == currVal) {
                this.setTileVal(prevTile, prevVal * 2);
                this.setTileVal(currTile, 0);
                isMerged = true;
            }
        }

        return isMerged;
    },
    equal: function (tile1, tile2) {
        return tile1.attr('val') == tile2.attr('val');
    },
    max: function () {
        for (var i = 0, len = this.tiles.length; i < len; i++) {
            if (this.tiles[i].attr('val') == 2048) {
                return true;
            }
        }
    },
    over: function () {
        for (var i = 0, len = this.tiles.length; i < len; i++) {
            if (this.tiles[i].attr('val') == 0) {
                return false;
            }
            if (i % 4 != 3) {
                if (this.equal(this.tiles[i], this.tiles[i + 1])) {
                    return false;
                }
            }
            if (i < 12) {
                if (this.equal(this.tiles[i], this.tiles[i + 4])) {
                    return false;
                }
            }
        }
        return true;
    },
    success: function () {
        for (var i = 0, len = this.tiles.length; i < len; i++) {
            if (this.tiles[i].attr('val') == 2048) {
                return true;
            }
        }
        return false;
    },
    clean: function () {
        for (var i = 0, len = this.tiles.length; i < len; i++) {
            this.tiles[i].remove();
        }
        this.tiles = new Array(16);
    }
}

var game;

window.onload = function () {
    $("#start").bind("click", function () {
        this.style.display = 'none';
        game = game || new game2048($("#div2048"));
        game.init();
    });
}

window.onkeydown = function (e) {
    var keychar = String.fromCharCode(e.which);
    if (['W', 'S', 'A', 'D'].indexOf(keychar) > -1) {
        if (game.success()) {
            game.clean();
            $("#start").show();
            $("#start").html("You have won, replay?");
        }
        if (game.over()) {
            game.clean();
            $("#start").show();
            $("#start").html('game over, replay?');
            return;
        }
        game.move(keychar);
    }
}
