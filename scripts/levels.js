function dungeon() {
	this.rooms = [[new level(), new level(), new level(), new level(), new level()],
								[new level(), new level(), new level(), new level(), new level()],
								[new level(), new level(), new level(), new level(), new level()],
								[new level(), new level(), new level(), new level(), new level()],
								[new level(), new level(), new level(), new level(), new level()]];
	this.roomX = 2;
	this.roomY = 2;

	this.bossRoomX;
	this.bossRoomY;
	this.inBossRoom = false;
	
	this.lastDir = -1;
	
	this.buttons = [false, false, false];
	//this.buttons = [true, true, true];
	this.completed = false;
}


function level() {
	this.width;
	this.height;
	this.tileSize;

	this.enemyCount = 0;
	this.enemies = [];
	
	this.completed = false;

	this.map = [];
}


function restartLevel(dir, step) {
	//change room
	if (dir == -1) {}
	else if (dir%2 == 0) {
		dungeon.roomX += step;
	}
	else {
		dungeon.roomY += step;
	}
	dungeon.lastDir = dir;

	tx = totalWidth/2-current.tileSize*current.width/2; 
	ty = totalHeight/2-current.tileSize*current.height/2;
	
	current.enemies = [];
	current = dungeon.rooms[dungeon.roomY][dungeon.roomX];
	tiles = current.width * current.height;

	translate(-tx, -ty);
	tx = totalWidth/2-current.tileSize*current.width/2; 
	ty = totalHeight/2-current.tileSize*current.height/2;
	translate(tx, ty);

	//check if room is boss room
	dungeon.inBossRoom = dungeon.roomX == dungeon.bossRoomX && dungeon.roomY == dungeon.bossRoomY;
	
	if (!boss.alive && dungeon.inBossRoom) {
		boss.alive = true;
		boss.x = (current.width/2 - 1) * current.tileSize;
		boss.y = (current.height/2 - 1) * current.tileSize;
	}
	

	//enemy and gate setups
	current.enemyCount = 0;
	playerBullets = [];
	enemyBullets = [];
	
	for (i = 0; i < tiles; i++) {
		//enemy setup
		if (current.map[i] == 94) {
			current.enemies.push(new emeny());
			enemy = current.enemies[current.enemies.length-1];
			enemy.alive = true;
			enemy.x = enemy.old_x = (i % current.width + .25) * current.tileSize;
			enemy.y = enemy.old_y = (floor(i / current.width) + .25) * current.tileSize;
			enemy.mapIndex = i;
			
			current.enemyCount++;
		}

		//gate setups
		for (j = 0; j < 3; j++) {
			if (dungeon.buttons[j]) {
				if (current.map[i] >= 36 + j*8 && current.map[i] <= 43 + j*8) {
					current.map[i] *= -1;
				}
				
				if (current.map[i] >= 72 && current.map[i] <= 81) {
					value = current.map[i]-72;
					current.map[i] *= value%5 == j+1 ? -1 : 1;
					if (j == 2) {
						current.map[i] *= value%5 == j+2 ? -1 : 1;
					}
				}
			}
		}

		if (dungeon.buttons[0] && dungeon.buttons[1] && dungeon.buttons[2]) {
			if (abs(current.map[i]) >= 72 && abs(current.map[i]) <= 81) {
				current.map[i] *= 0;
			}
		}
	}
	
	//player setups
	player.vx = 0;
	player.vy = 0;

	if (dungeon.lastDir == -1) {
		player.x = (current.width/2 - .25) * current.tileSize;
		player.y = (current.height/2 - .25) * current.tileSize;
	}
	else if (dungeon.lastDir%2 == 0) {
		
		player.x = (dungeon.lastDir == 2 ? 1.25 : current.width - 1.75) * current.tileSize;
		player.y = (current.height/2 - .25) * current.tileSize;
	}
	else {
		
		player.x = (current.width/2 - .25) * current.tileSize;
		player.y = (dungeon.lastDir == 3 ? 1.25 : current.height - 1.75) * current.tileSize;
	}
}


