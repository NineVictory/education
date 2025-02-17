<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<% 
	request.setCharacterEncoding("utf-8");
%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>페이지 모듈화</title>
<style type="text/css">
table{
	width:500px;
	margin: 0 auto;
	border:solid 1px #000000;
	border-collapse: collapse;
}
td{
	border:solid 1px #000000;
	text-align:center;
	vertical-align: middle;
	height:40px;
}
td.td-middle{
	text-align:left;
	vertical-align: top;
	height:200px;
}
td.td-width{
	width:100px;
}
</style>
</head>
<body>
<table>
	<tr>
		<td colspan="2">
		<%-- include 태그의 내용으로 html 주석, jsp 주석 전부 사용 불가 --%>
		<%-- utf-8로 지정을 하지않으면 html 브라우저가 인식을 못함 3번라인에서 지정해줌 (주석달면 에러가 발생하여 위쪽에 명시) --%>
		<jsp:include page="/ch05_actionTag/module/top.jsp">
			<jsp:param value="국제상사" name="company"/> 
		</jsp:include>
		
		</td>	
	</tr>
	<tr>
		<td class="td-middle td-width">
		<%-- />로 쓰면 단독태그로 의미됨. 단독태그:<jsp:include page="">여기에 내용을 쓰지 않는 것</jsp:include> (주석달면 에러가 발생하여 위쪽에 명시) --%>
		<jsp:include page ="/ch05_actionTag/module/left.jsp"/>   
		</td>
		<td class="td-middle">
			<!-- 내용 시작 -->
			레이아웃1
			<!-- 내용 끝 -->
		</td>
	</tr>
	<tr>
		<td colspan="2">
		<jsp:include page="/ch05_actionTag/module/bottom.jsp"/>
		</td>
	</tr>
	
</table>
</body>
</html>