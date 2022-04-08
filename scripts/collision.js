function collisionCheck(entity) {
	level = dungeon.rooms[dungeon.roomY][dungeon.roomX];
	
	index_x = floor(entity.x / level.tileSize) % level.width;
	index_y = floor(entity.y / level.tileSize);
	index = index_y * level.width + index_x;
	if (level.map[index] != 0 && level.map[index] != 95) {
		collided(entity, level, index_y, index_x);
	}

	index_x = floor((entity.x + entity.size) / level.tileSize) % level.width;
	index_y = floor(entity.y / level.tileSize);
	index = index_y * level.width + index_x;
	if (level.map[index] != 0 && level.map[index] != 95) {
		collided(entity, level, index_y, index_x);
	}

	index_x = floor((entity.x + entity.size) / level.tileSize) % level.width;
	index_y = floor((entity.y + entity.size) / level.tileSize);
	index = index_y * level.width + index_x;
	if (level.map[index] != 0 && level.map[index] != 95) {
		collided(entity, level, index_y, index_x);
	}

	index_x = floor(entity.x / level.tileSize) % level.width;
	index_y = floor((entity.y + entity.size) / level.tileSize);
	index = index_y * level.width + index_x;
	if (level.map[index] != 0 && level.map[index] != 95) {
		collided(entity, level, index_y, index_x);
	}
}


