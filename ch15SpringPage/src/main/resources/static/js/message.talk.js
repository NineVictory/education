$(function(){
	let message_socket; //웹소켓 식별자
	
	/*--------------------
	 * 채팅 회원 저장
	 *--------------------*/
	let member_list = []; //채팅 회원을 저장하는 배열
	
	//채팅방 멤버를 저장하는 배열에 정보 셋팅
	//채팅방 또는 채팅 페이지를 인식해서 채팅방 멤버를 초기 셋팅
	if($('#talkWrite').length>0){ //채팅방 생성 페이지
		member_list = [$('#user').attr('data-id')];
		console.log(member_list);
	}else if($('#talkDetail').length>0){
		connectWebSocket(); //웹소켓 생성
		member_list = $('#chat_member').text().split(',');
	}
	/*--------------------
	 * 웹소켓 연결
	 *--------------------*/
	function connectWebSocket(){ 	
		message_socket = new WebSocket('ws://localhost:8000/message-ws'); //message-ws 는 아까 appConfig에서 정해둔 식별자명
		message_socket.onopen = function(evt){
			console.log('채팅페이지 접속 :'+ $('#talkDetail').length);
			if($('#talkDetail').length==1){
				message_socket.send('msg');
			}
		};
		//서버로부터 메시지를 받으면 호출되는 함수 지정
		message_socket.onmessage = function(evt){
			//메시지 읽기
			let data = evt.data;
			if($('#talkDetail').length==1 && data.substring(0,3)=='msg'){
				selectMsg();
			}
		};
		message_socket.onclose=function(evt){
			//소켓이 종료된 후 보과적인 작성이 있을 경우 명시
			console.long('chat close');
		};
	}
	/*--------------------
	 * 채팅방 생성하기
	 *--------------------*/
	//회원 정보 검색
	$('#member_search').keyup(function(){
		if($('#member_search').val().trim()==''){
			$('#search_area').empty();
			return;
		}
		//서버와 통신
		$.ajax({
			url:'memberSearchAjax',
			type:'get',
			data:{id:$('#member_search').val()},
			dataType:'json',
			success:function(param){
				if(param.result == 'logout'){
					$('#member_search').attr('disabled',true); //disabled 가 true이면 비활성화
					$('#member_search').val('로그인해야 회원 검색이 가능합니다.'); //비활성화 상태라는걸 알려주는 값을 전달
				}else if(param.result == 'success'){
					$('#search_area').empty();
					$(param.member).each(function(index,item){
						//채팅방 개설자의 아이디와 동일한 아이디와
						//이미 member_list에 저장된 아이디 제외
						if(!member_list.includes(item.id)){
							let output = '';
							output += '<li data-num="'+item.mem_num+'">';
							output += item.id;
							output += '</li>';
							$('#search_area').append(output);
						}
					});
				}else{
					alert('회원 검색 오류 발생')
				}
				
			},
			error:function(){
				alert('네트워크 오류 발생');
			}
		})
	});
	//검색된 회원 선택하기
	$(document).on('click','#search_area li',function(){
		let id =$(this).text(); //선택한 아이디
		let mem_num = $(this).attr('data-num'); //선택한 회원번호
		member_list.push(id);
		//선택한 id를 화면에 표시
		let choice_id = '<span class="member-span" data-id="'+id+'">';
		choice_id += '<input type="hidden" name="members" value="'+mem_num+'">';
		choice_id += id+'<sup>&times;</sup></span>'
		$('#talk_member').append(choice_id);
		$('#member_search').val('');
		$('#search_area').empty(); //ul태그 초기화
		
		if($('#name_checked').is(':checked')){ //채팅방 이름 자동설정 (check표시가 되어있을 때)
			makeRoom_name();
		}
	});
	//선택한 채팅방 멤버 삭제하기
	$(document).on('click','.member-span',function(){
		let id = $(this).attr('data-id');
		//채팅 멤버가 저장된 배열에서 삭제할 멤버의 id 제거
		member_list.splice(member_list.indexOf(id),1);
		$(this).remove();
		
		if($('#name_checked').is(':checked')){ //채팅방 이름 자동설정 (check표시가 되어있을 때)
			makeRoom_name();
		}				//span은 후손선택자
		if($('#talk_member span').length==0){
			$('#name_span').text('');
			$('#basic_name').val('');
		}
	});
	
	//채팅방 이름 생성 방식 정하기(자동/수동)             
	$('#name_checked').click(function(){
		if($('#name_checked').is(':checked')){//채팅방 이름 자동 생성
			$('#basic_name').attr('type','hidden');
			if(member_list.length > 1){
				makeRoom_name();
			}
		}else{//채팅방 이름 수동 생성
			$('#basic_name').attr('type','text');
			$('#name_span').text(''); //채팅방 이름 표시 텍스트 초기화
		}
	});
	
    // 채팅방 이름 생성             
	function makeRoom_name(){
		let name = '';
		$.each(member_list,function(index,item){
			if(index>0) name += ',';
			name += item;
		});
		if(name.length>55){
			name = name.substring(0,55) + '...';
		}
		$('#basic_name').val(name);
		$('#name_span').text(name);
	}
	
	//채팅방 생성 전송
	$('#talk_form').submit(function(){
		if(member_list.length<=1){//이미 배열에 현재 로그인한 유저(채팅방 개설자)가 기본 등록되어 있어서 로그인한 유저 포함 최소 2명이 되어야 채팅 가능
			alert('채팅에 참여할 회원을 검색하세요!');
			$('#member_search').focus();
			return false;
		}
	});
	
	/*--------------------
	 * 채팅하기
	 *--------------------*/

	//메시지 입력후 enter 이벤트 처리
	$('#message').keydown(function(event){
		if(event.keyCode == 13 && !event.shiftKey){
			$('#detail_form').trigger('submit');
		}
	});
	//채팅 메시지 등록
	$('#detail_form').submit(function(event){
		if($('#message').val().trim()==''){
			alert('메시지를 입력하세요');
			$('#message').val('').focus(); //공백을 제거하고 포커스를 맞추기
			return false;
		}
		if($('#message').val().length>1333){
			alert('메시지를 1333자 까지만 입력가능합니다.');
			return false;
		}
		//입력한 데이터를 읽어오기
		let form_data = $(this).serialize();
		//서버와 통신
		$.ajax({
			url:'../talk/writeTalk',
			type:'post',
			data:form_data,
			dataType:'json',
			success:function(param){
				if(param.result == 'logout'){
					alert('로그인 해야 작성 할 수 있습니다.');
					message_socket.close();
				}else if(param.result=='success'){
					//폼 초기화
					$('#message').val('').focus();
					message_socket.send('msg');
				}else{
					alert('채팅 메시지 등록 오류 발생');
					message_socket.close();
				}
			},
			error:function(){
				alert('네트워크 오류 발생');
				message_socket.close();
			}
		});//end of ajax
		//기본 이벤트 제거
		event.preventDefault();
	});//end of 채팅 메시지 등록
	//채팅 데이터 읽기	
	function selectMsg(){
		$.ajax({
			url:'../talk/talkDetailAjax',
			type:'get',
			data:{talkroom_num:$('#talkroom_num').val()},
			dataType:'json',
			success:function(param){
				if(param.result == 'logout'){
					alert('로그인 후 사용하세요!');
					message_socket.close();
				}else if(param.result == 'success'){
						
					//메시지 표시 UI 초기화	
					$('#chatting_message').empty();
					
					let chat_date='';	
					$(param.list).each(function(index,item){
						let output = '';
						//날짜 추출
						if(chat_date != item.chat_date.split(' ')[0]){
							chat_date = item.chat_date.split(' ')[0];
							output += '<div class="date-position"><span>'+chat_date+'</span></div>';
						}
						
						if(item.message.indexOf('@{member}@')>=0){//멤버등록/탈퇴 메시지 처리
							//신규, 탈퇴 회원 메시지
							output += '<div class="member-message">';
							output += item.message.substring(0,item.message.indexOf('@{member}@'));
							output += '</div>';
						}else{
							//멤버등록/탈퇴 메시지가 아닌 일반 메시지
							if(item.mem_num == param.user_num){
								output += '<div class="from-position">'+item.id;
								output += '<div>';
							}else{	
								output += '<div class="to-position">';
								output += '<div class="space-photo">';
								output += '<img src="../member/viewProfile?mem_num='+ item.mem_num +'" width="40" height="40" class="my-photo">';
								output += '</div><div class="space-message">';
								output += item.id;
							}
							output += '<div class="item">';
							output += item.read_count + ' <span>' + item.message.replace(/\r\n/g,'<br>').replace(/\r/g,'<br>').replace(/\n/g,'<br>') + '</span>';
							//시간 추출
							output += '<div class="align-right">' + item.chat_date.split(' ')[1] + '</div>';
							output += '</div>';
							output += '</div><div class="space-clear"></div>';
							output += '</div>';
						}
						
						//문서 객체에 추가
						$('#chatting_message').append(output);
						//스크롤을 하단에 위치시킴
						$('#chatting_message').scrollTop($("#chatting_message")[0].scrollHeight);
					});	
				}else{
					alert('채팅 메시지 읽기 오류 발생');	
					message_socket.close(); 
				}
			},
			error:function(){
				alert('네트워크 오류 발생');
				message_socket.close();
			}
		});	
	}
	
});