function printLevel() {
	level = dungeon.rooms[dungeon.roomY][dungeon.roomX];
	
	tiles = level.width * level.height;

	if (dungeon.inBossRoom) {
		rectangle(0, 0, level.width * level.tileSize, level.height * level.tileSize, "#803949");
	}
	else {
		rectangle(0, 0, level.width * level.tileSize, level.height * level.tileSize, "#7d848a");
	}
	
	
	for (i = 0; i < tiles; i++) {
		tile_x = i % level.width * level.tileSize;
		tile_y = floor(i / level.width) * level.tileSize;

		//Tiles
		if (level.map[i] >= 1 && level.map[i] <= 15) {
			picture(tile_x, tile_y, "assets/misc/brick.png");
		}

		//Platforms
		if (level.map[i] >= 16 && level.map[i] <= 31) {
			imgIndex_x = level.map[i] % 4;
			imgIndex_y = floor((level.map[i] - 16) / 4);
			imgID = "assets/platforms/" + imgIndex_y + imgIndex_x + ".png";
			picture(tile_x, tile_y, imgID);
		}

		//Spikes
		if (level.map[i] >= 32 && level.map[i] <= 35) {
			picture(tile_x, tile_y, "assets/spikes/" + level.map[i] % 4 + ".png");
		}
		
		//Gates & Buttons
		if (level.map[i] >= 36 && level.map[i] <= 59) {
			picture(tile_x, tile_y, "assets/gates/" + floor((level.map[i] - 36) / 8) + "" + ((level.map[i] - 4) % 8) % 6 + ".png");
		}
		if (abs(level.map[i]) >= 60 && abs(level.map[i]) <= 71) {
			imgName = "assets/buttons/" + floor((abs(level.map[i]) - 60) / 4) + "" + abs(level.map[i]) % 4;
			picture(tile_x, tile_y, imgName + "1.png");
			if (level.map[i] > 0) {
				picture(tile_x, tile_y, imgName + "0.png");
			}
		}

		//Big gate
		if (abs(level.map[i]) >= 72 && abs(level.map[i]) <= 81) {
			value = level.map[i];
			imgName = "assets/mainGates/" + (value < 0 ? "1" : "0");

			value = abs(value) - 72;

			if (value--%5 == 0) {
				picture(tile_x, tile_y, "assets/gates/00.png");
			}
			else {
				imgName += floor(value/2);
				imgName += value%2;
				picture(tile_x, tile_y, imgName + ".png");
			}
		}

		//room transitions
		if (level.map[i] >= 84 && level.map[i] <= 87) {
			if (level.enemyCount == 0 && !level.completed) {
				level.map[i]+=4;
			}
			else {
				picture(tile_x, tile_y, "assets/misc/brick.png");
			}
		}
		
		if (level.map[i] >= 88 && level.map[i] <= 91) {
			picture(tile_x, tile_y, "assets/roomTransitions/" + level.map[i]%4 + ".png");
		}

		//items
		if (level.map[i] >= 92 && level.map[i] <= 93) {
			picture(tile_x, tile_y, "assets/misc/item" + level.map[i]%2 + ".png");
		}
		
		//Misc
		if (level.map[i] == 96) {
			picture(tile_x, tile_y, "assets/misc/chain.png");
		}
		if (level.map[i] == 97) {
			picture(tile_x, tile_y, "assets/misc/gem.png");
		}
		if (level.map[i] == 98) {
			picture(tile_x, tile_y, "assets/misc/coin.png");
		}
		if (level.map[i] == 99) {
			picture(tile_x, tile_y, "assets/misc/door0.png");
			if (level.coinCount / level.totalCoins >= 1 || level.totalCoins == 0) {
				picture(tile_x, tile_y, "assets/misc/door1.png");
			}
		}
	}
	if (level.enemyCount == 0 && !level.completed) {
		level.completed = true;
	}
	
	
	text(0, -16, 24, "Coins: " + player.coinCount, "#000");
}


//button rooms
rbr = [];
rbr.push(new level());
rbr[0].width    =  5;
rbr[0].height   =  7;
rbr[0].tileSize = 64;
rbr[0].map.push( 3, 3, 3, 3, 3,
					 		   2,94,13,94, 4,
					 		   2, 0,62, 0, 4,
								 2, 0, 0, 0, 4,
								 2, 0, 0, 0, 4,
								 2, 0, 0, 0, 4,
					 		   1,86,86,86, 1);


rbg = [];
rbg.push(new level());
rbg[0].width    = 16;
rbg[0].height   = 12;
rbg[0].tileSize = 64;
rbg[0].map.push( 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
					 		   2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
					 		   2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0,64, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
					 		   1, 1, 1, 1, 1, 1,12,86,86,14, 1, 1, 1, 1, 1, 1);

