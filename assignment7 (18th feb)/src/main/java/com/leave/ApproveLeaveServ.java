package com.leave;

import java.sql.*;
import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;

public class ApproveLeaveServ extends HttpServlet{
	protected void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException{
		
		int id = Integer.parseInt(req.getParameter("id"));
		String status = req.getParameter("status");
		
		try {
			
			Connection con = connect.getCon();
			PreparedStatement ps = con.prepareStatement("UPDATE request SET status = ? WHERE leave_id = ?");
			
			ps.setString(1, status);
			ps.setInt(2, id);
			ps.executeUpdate();
			
		}
		catch(Exception e) {
			e.printStackTrace();
		}
	}
}