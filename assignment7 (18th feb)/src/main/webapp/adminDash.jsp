<%@ page import="java.sql.*,com.leave.connect" %>
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
<title>Admin Dashboard</title>
</head>
<body>

<h2>Admin Dashboard</h2>

<a href="logout">Logout</a>

<br><br>

<table border="1" cellpadding="8">

<tr>
<th>ID</th>
<th>Emp ID</th>
<th>Start</th>
<th>End</th>
<th>Reason</th>
<th>Status</th>
<th>Action</th>
</tr>

<%
try{

Connection con = connect.getCon();
Statement st = con.createStatement();
ResultSet rs = st.executeQuery("SELECT * FROM leave_request");

while(rs.next()){
%>

<tr>
<td><%=rs.getInt("leave_id")%></td>
<td><%=rs.getInt("emp_id")%></td>
<td><%=rs.getDate("start_date")%></td>
<td><%=rs.getDate("end_date")%></td>
<td><%=rs.getString("reason")%></td>
<td><%=rs.getString("status")%></td>

<td>
<a href="approve?id=<%=rs.getInt("leave_id")%>&status=Approved">Approve</a>
|
<a href="approve?id=<%=rs.getInt("leave_id")%>&status=Rejected">Reject</a>
</td>
</tr>

<%
}

con.close();

}catch(Exception e){
out.println("Error loading data");
}
%>

</table>

</body>
</html>
