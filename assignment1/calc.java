import java.util.*;

public class calc{
    static double add(double a, double b){
        return a+b;
    }

    static double sub(double a, double b){
        return a-b;
    }

    static double multiply(double a, double b){
        return a * b;
    }

    static double divide(double a, double b){
        if(b == 0){
            System.out.println("not divisible by 0");
            return 0;
        }
        return a / b;
    }

    //main class starts from here
    public static void main(String [] args){
    Scanner s = new Scanner(System.in);

    System.out.println("Enter first number: ");
    double n1 = s.nextDouble();

    System.out.println("Enter second number: ");
    double n2 = s.nextDouble();

    System.out.println("Choose operation: ");
    System.out.println("1. Addition");
    System.out.println("2. Subtraction");
    System.out.println("3. Multiplication");
    System.out.println("4. Division");

    System.out.println("Enter choice: ");
    int choice = s.nextInt();

    double result = 0;

    switch (choice) {
        case 1:
            result = add(n1,n2);
            break;

        case 2:
            result = sub(n1,n2);
            break;

        case 3:
            result = multiply(n1, n2);
            break;

        case 4: 
            result = divide(n1, n2);
            break;

        default:
            System.out.println("invalid input");
            return;
        }
        System.out.println("Result = " + result);
    }
}

