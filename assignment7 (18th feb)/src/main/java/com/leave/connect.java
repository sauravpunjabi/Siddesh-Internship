package com.leave;

import java.sql.*;

public class connect {

		private static String url = "jdbc:mysql://localhost:3306/leave_appli";
		private static String user = "root";
		private static String password = "#Marvel3210";
		
		public static Connection getCon() throws Exception{
			Class.forName("com.mysql.cj.jdbc.Driver");
			
			Connection con = DriverManager.getConnection(url, user, password);
			
			if(con != null) {
				System.out.println("Connection successful");
			}
			
			return con;
		}

	}