rbb = [];
rbb.push(new level());
rbb[0].width    = 16;
rbb[0].height   = 12;
rbb[0].tileSize = 64;
rbb[0].map.push( 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
					 		   2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
					 		   2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,13,
								 2, 0, 0, 0, 0, 0, 0,68, 0, 0, 0, 0, 0, 0, 0,85,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,85,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,11,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
					 		   1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);

//main rooms


rm0 = [];
rm0.push(new level());
rm0[0].width    = 16;
rm0[0].height   = 12;
rm0[0].tileSize = 64;
rm0[0].map.push( 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
					 		   2,98,96, 0, 0, 0, 0, 0, 0, 0, 0,94, 0,96,98, 4,
					 		   2,35,15,33, 0, 0, 0, 0, 0, 0, 0, 0,35,15,33, 4,
								 2, 0,96, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,96, 0, 4,
								13, 0,96, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,96, 0,13,
								87, 0,96, 0, 0, 0, 0, 5, 6, 0, 0, 0, 0,96, 0,85,
								87, 0,96, 0, 0, 0, 0, 8, 7, 0, 0, 0, 0,96, 0,85,
								11, 0,96, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,96, 0,11,
								 2, 0,96, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,96, 0, 4,
								 2,35,15,33, 0, 0, 0, 0, 0, 0, 0, 0,35,15,33, 4,
								 2,98,96, 0, 0, 0, 0, 0, 0, 0, 0,94, 0,96,98, 4,
					 		   1, 1, 1, 1, 1, 1,12,86,86,14, 1, 1, 1, 1, 1, 1);

rm1 = [];
rm1.push(new level());
rm1[0].width    = 16;
rm1[0].height   = 12;
rm1[0].tileSize = 64;
rm1[0].map.push( 3, 3, 3, 3, 3, 3,12,84,84,14, 3, 3, 3, 3, 3, 3,
					 		   2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
					 		   2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								87, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								87, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
					 		   1, 1, 1, 1, 1, 1,12,86,86,14, 1, 1, 1, 1, 1, 1);

rm2 = [];
rm2.push(new level());
rm2[0].width    = 16;
rm2[0].height   = 12;
rm2[0].tileSize = 64;
rm2[0].map.push( 3, 3, 3, 3, 3, 3,12,84,84,14, 3, 3, 3, 3, 3, 3,
					 		   2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
					 		   2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,13,
								87, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,85,
								87, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,85,
								11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,11,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
					 		   1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);


rm30 = [];
rm30.push(new level());
rm30[0].width    = 16;
rm30[0].height   = 12;
rm30[0].tileSize = 64;
rm30[0].map.push( 3, 3, 3, 3, 3, 3,12,84,84,14, 3, 3, 3, 3, 3, 3,
					 		    2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
					 		    2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								  2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								  2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,13,
								  2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,85,
								  2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,85,
								  2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,11,
								  2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								  2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								  2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
					 		    1, 1, 1, 1, 1, 1,12,86,86,14, 1, 1, 1, 1, 1, 1);

rm31 = [];
rm31.push(new level());
rm31[0].width    = 16;
rm31[0].height   = 12;
rm31[0].tileSize = 64;
rm31[0].map.push( 3, 3, 3, 3, 3, 3,12,84,84,14, 3, 3, 3, 3, 3, 3,
					 		    2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
					 		    2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								  2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								  2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,13,
								  2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,85,
								  2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,85,
								  2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,11,
								  2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								  2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								  2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
					 		    1, 1, 1, 1, 1, 1,12,86,86,14, 1, 1, 1, 1, 1, 1);


rm4 = [];
rm4.push(new level());
rm4[0].width    = 16;
rm4[0].height   = 12;
rm4[0].tileSize = 64;
rm4[0].map.push( 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
					 		   2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
					 		   2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,13,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,85,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,85,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,11,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
					 		   1, 1, 1, 1, 1, 1,12,86,86,14, 1, 1, 1, 1, 1, 1);

rm5 = [];
rm5.push(new level());
rm5[0].width    = 16;
rm5[0].height   = 12;
rm5[0].tileSize = 64;
rm5[0].map.push( 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
					 		   2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
					 		   2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								87, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								87, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
					 		   1, 1, 1, 1, 1, 1,12,86,86,14, 1, 1, 1, 1, 1, 1);


