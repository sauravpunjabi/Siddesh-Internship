package com.leave;

import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;
import java.sql.*;

public class LoginServ extends HttpServlet{
	protected void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException
	{
		String users = req.getParameter("username");
		String pass = req.getParameter("password");
		
		try {
			Connection con = connect.getCon();
			PreparedStatement ps = con.prepareStatement("SELECT * FROM users WHERE username = ? AND password = ?");
			
			ps.setString(1, users);
			ps.setString(2, pass);
			
			
			ResultSet rs = ps.executeQuery();
			
			if(rs.next()) {
				HttpSession ss = req.getSession();
				ss.setAttribute("uid", rs.getInt("id"));
				ss.setAttribute("role", rs.getString("role"));
				
				if(rs.getString("role").equals("admin"))
					res.sendRedirect("adminDashb.jsp");
				else
					res.sendRedirect("employeeDash.jsp");
			}
			else {
				res.sendRedirect("login.jsp?msg=invalid");
			}
		}
		catch(Exception e) {
			e.printStackTrace();
		}
	}
}