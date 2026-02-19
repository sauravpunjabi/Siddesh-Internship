<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Login page</title>
</head>
<body>
	<h2>Login Page</h2>
		<form action = "login" method = "post">
			
			Username:
			<input type = "text" name = "username" required><br>
			
			Password:
			<input type = "password" name = "password" required><br>
			
			<button type = "submit">Login</button>
			
		</form>
		
	<%
	String msg = request.getParameter("msg");
	if(msg != null){
	%>

	<p style="color:red">Please enter correct details</p>

<%
}
%>

</body>
</html>