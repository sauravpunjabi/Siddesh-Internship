package com.leave;

import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;
import java.sql.*;

public class LeaveApplyServ extends HttpServlet{
	protected void doPost (HttpServletRequest req, HttpServletResponse res) throws IOException{
		HttpSession ss = req.getSession();
		
		int empID = (int) ss.getAttribute("uid");
		
		String start = req.getParameter("start_date");
		String end = req.getParameter("end_date");
		String reason = req.getParameter("reason");
		
		try {
			Connection con = connect.getCon();
			
			PreparedStatement ps = con.prepareStatement("INSERT INTO request(emp_id, start_date, end_date, reason) VALES (?, ?, ?, ?)");
			
			ps.setInt(1, empID);
			ps.setString(2, start);
			ps.setString(3, end);
			ps.setString(4, reason);
			
			ps.executeUpdate();
			
			res.sendRedirect("employeeDash.jsp");
		}
		catch(Exception e) {
			e.printStackTrace();
		}
	}
}