rm60 = [];
rm60.push(new level());
rm60[0].width    = 16;
rm60[0].height   = 12;
rm60[0].tileSize = 64;
rm60[0].map.push( 3, 3, 3, 3, 3, 3,12,84,84,14, 3, 3, 3, 3, 3, 3,
					 		    2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
					 		    2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								  2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 87, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 87, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 11, 0, 0, 0, 0, 0, 0, 0,98, 0, 0, 0, 0, 0, 0, 4,
								  2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								  2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								  2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
					 		    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);

rm61 = [];
rm61.push(new level());
rm61[0].width    = 16;
rm61[0].height   = 12;
rm61[0].tileSize = 64;
rm61[0].map.push( 3, 3, 3, 3, 3, 3,12,84,84,14, 3, 3, 3, 3, 3, 3,
					 		    2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
					 		    2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								  2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 87, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 87, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 11, 0, 0, 0, 0, 0, 0, 0,98, 0, 0, 0, 0, 0, 0, 4,
								  2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								  2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								  2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
					 		    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);


rm70 = [];
rm70.push(new level());
rm70[0].width    = 16;
rm70[0].height   = 12;
rm70[0].tileSize = 64;
rm70[0].map.push( 3, 3, 3, 3, 3, 3,12,84,84,14, 3, 3, 3, 3, 3, 3,
					 		    2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
					 		    2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								  2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								  2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,13,
								  2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,85,
								  2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,85,
								  2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,11,
								  2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								  2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								  2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
					 		    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);

rm71 = [];
rm71.push(new level());
rm71[0].width    = 16;
rm71[0].height   = 12;
rm71[0].tileSize = 64;
rm71[0].map.push( 3, 3, 3, 3, 3, 3,12,84,84,14, 3, 3, 3, 3, 3, 3,
					 		    2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
					 		    2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								  2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								  2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,13,
								  2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,85,
								  2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,85,
								  2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,11,
								  2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								  2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								  2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
					 		    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);


rm8 = [];
rm8.push(new level());
rm8[0].width    = 16;
rm8[0].height   = 12;
rm8[0].tileSize = 64;
rm8[0].map.push( 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
					 		   2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
					 		   2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,13,
								87, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,85,
								87, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,85,
								11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,11,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
					 		   1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);

rm9 = [];
rm9.push(new level());
rm9[0].width    = 16;
rm9[0].height   = 12;
rm9[0].tileSize = 64;
rm9[0].map.push( 3, 3, 3, 3, 3, 3,12,84,84,14, 3, 3, 3, 3, 3, 3,
					 		   2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
					 		   2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
					 		   1, 1, 1, 1, 1, 1,12,86,86,14, 1, 1, 1, 1, 1, 1);



//pre-item rooms
rir = [];
rir.push(new level());
rir[0].width    = 16;
rir[0].height   = 12;
rir[0].tileSize = 64;
rir[0].map.push( 3, 3, 3, 3, 3, 3, 2,84,84, 4, 3, 3, 3, 3, 3, 3,
					 		   2, 0, 0 ,0 ,0,35,13,38,39,13,33, 0, 0, 0, 0, 4,
					 		   2, 0,94, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,13,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,85,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,85,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,11,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0,32, 0, 0, 0, 0, 4,
					 		   1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);

rig = [];

rib = [];
rib.push(new level());
rib[0].width    = 16;
rib[0].height   = 12;
rib[0].tileSize = 64;
rib[0].map.push( 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
					 		   2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
					 		   2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,32, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,14, 3,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,56,85,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,57,85,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,14, 1,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,34, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
					 		   1, 1, 1, 1, 1, 1,12,86,86,14, 1, 1, 1, 1, 1, 1);



//item rooms
ri0 = [];
ri0.push(new level());
ri0[0].width    =  5;
ri0[0].height   =  7;
ri0[0].tileSize = 64;
ri0[0].map.push( 3, 3, 3, 3, 3,
					 		   2, 0, 0, 0, 4,
					 		   2, 0,92, 0, 4,
								 2, 0, 0, 0, 4,
								 2, 0, 0, 0, 4,
								 2, 0, 0, 0, 4,
					 		   1,86,86,86, 1);
ri0.push(new level());
ri0[1].width    =  7;
ri0[1].height   =  5;
ri0[1].tileSize = 64;
ri0[1].map.push( 3, 3, 3, 3, 3, 3, 3,
					 		  87, 0, 0, 0, 0, 0, 4,
					 		  87, 0, 0, 0,92, 0, 4,
								87, 0, 0, 0, 0, 0, 4,
					 		   1, 1, 1, 1, 1, 1, 1);

