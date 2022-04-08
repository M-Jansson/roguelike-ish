function player() {
	this.type = "player";
	
	this.alive = true;
	this.x;
	this.old_x;
	this.y;
	this.old_y;
	this.vx = 0;
	this.vy = 0;
	this.size = 32;

	this.speedMul = 1;

	this.attackSpeed = 20;
	this.lastAttack = 0;

	this.coinCount = 69;
	//this.dashing = false;
}

function printPlayer() {
	picture(player.x, player.y, "assets/misc/player.png");
}


function playerBullet() {
	this.type = "bulletP";
	
	this.x;
	this.old_x;
	this.y;
	this.old_y;
	this.vx;
	this.vy;

	this.size = 16;
	this.arrayIndex;
	
	this.alive = true;
}

function updatePlayerBullets() {
	for (i = 0; i < playerBullets.length; i++) {
		bullet = playerBullets[i];

		if (bullet.alive) {
			bullet.old_x = bullet.x;
			bullet.old_y = bullet.y;
			bullet.x += bullet.vx;
			bullet.y += bullet.vy;
	
			collisionCheck(bullet);

			if (bullet.alive) {
				picture(bullet.x, bullet.y, "assets/misc/player_bullet.png");
			}
		}
		if (!bullet.alive && bullet.arrayIndex != -1) {
			index = bullet.arrayIndex;
			for (i = index+1; i < playerBullets.length; i++) {
				playerBullets[i].arrayIndex--;
			}
			playerBullets.splice(index, 1);
		}
	}
}

playerBullets = [];


function movePlayer() {
	function keyUp()    {return keyboard.w ||    keyboard.up;}
	function keyLeft()  {return keyboard.a ||  keyboard.left;}
	function keyDown()  {return keyboard.s ||  keyboard.down;}
	function keyRight() {return keyboard.d || keyboard.right;}

	if (keyLeft()) {
		player.vx = (player.size / (keyUp() || keyDown() ? -4 : -2.8)) * player.speedMul;
	}
	else if (keyRight()) {
		player.vx = (player.size / (keyUp() || keyDown() ? 4 : 2.8)) * player.speedMul;
	}
	else {player.vx = 0;}

	if (keyUp()) {
		player.vy = (player.size / (keyLeft() || keyRight() ? -4 : -2.8)) * player.speedMul;
	}
	else if (keyDown()) {
		player.vy = (player.size / (keyLeft() || keyRight() ? 4 : 2.8)) * player.speedMul;
	}
	else {player.vy = 0;}

	player.old_x = player.x;
	player.old_y = player.y;
	player.x += player.vx;
	player.y += player.vy;

	
	p = player;
	if (!dungeon.inBossRoom) {
		for (i = 0; i < enemyBullets.length; i++) {
			be = enemyBullets[i];
			if (p.x+p.size >= be.x && be.x+be.size >= p.x && p.y+p.size >= be.y && be.y+be.size >= p.y) {
				p.alive = false;
				be.alive = false;
			}
		}
	}
	else {
		for (i = 0; i < bossBullets.length; i++) {
			bb = bossBullets[i];
			if (p.x+p.size >= bb.x && bb.x+bb.size >= p.x && p.y+p.size >= bb.y && bb.y+bb.size >= p.y) {
				p.alive = false;
				bb.alive = false;
			}
		}
	}
	

	
	player.lastAttack = player.lastAttack != 0 ? (player.lastAttack+1) % player.attackSpeed : 0;
	
	if (mouse.left && player.lastAttack == 0) {
		player.lastAttack++;

		playerBullets.push(new playerBullet());
		index = playerBullets.length-1;
		bullet = playerBullets[index];
		bullet.arrayIndex = index;
		bullet.x = bullet.old_x = player.x + 8;
		bullet.y = bullet.old_y = player.y + 8;

		theta = Math.atan2(mouse.y-ty - (player.y+16), mouse.x-tx - (player.x+16));

		bullet.vx = Math.cos(theta) * 12;
		bullet.vy = Math.sin(theta) * 12;
	}
}