function collided(entity, level, row, column) {
	index = row * level.width + column;
	if (level.map[index] != 0 && level.map[index] != 95) {

		//Platforms
		caseNumber = level.map[index];
		if (caseNumber >= 16 && caseNumber <= 31) {
			caseNumber = floor((caseNumber - 16) / 4) + 1;
		}
		//Gates
		if (caseNumber >=36 && caseNumber <= 59) {
			caseNumber = floor(((caseNumber - 4) % 8) / 4) + 9;
		}
		//Buttons
		if (caseNumber >= 60 && caseNumber <= 71) {
			caseNumber = 60 + caseNumber % 4;
		}
		if (abs(caseNumber) >= 72 && abs(caseNumber) <= 81) {
			caseNumber = floor((abs(caseNumber)-72) / 5) + 9;
		}
		
		//Fake walls
		if (caseNumber >= 84 && caseNumber <= 87) {
			caseNumber = (caseNumber+2) % 4 + 1;
		}

		
		
		switch(caseNumber) {
			//Tiles & Platforms
			case 1: {
				upCollision(entity, row, level);
				break;
			}
			case 2: {
				rightCollision(entity, column, level);
				break;
			}
			case 3: {
				downCollision(entity, row, level);
				break;
			}
			case 4: {
				leftCollision(entity, column, level);
				break;
			}
			case 5: {
				upCollision(entity, row, level);
				leftCollision(entity, column, level);
				break;
			}
			case 6: {
				upCollision(entity, row, level);
				rightCollision(entity, column, level);
				break;
			}
			case 7: {
				rightCollision(entity, column, level);
				downCollision(entity, row, level);
				break;
			}
			case 8: {
				downCollision(entity, row, level);
				leftCollision(entity, column, level);
				break;
			}
			case 9: {
				upCollision(entity, row, level);
				downCollision(entity, row, level);
				break;
			}
			case 10: {
				rightCollision(entity, column, level);
				leftCollision(entity, column, level);
				break;
			}
			case 11: {
				upCollision(entity, row, level);
				rightCollision(entity, column, level);
				leftCollision(entity, column, level);
				break;
			}
			case 12: {
				upCollision(entity, row, level);
				rightCollision(entity, column, level);
				downCollision(entity, row, level);
				break;
			}
			case 13: {
				rightCollision(entity, column, level);
				downCollision(entity, row, level);
				leftCollision(entity, column, level);
				break;
			}
			case 14: {
				upCollision(entity, row, level);
				downCollision(entity, row, level);
				leftCollision(entity, column, level);
				break;
			}
			case 15: {
				upCollision(entity, row, level);
				rightCollision(entity, column, level);
				downCollision(entity, row, level);
				leftCollision(entity, column, level);
				break;
			}

			//Spikes
			case 32: {
				if (entity.y >= entity.old_y) {
					up = (row + .25) * level.tileSize;
					right = (column + .9375) * level.tileSize;
					left = (column + .0625) * level.tileSize;
					if (entity.y + entity.size >= up && entity.x < right && entity.x + entity.size >= left) {
						if (entity != "bulletP" && entity != "bulletE") {
							entity.alive = false;
							entity.vx = 0;
							entity.vy = 0;
						}
					}
				}
				break;
			}
			case 33: {
				if (entity.x <= entity.old_x) {
					up = (row + .0625) * level.tileSize;
					right = (column + .75) * level.tileSize;
					down = (row + .9375) * level.tileSize;
					if (entity.y + entity.size >= up && entity.x < right && entity.y < down) {
						if (entity != "bulletP" && entity != "bulletE") {
							entity.alive = false;
							entity.vx = 0;
							entity.vy = 0;
						}
					}
				}
				break;
			}
			case 34: {
				if (entity.y <= entity.old_y) {
					right = (column + .9375) * level.tileSize;
					down = (row + .75) * level.tileSize;
					left = (column + .0625) * level.tileSize;
					if (entity.x < right && entity.y < down && entity.x + entity.size >= left) {
						if (entity != "bulletP" && entity != "bulletE") {
							entity.alive = false;
							entity.vx = 0;
							entity.vy = 0;
						}
					}
				}
				break;
			}
			case 35: {
				if (entity.x >= entity.old_x) {
					up = (row + .0625) * level.tileSize;
					down = (row + .9375) * level.tileSize;
					left = (column + .25) * level.tileSize;
					if (entity.y + entity.size >= up && entity.y < down && entity.x + entity.size >= left) {
						if (entity.type != "bulletP" && entity.type != "bulletE") {
							entity.alive = false;
							entity.vx = 0;
							entity.vy = 0;
						}
					}
				}
				break;
			}

			//Buttons
			case 60: {
				up = (row + .75) * level.tileSize;
				if (entity.y + entity.size >= up && up > entity.old_y + entity.size) {
					dungeon.buttons[floor((level.map[index]-60)/4)] = true;
					level.map[index] *= -1;
				}
				break;
			}
			case 61: {
				right = (column + .25) * level.tileSize;
				if (entity.x < right && right <= entity.old_x) {
					dungeon.buttons[floor((level.map[index]-60)/4)] = true;
					level.map[index] *= -1;
				}
				break;
			}
			case 62: {
				down = (row + .25) * level.tileSize;
				if (entity.y < down && down <= entity.old_y) {
					dungeon.buttons[floor((level.map[index]-60)/4)] = true;
					level.map[index] *= -1;
				}
				break;
			}
			case 63: {
				left = (column + .75) * level.tileSize;	
				if (entity.x + entity.size >= left && left > entity.old_x + entity.size) {
					dungeon.buttons[floor((level.map[index]-60)/4)] = true;
					level.map[index] *= -1;
				}
				break;
			}

			//room borders
			case 88: {
				down = (row + .5) * level.tileSize;
				if (entity.y < down && down <= entity.old_x) {
					if (entity.type == "bulletP" || entity.type == "bulletE") {
						entity.alive = false;
					}
					if (entity.type == "player") {
						restartLevel(1, -1);
					}
				}
				break;
			}
			case 89: {
				left = (column + .5) * level.tileSize;	
				if (entity.x + entity.size >= left && left > entity.old_x + entity.size) {
					if (entity.type == "bulletP" || entity.type == "bulletE") {
						entity.alive = false;
					}
					if (entity.type == "player") {
						restartLevel(2, 1);
					}
				}
				break;
			}
			case 90: {
				up = (row + .5) * level.tileSize;
				if (entity.y + entity.size >= up && up > entity.old_y + entity.size) {
					if (entity.type == "bulletP" || entity.type == "bulletE") {
						entity.alive = false;
					}
					if (entity.type == "player") {
						restartLevel(3, 1);
					}
				}
				break;
			}
			case 91: {
				right = (column + .5) * level.tileSize;
				if (entity.x < right && right <= entity.old_x) {
					if (entity.type == "bulletP" || entity.type == "bulletE") {
						entity.alive = false;
					}
					if (entity.type == "player") {
						restartLevel(4, -1);
					}
				}
				break;
			}

			//items
			case 92: {
				if (entity.type == "player") {
					e = entity;
					l = column * level.tileSize;
					r = (column + 1) * level.tileSize;
					u = row * level.tileSize;
					d = (row + 1) * level.tileSize;

					if (e.x+e.size >= l && e.x < r && e.y+e.size >= u && e.y < d) {
						level.map[index] *= -1;
						e.speedMul *= 1.3;
					}
				}
				break;
			}

			case 93: {
				if (entity.type == "player") {
					e = entity;
					l = column * level.tileSize;
					r = (column + 1) * level.tileSize;
					u = row * level.tileSize;
					d = (row + 1) * level.tileSize;

					if (e.x+e.size >= l && e.x < r && e.y+e.size >= u && e.y < d) {
						level.map[index] *= -1;
						e.attackSpeed = ceil(e.attackSpeed * .7);
					}
				}


				break;
			}
				
			//Misc
			case 97: {
				mid_x = entity.x + entity.size / 2;
				mid_y = entity.y + entity.size / 2;
				index = floor(mid_y / level.tileSize) * level.width + floor(mid_x / level.tileSize);
				if (level.map[index] == 97) {
					level.map[index] *= -1;
				}
				break;
			}
			case 98: {
				mid_x = entity.x + entity.size / 2;
				mid_y = entity.y + entity.size / 2;
				index = floor(mid_y / level.tileSize) * level.width + floor(mid_x / level.tileSize);
				if (level.map[index] == 98 && entity.type == "player") {
					level.map[index] *= -1;
					entity.coinCount++;
				}
				break;
			}
			case 99: {
				if (level.coinCount / level.totalCoins >= 1 || level.totalCoins == 0) {
					level.completed = true;
				}
				break;
			}
			
			default: {
				break;
			}
		}
	}
}



