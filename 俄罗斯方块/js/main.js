var startx = srarty = endx = endy = 0,
		ua = window.navigator.userAgent.toLowerCase(), 
	    isAndroid = /android/i.test(ua), 
	    isIOS = /iphone|ipad|ipod/i.test(ua) ;
    
$(function(){
	// 获取UA
	// 判断是否手机版
	if(isAndroid || isIOS){
		$('body').addClass('mobile');
	}

	// 新开始一个游戏
	var newGame = new Game()

	// pc端操作
	$(document).keydown( function( event ){
		switch (event.keyCode){
			case 37: //left
				event.preventDefault();
				newGame.moveLeft();
				break;
			case 38: //up
				event.preventDefault();
				newGame.changeShape();
				break;
			case 39: //right
				event.preventDefault();
				newGame.moveRight();
				break;
			case 40: //down
				event.preventDefault();
				newGame.moveDown();
				break;
			case 32: //暂停
				event.preventDefault();
				newGame.pause()
				break;
			default : 
				break;
		}
	})

	document.addEventListener('touchstart' , function(event){
		startx = event.touches[0].pageX;
		starty = event.touches[0].pageY;
	})

	// 这个bug会影响移动端
	document.addEventListener('touchmove' , function(event){
		event.preventDefault();
	})

	// 移动端操作
	document.addEventListener('touchend' , function(event){
		endx = event.changedTouches[0].pageX;
		endy = event.changedTouches[0].pageY;

		var deltax = endx - startx;
		var deltay = endy - starty;

		if( Math.abs(deltax) < 0.1* g.documentWidth && Math.abs(deltay) < 0.1* g.documentWidth){
			event.preventDefault();
			// 重新开始
			if( event.target.id == 'newGame'){
				// 重置定时器
				clearInterval(g.timer);
				newGame = new Game()
			}
			// 暂停/开始
			if( event.target.id == 'pause'){
				newGame.pause();
			}
			return ;
		}
		// 判断移动端的动作
		if( Math.abs(deltax) >= Math.abs(deltay) ){
			//动作在x轴上进行
			if( deltax > 0 ){
				// 向右
				event.preventDefault();
				newGame.moveRight();
			}else{
				// 向左
				event.preventDefault();
				newGame.moveLeft();
			}
		}else{
			if( deltay > 0 ){
				// 向下
				event.preventDefault();
				newGame.moveDown()
			}else{
				// 向上
				event.preventDefault();
				newGame.changeShape();
			}
		}

	})
	
})

















