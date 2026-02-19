package com.leave;

import java.sql.*;
import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;

public class LogoutServ extends HttpServlet{
	protected void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException{
		HttpSession ss = req.getSession();
		ss.invalidate();
		
		res.sendRedirect("login.jsp");
	}
}