//Directional collision functions
function upCollision(entity, row, level) {
	up = row * level.tileSize;

	if (entity.y + entity.size >= up && up > entity.old_y + entity.size) {
		if (entity.type == "bulletP" || entity.type == "bulletE" || entity.type == "bulletB") {
			entity.alive = false;
		}
		
		entity.y = up - entity.size - .001;
		entity.old_y = entity.y;
		if (entity.type != "boss") {
			entity.vy = 0;
		}
		else {
			entity.vy *= -1;
		}
	}
}
function rightCollision(entity, column, level) {
	right = (column + 1) * level.tileSize;

	if (entity.x < right && right <= entity.old_x) {
		if (entity.type == "bulletP" || entity.type == "bulletE" || entity.type == "bulletB") {
			entity.alive = false;
		}
		
		entity.x = right;
		entity.old_x = entity.x;
		if (entity.type != "boss") {
			entity.vx = 0;
		}
		else {
			entity.vx *= -1;
		}
	}
}
function downCollision(entity, row, level) {
	down = (row + 1) * level.tileSize;

	if (entity.y < down && down <= entity.old_y) {
		if (entity.type == "bulletP" || entity.type == "bulletE" || entity.type == "bulletB") {
			entity.alive = false;
		}
		
		entity.y = down;
		entity.old_y = entity.y;
		if (entity.type != "boss") {
			entity.vy = 0;
		}
		else {
			entity.vy *= -1;
		}
	}
}
function leftCollision(entity, column, level) {
	left = column * level.tileSize;	

	if (entity.x + entity.size >= left && left > entity.old_x + entity.size) {
		if (entity.type == "bulletP" || entity.type == "bulletE" || entity.type == "bulletB") {
			entity.alive = false;
		}
		
		entity.x = left - entity.size - .001;
		entity.old_x = entity.x;
		if (entity.type != "boss") {
			entity.vx = 0;
		}
		else {
			entity.vx *= -1;
		}
	}
}