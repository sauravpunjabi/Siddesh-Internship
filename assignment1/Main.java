import java.sql.*;
import java.util.*;
import java.util.regex.*;

public class Main{
    public static void main(String [] args){
        Scanner s = new Scanner(System.in);

        try{
            String url = "jdbc:mysql://localhost:3306/feedback";
            String user = "root";
            String password = "#Marvel3210";

            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection con = DriverManager.getConnection(url, user, password);

            String name;
            while(true){
                System.out.print("Enter username: ");
                name = s.nextLine();
                if(name.length() > 3) break;
                System.out.println("Username must be more than 3 characters.");
            }

            String email;
            String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
            while(true){
                System.out.print("Enter email: ");
                email = s.nextLine();
                if(Pattern.matches(emailRegex, email)) break;
                System.out.println("Invalid email format.");
            }

            String pass;
            String passRegex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=!]).{8,}$";
            while(true){
                System.out.print("Enter password: ");
                pass = s.nextLine();
                if(Pattern.matches(passRegex, pass)) break;
                System.out.println("Password must be 8+ chars with upper, lower, digit & special char.");
            }

            System.out.print("Enter college: ");
            String college = s.nextLine();

            System.out.print("PRN: ");
            int prn = s.nextInt();
            s.nextLine();

            System.out.print("Feedback: ");
            String feedback = s.nextLine();

            String query = "INSERT INTO responses(name, email, password, college, prn, feedback) VALUES (?, ?, ?, ?, ?, ?)";
            PreparedStatement ps = con.prepareStatement(query);

            ps.setString(1, name);
            ps.setString(2, email);
            ps.setString(3, pass);
            ps.setString(4, college);
            ps.setInt(5, prn);
            ps.setString(6, feedback);

            ps.executeUpdate();

            System.out.println("Feedback submitted!");

            con.close();
        }
        catch(Exception e){
            e.printStackTrace();
        }
    }
}