ri1 = [];
ri1.push(new level());
ri1[0].width    =  5;
ri1[0].height   =  7;
ri1[0].tileSize = 64;
ri1[0].map.push( 3, 3, 3, 3, 3,
					 		   2, 0, 0, 0, 4,
					 		   2, 0,93, 0, 4,
								 2, 0, 0, 0, 4,
								 2, 0, 0, 0, 4,
								 2, 0, 0, 0, 4,
					 		   1,86,86,86, 1);
ri1.push(new level());
ri1[1].width    =  7;
ri1[1].height   =  5;
ri1[1].tileSize = 64;
ri1[1].map.push( 3, 3, 3, 3, 3, 3, 3,
					 		  87, 0, 0, 0, 0, 0, 4,
					 		  87, 0, 0, 0,93, 0, 4,
								87, 0, 0, 0, 0, 0, 4,
					 		   1, 1, 1, 1, 1, 1, 1);

//pre-boss rooms
rbp = [];
rbp.push(new level());
rbp[0].width    = 16;
rbp[0].height   = 12;
rbp[0].tileSize = 64;
rbp[0].map.push( 3, 3, 3, 3, 3, 3,84,84,84,84, 3, 3, 3, 3, 3, 3,
					 		   2, 0, 0, 0, 0,10,72,73,74,72,10, 0, 0, 0, 0, 4,
					 		   2, 0, 0, 0, 0,13,72,75,76,72,13, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								87, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								87, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								11, 0, 0, 0, 0, 0, 0, 0,98, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
					 		   1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);


//starting rooms
rst = [];
rst.push(new level());
rst[0].width    = 16;
rst[0].height   = 12;
rst[0].tileSize = 64;
rst[0].map.push( 3, 3, 3, 3, 3, 3,12,84,84,14, 3, 3, 3, 3, 3, 3,
					 		   2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
					 		   2,92,92,92, 0, 0, 0, 0, 0, 0, 0, 0,93,93,93, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
								13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,13,
								87, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,85,
								87, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,85,
								11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,15, 0, 0,11,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,96, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,96, 0, 0, 4,
								 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,96, 0, 0, 4,
					 		   1, 1, 1, 1, 1, 1,12,86,86,14, 1, 1, 1, 1, 1, 1);



//boss room
bossRoom = new level();
bossRoom.width = 22;
bossRoom.height = 14;
bossRoom.tileSize = 64;
bossRoom.map.push( 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
									 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
									 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
									 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
									 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
									 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
									 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
									 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
									 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
									 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
									 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
									 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
									 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
									 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);


//Dungeon
dungeon = new dungeon();
//generator
/**/
itemNum = Math.floor(Math.random()*2);
//switch (Math.floor(Math.random()*3)) {
	//case 0: {
		dungeon.bossRoomX = 4;
		dungeon.bossRoomY = 3;

		dungeon.rooms[0][0] = (itemNum == 0 ? ri0[0] : ri1[0]);
		dungeon.rooms[0][1] =   rbr[0];
		dungeon.rooms[0][4] =   rbg[0];
		
		dungeon.rooms[1][0] =   rir[0];
		dungeon.rooms[1][1] =   rm1[0];
		dungeon.rooms[1][2] =   rib[0];
		dungeon.rooms[1][3] = (itemNum == 1 ? ri0[1] : ri1[1]);
		dungeon.rooms[1][4] =   rm9[0];

		dungeon.rooms[2][1] =  rm70[0];
		dungeon.rooms[2][2] =   rst[0];
		dungeon.rooms[2][3] =   rm0[0];
		dungeon.rooms[2][4] =  rm60[0];

		dungeon.rooms[3][1] =   rbb[0];
		dungeon.rooms[3][2] =  rm61[0];
		dungeon.rooms[3][3] =   rm9[0];
		dungeon.rooms[3][4] = bossRoom;

		dungeon.rooms[4][3] =  rm71[0];
		dungeon.rooms[4][4] =   rbp[0];

/*
		break;
	}

	case 1: {



		break;
	}

	case 2: {

		

		break;
	}
		
}
*/






/*
Bricks: 			 1-15
Platforms: 		16-31
Spikes: 			32-35
Gates:				36-59
Buttons: 			60-71
Big gate:   	72-81

72 73 74
   75 76

   77
78 79
80 81

Fake walls:   84-87
Room changes: 88-91 

Misc:					88-99
*/