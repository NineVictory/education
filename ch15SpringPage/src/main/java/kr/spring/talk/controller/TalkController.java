package kr.spring.talk.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;
import javax.websocket.Session;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.spring.member.service.MemberService;
import kr.spring.member.vo.MemberVO;
import kr.spring.talk.service.TalkService;
import kr.spring.talk.vo.TalkMemberVO;
import kr.spring.talk.vo.TalkRoomVO;
import kr.spring.talk.vo.TalkVO;
import kr.spring.util.PagingUtil;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
public class TalkController {
	@Autowired
	private TalkService talkService;
	@Autowired
	private MemberService memberService;
	
	/*===================
	 * 채팅방 목록
	 ====================*/
	@GetMapping("/talk/talkList")
	public String chatList(@RequestParam(defaultValue = "1") 
								int pageNum, String keyword, HttpSession session, Model model) {
		MemberVO user = (MemberVO)session.getAttribute("user");
		
		Map<String,Object> map = new HashMap<String, Object>();
		map.put("keyword",keyword);
		map.put("mem_num",user.getMem_num());
		
		int count = talkService.selectRowCount(map);
		//페이지 처리
		PagingUtil page = new PagingUtil(null,keyword,pageNum,count
										,30,10,"talkList");
		
		List<TalkRoomVO> list = null;
		if(count > 0) {
			map.put("start",page.getStartRow());
			map.put("end",page.getEndRow());
			list = talkService.selectTalkRoomList(map);
			
		}
		model.addAttribute("count",count);
		model.addAttribute("list", list);
		model.addAttribute("page",page.getPage());
		return "talkList";
	}
	/*===================
	 * 채팅방 생성 폼 호출
	 ====================*/
	//채팅방 생성 폼 호출
	@GetMapping("/talk/talkRoomWrite")
	public String talkRoomWrite() {
		return "talkRoomWrite";
	}
	//전송된 데이터 처리
	@PostMapping("/talk/talkRoomWrite")
	public String talkRoomSubmit(TalkRoomVO vo, HttpSession session) {
		
		log.debug("<<채팅방 생성>> :" + vo);
		
		MemberVO user = (MemberVO)session.getAttribute("user");
		
		//채팅 멤버 초대 문구 설정
		vo.setTalkVO(new TalkVO());
		vo.getTalkVO().setMem_num(user.getMem_num());
		vo.getTalkVO().setMessage(user.getId()+"님이 "+findMemberId(vo, user)+"님을 초대했습니다.@{member}@");
		
		talkService.insertTalkRoom(vo);
		
		
		return "redirect:/talk/talkList";
	}
	//채팅 회원 검색
	@GetMapping("/talk/memberSearchAjax")
	@ResponseBody
	public Map<String,Object> meberSearchAjax(
								String id, HttpSession session){
		Map<String,Object> mapJson = new HashMap<String, Object>();
		
		MemberVO user = (MemberVO)session.getAttribute("user");
		if(user==null) {
			//로그인이 되지 않은 경우
			mapJson.put("result","logout");
		}else {
			//로그인 된 경우
			List<MemberVO> member = memberService.selectSerchmember(id);
			
			mapJson.put("result","success");
			mapJson.put("member",member);
		}
		
		return mapJson;
		
	}
	
	/*===================
	 * 채팅 메시지 처리
	 ====================*/
	@GetMapping("/talk/talkDetail")
	public String talkDetail(long talkroom_num, Model model,HttpSession session) {
		String chatMember = "";
		String room_name ="";
		
		MemberVO user = (MemberVO)session.getAttribute("user");
		
		List<TalkMemberVO> list = talkService.selectTalkMember(talkroom_num);
		for(int i=0; i<list.size(); i++) {
			TalkMemberVO vo = list.get(i);
			//로그인한 회원의 채팅방 이름 셋팅
			if(user.getMem_num() == vo.getMem_num()) {
				room_name = vo.getRoom_name();
		}
			//채팅 멤버 저장
			if(i>0) chatMember += ",";
			chatMember += list.get(i).getId();
		}
		//채팅 멤버 id
		model.addAttribute("chatMember",chatMember);
		//채팅 멤버수 
		model.addAttribute("chatCount",list.size());
		//로그인한 회원의 채팅방 이름
		model.addAttribute("room_name",room_name);
		
		return "talkDetail";
	}
	//채팅 메시지 전송
	@PostMapping("/talk/writeTalk")
	@ResponseBody
	public Map<String, String> writeTalkAjax(TalkVO vo, HttpSession session){
		
		log.debug("<<채팅 메시지 전송>>"+vo);
		
		Map<String,String> mapAjax = new HashMap<String, String>();
		
		MemberVO user = (MemberVO)session.getAttribute("user");
		
		if(user==null) {
			//로그인이 되지 않는 경우
			mapAjax.put("result","logout");
			
		}else {
			//로그인 된 경우
			vo.setMem_num(user.getMem_num());
			//메시지 등록
			talkService.insertTalk(vo);
			mapAjax.put("result","success");
		}
		return mapAjax; //mapAjax 는 map<String.String> mapJson은 map<String.Object>
	}
	//채팅 메시지 읽기
	@GetMapping("/talk/talkDetailAjax")
	@ResponseBody
	public Map<String,Object> talkDetailAjax(
								long talkroom_num,
								HttpSession session){
		Map<String,Object> mapJson =
				new HashMap<String, Object>();
		MemberVO user = (MemberVO)session.getAttribute("user");
		
		if(user==null) {
			//로그인이 되지 않는 경우
			mapJson.put("result","logout");
			
		}else {
			//로그인 된 경우
			Map<String,Long> map = new HashMap<String, Long>();
			map.put("talkroom_num",talkroom_num);
			map.put("mem_num",user.getMem_num());
			List<TalkVO> list = talkService.selectTalkDetail(map);
			
			mapJson.put("result","success");
			mapJson.put("list",list);
			mapJson.put("user_num",user.getMem_num());
		}
		return mapJson;
	}
	
	//초대한 회원의 id 구하기
	private String findMemberId(TalkRoomVO vo,MemberVO user) {
		String member_id = "";
		long[] members = vo.getMembers();
		for(int i=0;i<members.length;i++) {
			String temp_id = memberService.selectMember(members[i]).getId();
			//초대한 사람의 아이디는 제외
			if(!user.getId().equals(temp_id)) {
				member_id += temp_id;
				if(i < members.length-1) member_id += ", ";
			}
		}
		return member_id;
	}
}













