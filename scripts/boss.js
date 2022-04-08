function boss() {
	this.type = "boss";
	
	this.alive = false;
	this.x;
	this.old_x;
	this.y;
	this.old_y;
	this.vx = 0;
	this.vy = 0;
	this.size = 128;

	this.attackSpeed = 30;
	this.lastAttack = 0;

	this.maxhp = 20;
	this.hp = 20;
}



function updateBoss() {
	if (boss.hp == 0) {
		boss.alive = false;
	}
	
	if (boss.alive) {	
		boss.old_x = boss.x;
		boss.old_y = boss.y;
	
		boss.x += boss.vx;
		boss.y += boss.vy;

		boss.lastAttack = (boss.lastAttack+1) % boss.attackSpeed;
		if (boss.lastAttack == 0) {
			theta = (Math.random()*Math.PI*2);
			n = 10;
			spd = 8;
			for (i = 0; i < n; i++) {
				bossBullets.push(new bossBullet());
				index = bossBullets.length-1;
				b = bossBullets[index];
				b.arrayIndex = index;
				b.x = b.old_x = boss.x + 56;
				b.y = b.old_y = boss.y + 56;
				
				phi = theta + (2*Math.PI/n) * i;
				b.vx = Math.cos(phi) * spd;
				b.vy = Math.sin(phi) * spd;
			}
			
		}

		collisionCheck(boss);

		e = boss;
		if (e.alive) {
			if (p.x+p.size >= e.x && e.x+e.size >= p.x && p.y+p.size >= e.y && e.y+e.size >= p.y && e.alive) {
				p.alive = false;
			}
			for (j = 0; j < playerBullets.length; j++) {
				bp = playerBullets[j];
				p = player;
				if (bp.x+bp.size >= e.x && e.x+e.size >= bp.x && bp.y+bp.size >= e.y && e.y+e.size >= bp.y && e.alive) {
					bp.alive = false;
					e.hp--;
				}
			}
			picture(e.x, e.y, "assets/misc/boss.png");
			
			rectangle(128, (current.height+.2)*64, (current.width-4)*64, 64, "#000");
			rectangle(132, (current.height+.2)*64+4, (current.width-4)*64 - 8, 56, "#F00");
			rectangle(132, (current.height+.2)*64+4, (current.width-4)*64*(boss.hp/boss.maxhp) - 8, 56, "#0F0");
		}
	}
	if (!boss.alive) {
		boss.old_x = boss.x = 0;
		boss.old_y = boss.y = 0;
	}
}




function bossBullet() {
	this.type = "bulletB";
	
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

function updateBossBullets() {
	for (i = 0; i < bossBullets.length; i++) {
		bullet = bossBullets[i];

		if (bullet.alive) {
			bullet.old_x = bullet.x;
			bullet.old_y = bullet.y;
			bullet.x += bullet.vx;
			bullet.y += bullet.vy;
	
			collisionCheck(bullet);

			if (bullet.alive) {
				picture(bullet.x, bullet.y, "assets/misc/boss_bullet.png");
			}
		}
		if (!bullet.alive) {
			index = bullet.arrayIndex;
			for (j = index+1; j < enemyBullets.length; j++) {
				enemyBullets[j].arrayIndex--;
			}
			enemyBullets.splice(index, 1);
		}
	}
}



bossBullets = [];