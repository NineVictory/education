<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import = "java.util.HashMap" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>forEach 태그</title>
</head>
<body>
<h4>1부터 100까지의 홀수의 합</h4>
<c:set var="sum" value="0"/>
<c:forEach var="i" begin="1" end="100" step="2">
	<c:set var="sum" value="${sum+i}"/>
</c:forEach>
결과 = ${sum}

<h4>구구단 : 5단</h4>
<ul>
<c:forEach var="i" begin="1" end="9" step="1">
	<li>5 * ${i} = ${5*i}</li>
</c:forEach>	
</ul>
<h4>int형 배열</h4>
<c:set var="intArray" value="<%= new int[]{10,20,30,40,50} %>"/>
<c:forEach var="i" items="${intArray}" begin="2" end="4" varStatus="status"><!--begin="2" end="4" => 인덱스 2번부터 4번까지 읽기위함  -->
	<%--	인덱스			반복돌리는 횟수	 	 값  	첫번째 반복여부: 첫번째면 true   마지막 반복여부: 마지막이면 true  --%>
	${status.index} - ${status.count} - [${i}] - ${status.first} - ${status.last}<br>
</c:forEach>

<h4>Map</h4>
<%
	HashMap<String,String> mapData = new HashMap<String,String>();
	
	mapData.put("name","홍길동");
	mapData.put("job","소방관");
	mapData.put("hobby","영화감상");
%>
<c:set var="map" value="<%= mapData %>"/>
<c:forEach var="i" items="${map}">
	${i.key} = ${i.value}<br>
</c:forEach>
</body>
</html>