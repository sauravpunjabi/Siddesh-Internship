<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import = "java.sql.*, com.leave.connect" %>
<%@ page session = "true" %>

<%
	if(session.getAttribute("uid") == null){
		response.sendRedirect("login.jsp");
		return;
	}

	int uid = (int) session.getAttribute("uid");
%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Employee dashboard</title>
</head>
<body>


	<h2>Employee dashboard</h2>
	<h4>Welcome Employee: <%= uid %></h4>
	
	<a href = "applyLeave.jsp">Apply for leave</a>
	<a href = "logout">Logout</a>
	
	<br>
	
	<table border = "1" cellpadding = "15">
		
		<tr>
			<th>Start date: </th>
			<th>End date: </th>
			<th>Reason: </th>
			<th>Status: </th>
		</tr>
		
		<%
		
		Connection con = null;
		PreparedStatement ps = null;
		ResultSet rs = null;
		
			try{
				con = connect.getCon();
				
				ps = con.prepareStatement("SELECT * FROM request WHERE emp_id = ?");
				
				ps.setInt(1, uid);
				
				rs = ps.executeQuery();
				
				while(rs.next()){
				
		%>
			<tr>
				<td><%= rs.getDate("start_date") %></td>
				<td><%= rs.getDate("end_date") %></td>
				<td><%= rs.getString("reason") %></td>
				<td><%= rs.getString("status") %></td>
			</tr>
		<%
    }

} catch(Exception e){
%>

		<tr>
		<td colspan="4" style="color:red;">
		Error loading leave data
		</td>
		</tr>

<%
		} finally {
		
		    if(rs != null) rs.close();
		    if(ps != null) ps.close();
		    if(con != null) con.close();
		}
%>
		
	</table>
	
</body>
</html>