window.onload=function(){
	var list=document.getElementById('list');
	var boxs=list.children;
	var timer;

	//删除分享
	function removeNode(node){
		node.parentNode.removeChild(node);

	}

	//赞功能的实现
	function praiseBox(box,el){
		var txt=el.innerHTML;
		var praiseElement=box.getElementsByClassName('praises-total')[0];
		var oldTotal=parseInt(praiseElement.getAttribute('total'));
		var newTotal;
		if(txt=='赞'){
			newTotal = oldTotal+1;
			praiseElement.setAttribute("total",newTotal);
			praiseElement.innerHTML=(newTotal==1) ? "我觉得很赞" :"我和"+oldTotal+"个人觉得很赞";
			el.innerHTML="取消赞";
			
		}
		else{
			newTotal=oldTotal-1;
			praiseElement.setAttribute("total",newTotal);
			praiseElement.innerHTML=(newTotal==0)?'':newTotal+"个人觉得很赞";
			el.innerHTML="赞";
		}
		praiseElement.style.display=(newTotal==0)? 'none':"block";	
	}

	//发表评论功能
	function reply(box,el){
		var text=box.getElementsByTagName("textarea")[0];
		var commentList=box.getElementsByClassName("comment-list")[0];
		//var textarea = box.getElementsByClassName('comment')[0];
		var commentBox=document.createElement("div");
		commentBox.className="comment-box clearfix";
		commentBox.setAttribute("user","self");
		var html='<img class="myhead" src="img/my.jpg" alt=""/>'+
                 '<div class="comment-content">'+
                 '<p class="comment-text"><span class="user">我：</span>'+text.value+'</p>'+
                 '<p class="comment-time">'+
                 formateDate()+
                 '<a href="javascript:;" class="comment-praise" total="0" my="0" style=""> 赞</a>'+
                 '<a href="javascript:;" class="comment-operate">删除</a>'+
                 '</p>'+
                 '</div>';
                 
        commentBox.innerHTML=html;
        //commentList.appendChild(commentBox);
        commentList.appendChild(commentBox);
        text.value="";
        text.onblur();

	}

	//格式化日期
	function formateDate(){
		var date=new Date();
		var y=date.getFullYear();
		var m=date.getMonth()+1;
		var d=date.getDate();
		var h=date.getHours();
		var mi=date.getMinutes();
		m=(m<10) ? "0"+m : m;
		d=(d<10) ? "0"+d : d;
		h=(h<10) ? "0"+h : h;
		mi=(mi<10) ? "0"+mi : mi;
		return y+"-"+m+"-"+d+" "+h+":"+mi;

	}

	//赞回复
	function praiseReply(el){
		var oldTotal=parseInt(el.getAttribute("total"));
		var myPraise=parseInt(el.getAttribute("my"));
		var newTotal;
		if(myPraise==0){
			newTotal=oldTotal+1;
			el.setAttribute("total",newTotal);
			el.setAttribute("my",1);
			el.innerHTML=newTotal+' 取消赞';
		}
		else{
			newTotal=oldTotal-1;
			el.setAttribute("total",newTotal);
			el.setAttribute("my",0);
			el.innerHTML=(newTotal==0)?"赞":newTotal+' 赞';
		}
		el.style.display=(newTotal==0)?'':'inline-block';
	}

	//评论中的回复和删除
	function operate(el){
		var commentBox1=el.parentNode.parentNode.parentNode;
		var box=commentBox1.parentNode.parentNode.parentNode;
		var txt=el.innerHTML;
		var textarea=box.getElementsByTagName("textarea")[0];
		//var textarea = box.getElementsByClassName('comment')[0];
		var user=commentBox1.getElementsByClassName("user")[0].innerHTML;
		if(txt=="回复"){
			textarea.onfocus();
			textarea.value="回复"+ user;
			textarea.onkeyup();
		}
		else{
			removeNode(commentBox1);
		}
	}
	

    //把事件代理到每条分享div容器
	for(var i=0;i<boxs.length;i++){
		boxs[i].onclick=function(e){
			e=e ||window.event; //做兼容处理
			var el =e.srcElement;//存储触发元素
			switch(el.className){
				//删除分享
				case 'close':
				    removeNode(el.parentNode);
				    break;
				//点赞和取消赞
				case 'praise':
				    praiseBox(el.parentNode.parentNode.parentNode,el);
				    break;
				//回复按钮灰色
				case 'btn btn-off':
				    clearTimeout(timer);
				    break;
				//回复按钮蓝色
				case 'btn':
				    reply(el.parentNode.parentNode.parentNode,el);
				    break;
				case 'comment-praise':
				    praiseReply(el);
				    break;
				case 'comment-operate':
				    operate(el);
				    break;

			}
		}

		//评论输入框
		//var textArea=boxs[i].getElementsByTagName("textarea")[0];
		var textArea = boxs[i].getElementsByClassName('comment')[0];
		//评论获得焦点
		textArea.onfocus=function(){
			this.parentNode.className="text-box text-box-on";
			this.value=(this.value=="评论…")? '': this.value;
			this.onkeyup();
		}

		//评论失去焦点
		textArea.onblur=function(){
			var me=this;
			var val=me.value;
			if(val==''){
				timer=setTimeout(function(){
				    me.parentNode.className="text-box";
				    me.value="评论…";
				},300);			
			}
		}
		//评论按键事件
		textArea.onkeyup=function(){
			var len=this.value.length;
			var p=this.parentNode;
			var btn=p.children[1];
			var word=p.children[2];
			if(len<=0||len>140){
				btn.className="btn btn-off";
			}
			else{
				btn.className="btn";
			}
			word.innerHTML=len +"/140";
		}
	}
}