function emeny() {
	this.type = "enemy";
	
	this.alive = false;
	this.x = 0;
	this.old_x = 0;
	this.y = 0;
	this.old_y = 0;
	this.v = 6;
	this.size = 32;
	
	this.attackSpeed = 30;
	this.lastAttack = 0;
	
	this.mapIndex;
}

function updateEnemies() {
	for (i = 0; i < current.enemies.length; i++) {
		e = current.enemies[i];
		if (e.alive) {		
			e.old_x = e.x;
			e.old_y = e.y;
		
			theta = Math.atan2(player.y - e.y, player.x - e.x);
			vx = Math.cos(theta) * e.v;
			vy = Math.sin(theta) * e.v;
			e.x += vx;
			e.y += vy;
	
			e.lastAttack = (e.lastAttack+1) % e.attackSpeed;
			if (e.lastAttack == 0) {
				enemyBullets.push(new enemyBullet());
				index = enemyBullets.length-1;
				b = enemyBullets[index];
				b.arrayIndex = index;
				b.x = b.old_x = e.x + 8;
				b.y = b.old_y = e.y + 8;
				b.vx = vx * 1.5;
				b.vy = vy * 1.5;
			}
	
			collisionCheck(e);
	
			if (e.alive) {
				if (p.x+p.size >= e.x && e.x+e.size >= p.x && p.y+p.size >= e.y && e.y+e.size >= p.y && e.alive) {
					p.alive = false;
				}
				for (j = 0; j < playerBullets.length; j++) {
					bp = playerBullets[j];
					p = player;
					if (bp.x+bp.size >= e.x && e.x+e.size >= bp.x && bp.y+bp.size >= e.y && e.y+e.size >= bp.y && e.alive) {
						bp.alive = false;
						e.alive = false;
					}
				}
				picture(e.x, e.y, "assets/misc/enemy.png");
			}
		}
		if (!e.alive) {
			e.old_x = e.x = 0;
			e.old_y = e.y = 0;

			if (current.map[e.mapIndex] > 0) {
				current.map[e.mapIndex] *= -1;
				current.enemyCount--;
			}
		}
	}
}


function enemyBullet() {
	this.type = "bulletE";
	
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

function updateEnemyBullets() {
	for (i = 0; i < enemyBullets.length; i++) {
		bullet = enemyBullets[i];

		if (bullet.alive) {
			bullet.old_x = bullet.x;
			bullet.old_y = bullet.y;
			bullet.x += bullet.vx;
			bullet.y += bullet.vy;
	
			collisionCheck(bullet);

			if (bullet.alive) {
				picture(bullet.x, bullet.y, "assets/misc/enemy_bullet.png");
			}
		}
		if (!bullet.alive && bullet.arrayIndex != -1) {
			index = bullet.arrayIndex;
			for (i = index+1; i < enemyBullets.length; i++) {
				enemyBullets[i].arrayIndex--;
			}
			enemyBullets.splice(index, 1);
		}
	}
}

enemyBullets = [];