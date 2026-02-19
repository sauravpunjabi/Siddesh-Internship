<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page session="true" %>

<%
	if(session.getAttribute("uid") == null){
	    response.sendRedirect("login.jsp");
	    return;
	}
%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Apply leave</title>
</head>
<body>

	<form action = "applyLeave" method = "post">
		Start date:
		<input type = "date" name = "start_date" required><br>
		
		End Date: 
		<input type = "date" name = "end_date" required><br>
		
		Reason: 
		<input type = "text" name = "reason" required><br>
		
		<button type = "submit">Apply for leave</button>
	</form>		
	
	<br>
	<a href = "employeeDash.jsp">Back</a>

</body>
</html>