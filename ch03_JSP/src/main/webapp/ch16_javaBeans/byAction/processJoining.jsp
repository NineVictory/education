<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
	//전송된 데이터 인코딩 타입 지정
	request.setCharacterEncoding("utf-8");
%>
						<!-- import를 해도 전부 명시해야 인식이 되기 떄문에 굳이 import를 하지않음 -->
<jsp:useBean id="member" class="kr.web.member.MemberVO"/> 
					<!-- property="*" : *은 모든 프로퍼티를 의미 -->  
<jsp:setProperty name="member" property="*" />
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>회원가입</title>
</head>
<body>
아이디 : <jsp:getProperty property="id" name="member"/><br>
비밀번호 : <jsp:getProperty property="password" name="member"/><br>
이름 : <jsp:getProperty property="name" name="member"/><br>
이메일 : <jsp:getProperty property="email" name="member"/><br>
주소 : <jsp:getProperty property="address" name="member"/><br>
</body>
</html>