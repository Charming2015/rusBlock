/**
 * [g 全局变量]
 * @documentWidth：屏幕可视宽度
 * @'cellSideLength' : 格子边长,
 * @'cellSpace' : 格子间隔
 * @'shapeArray' : 图形名字 ['T','Z','S','I','J','L','O'],
 * @'curShape' : 当前图形
 * @'ceilValue' : 储存每个格子的状态值
 * @'timer':'' 定时器
 * @'pauseBool' : 是否停止
 * @'curScore' : 当前分数
 * @'bestScore' : 最高分
 * @'grapArray':确定了中心点之后，通过在xy轴加减值，可确定图形其他位置的点
 */
var g = {
	'documentWidth': window.screen.availWidth,
	'cellSideLength' : 40,
	'cellSpace' : 4,
	'shapeArray' : ['T','Z','S','I','J','L','O'],
	'curShape' : [],
	'ceilValue' : [],
	'timer':'' ,
	'pauseBool' : false,
	'curScore' : 0,
	'bestScore' : 0,
	'grapArray':[{
		'T': [{
				0: [0, 1],
				1: [0, -1],
				2: [-1, 0]
			}],
		'Z': [{
				0: [0, 1],
				1: [-1, -1],
				2: [-1, 0]
			}],
		'S': [{
				0: [0, -1],
				1: [-1, 0],
				2: [-1, 1]
			}],
		'I': [{
				0: [-1, 0],
				1: [1, 0],
				2: [2, 0]
			}],
		'J': [{
				0: [-1, 0],
				1: [1, 0],
				2: [1, -1]
			}],
		'L': [{
				0: [-1, 0],
				1: [1, 0],
				2: [1, 1]
			}],
		'O': [{
				0: [0, -1],
				1: [-1, 0],
				2: [-1, -1]
			}]					
	}]
}	


/**
 * [s 支撑功能]
 * getPosTop：获取图形的顶部坐标
 * getPosLeft：获取图形的左边坐标
 * getNewPoint：获取新点，变换图形的一部分
 * drawShape：画图
 * changeBgColor：正在掉落的方块，动态改变背景颜色
 * getBorder：获取边框
 * isGameOver：判断是否结束游戏
 * score：计算分数
 * paintColor：涂色
 * updateScore：更新分数，当当前分大于最高分时，最高分和当前分同时变化
 */
var s = {
	getPosTop:function(i,j){
		return g.cellSpace+i*( g.cellSpace + g.cellSideLength );
	},
	getPosLeft:function(i,j){
		return g.cellSpace+j*( g.cellSpace + g.cellSideLength );
	},
	// 通过数学方法变化形状
	getNewPoint:function(){
		var pointArr = g.curShape['point'];
		for( var i = 0 ; i < 3 ; i ++ ){
			var deltaX = pointArr[i][0],
			deltaY = pointArr[i][1], 
			J = deltaX * deltaY;
			if( deltaX == 2 ||  deltaY == 2 ){	
				pointArr[i][0] = deltaY     
				pointArr[i][1] = deltaX
			}else if(deltaX == 0){
				pointArr[i][0] = -deltaY     
				pointArr[i][1] = deltaX
			}else if( Math.abs(J) == 1 ){
				pointArr[i][0] = -J*deltaX 
				pointArr[i][1] = J*deltaY 
			}else if( deltaY == 0 ){
				pointArr[i][0] = deltaY     
				pointArr[i][1] = deltaX
			}
		}
		return g.curShape;
	},
	drawShape:function(){
		// 清除本来样式
		$('.action').removeClass('action');
		for(var i = 0 ; i < 20 ; i ++ ){
			for(var j = 0 ; j < 15 ; j ++){
				if( g.ceilValue[i][j] == 1 ){
					g.ceilValue[i][j] = 0;
				}
			}
		}

		var [u,v] = g.curShape['Cpoint'];
		// 绘制中心点
		s.changeBgColor(u,v);
		// 绘制其他点
		for(var i = 0 ; i < 3 ; i ++ ){
			s.changeBgColor(u + g.curShape['point'][i][0] , v + g.curShape['point'][i][1])
		}
	},
	changeBgColor:function(u,v){
		g.ceilValue[u][v] = 1;
		$('#number-ceil-'+ u +'-' + v ).addClass('action')
	},
	getBorder:function(){
		var maxX = -1;
		var minX = 16;
		var maxY = -1;
		var minY = 16;

		for(var i = 0 ; i < 20 ; i ++ ){
			for(var j = 0 ; j < 15 ; j ++){
				if( g.ceilValue[i][j] == 1 ){
					minX = j > minX ? minX : j;
					maxX = j < maxX ? maxX : j;
					maxY = i < maxY ? maxY : i;
					minY = i > minY ? minY : i;
				}
			}
		}
		return [{'minX':minX,'maxX':maxX,'minY':minY,'maxY':maxY}]
	},
	isGameOver:function(){
		var minY = 16;
		for(var i = 0 ; i < 20 ; i ++ ){
			for(var j = 0 ; j < 15 ; j ++){
				if( g.ceilValue[i][j] == 2 ){
					minY = i > minY ? minY : i;
				}
			}
		}
		if(minY <=1 ){
			clearInterval(g.timer);
			alert('Game Over');
			return false;
		}
		return true;
	},
	// 计算分数
	score:function(){
		var scoreArr = [];
		var times = 0;
		// 统计每行
		for(var i = 0 ; i < 20 ; i ++ ){
			scoreArr[i] = 0;
			for(var j = 0 ; j < 15 ; j ++){
				if( g.ceilValue[i][j] == 2 ){
					scoreArr[i]++;
				}
				
			}
		}
		// 判断得分
		for(var i = 0 ; i < 20 ; i++ ){
			if( scoreArr[i] == 15  ){
				times++;
				for(var k = i ; k > 0 ; k --){
					for(var j = 0 ; j < 15 ; j ++){
						g.ceilValue[k][j] = g.ceilValue[k-1][j] ;
					}
				}
			}
		}

		// 算分,同时消除不同行数有不同的分值
		if(times > 0){
			g.curScore +=  Math.pow(2,times+1)
			s.updateScore(g.curScore);
		}
		// 落地的方块变白
		s.paintColor();
	},
	paintColor:function(){
		for(var i = 0 ; i < 20 ; i ++){
			for(var j = 0 ; j < 15 ; j ++){
				$('#number-ceil-'+ i +'-' + j ).removeClass('action').removeClass('end');
				if(g.ceilValue[i][j] == 2){
					$('#number-ceil-'+ i +'-' + j ).addClass('end');
				}else if(g.ceilValue[i][j] == 1){
					$('#number-ceil-'+ i +'-' + j ).addClass('action');
				}
			}
		}
	},
	updateScore:function( score ){
		$('.recentScore').text( score );
		if( window.localStorage ){
			g.bestScore = localStorage['RusBestScore'] == undefined ? 0 : localStorage['RusBestScore'];
		}else{
			g.bestScore = 1024;
		}
		if( score > g.bestScore ){
			localStorage['RusBestScore'] = score;
			$('.bestScore').text( score )
		}else{
			$('.bestScore').text( g.bestScore )
		}

	}
}
