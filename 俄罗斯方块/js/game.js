/**
 * Game:类
 * init：初始化，包括初始化棋盘，和格子的状态值
 * createGrap：生成图形
 * autoMoveDown：自动下落
 * changeShape：改变形状
 * moveLeft、moveRight、moveDown：移动
 * pause：暂停游戏
 * canMoveRight、canMoveLeft、canMoveDown：判断能否移动
 * endAction：停止动作
 *
 * 
 */
var Game = function(){

	this.init()
	s.updateScore(g.curScore)
	this.createGrap(1,7);
	this.autoMoveDown()
}
Game.prototype = {
	// 初始化
	init:function(){
		
		// 初始化棋盘样式
		$('.ceilItem').remove();
		for(var i = 0 ; i < 20 ; i ++ ){
			for(var j = 0 ; j < 15 ; j ++){
				$('#playBox').append('<span class="ceilItem" id="number-ceil-'+ i +'-'+ j +'"></span>');
				var theNumberCell = $('#number-ceil-'+ i +'-' + j);

				theNumberCell.css('width' , '40px');
				theNumberCell.css('height' , '40px');
				theNumberCell.css('top' , s.getPosTop(i,j));
				theNumberCell.css('left' , s.getPosLeft(i,j));
			}
		}
		// 初始化棋盘的数组值，0值为无状态，1为活动中的方块，2为已固定的方块。
		for(var i = 0 ; i < 20 ; i ++ ){
			g.ceilValue[i] = [];
			for(var j = 0 ; j < 15 ; j ++){
				g.ceilValue[i][j] = 0;
			}
		}
	},
	
	// 生成图形
	createGrap:function(u,v){
		if( !s.isGameOver() ) return ;
		// 随机生成图形
		var randShape = g.shapeArray[Math.floor( Math.random()*7 )];

		// 赋值给当前组
		g.curShape['shape'] = randShape;
		// 图形的中心的位置
		g.curShape['Cpoint'] = [u,v];
		// 图形单其他点位置
		g.curShape['point'] = g.grapArray[0][g.curShape['shape']][0];

		// 生成图形的随机形态  并 绘制图形
		var randGrap = Math.ceil( Math.random()*3 );
		for(var i = 1 ; i <= randGrap ; i ++ ){
			this.changeShape();
		}
	},
	autoMoveDown:function(){
		var self = this
		g.timer = setInterval(function(){
			self.moveDown()
		},800);
	},
	changeShape:function(){
		// 通过数学方法点的旋转来改变图形形态
	 	// 获取新点	
		s.getNewPoint(g.curShape); 
		// 绘制中心点
		s.drawShape( g.curShape )
	},
	moveLeft:function(){
		if( !this.canMoveLeft() ) return false;
		g.curShape['Cpoint'][1] --;
		s.drawShape();
	},
	moveRight:function(){
		if( !this.canMoveRight() ) return false;
		g.curShape['Cpoint'][1] ++;
		s.drawShape();
	},
	
	moveDown:function(){
		var self = this
		if( !s.isGameOver() ) return false;
		if( !self.canMoveDown() ) return false;
		g.curShape['Cpoint'][0] ++;
		s.drawShape();
	},
	pause:function(){
		if(!g.pauseBool){
			$('.mask').show();
			$('#pause').text('继续')
			clearInterval(g.timer);
		}else{
			$('#pause').text('暂停')
			$('.mask').hide();
			this.autoMoveDown()
		}
		g.pauseBool = !g.pauseBool;
	},
	canMoveLeft:function(){
		var maxX = s.getBorder()[0]['maxX'],
			minX = s.getBorder()[0]['minX'],
			maxY = s.getBorder()[0]['maxY'],
			minY = s.getBorder()[0]['minY'];

		for(var i = minY ; i <= maxY ; i++ ){
			for(var j = minX ; j <= maxX ; j++){
				// 触及边框，返回false
				if( j == 0 ){
					return false;
				}
				// 找出边框线并判断障碍
				if( g.ceilValue[i][j] == 1 && g.ceilValue[i][j-1] == 2){
					return false;
				}
			}
			
		}
		return true;
	},
	canMoveRight:function(){
		var maxX = s.getBorder()[0]['maxX'],
			minX = s.getBorder()[0]['minX'],
			maxY = s.getBorder()[0]['maxY'],
			minY = s.getBorder()[0]['minY'];
		
		for(var i = minY ; i <= maxY ; i++ ){
			for(var j = minX ; j <= maxX ; j++){
				// 触及边框，返回false
				if( j == 14 ){
					return false;
				}
				// 找出边框线并判断障碍
				if( g.ceilValue[i][j] == 1 && g.ceilValue[i][j+1] == 2){
					return false;
				}
			}
			
		}
		return true;
	},
	canMoveDown:function(){
		var maxX = s.getBorder()[0]['maxX'],
			minX = s.getBorder()[0]['minX'],
			maxY = s.getBorder()[0]['maxY'],
			minY = s.getBorder()[0]['minY'];
		for(var i = minY ; i <= maxY ; i++ ){
			for(var j = minX ; j <= maxX ; j++){
				if(i == 19){
					this.endAction()
					return false;
				}
				if( g.ceilValue[i][j] == 1 && g.ceilValue[i+1][j] ==2 ){
					// 触及边框，返回false
					this.endAction()
					return false;
				}
			}
			
		}
		return true;
	},
	endAction:function(){
		for(var i = 0 ; i < 20 ; i ++ ){
			for(var j = 0 ; j < 15 ; j ++){
				if( g.ceilValue[i][j] == 1 ){
					g.ceilValue[i][j] = 2;
				}
			}
		}
		s.score(g.ceilValue);
		this.createGrap(1,7);
	},
}
