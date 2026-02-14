import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

public class count extends Frame implements ActionListener{
    JTextArea txa;
    JButton btn;
    JLabel lb;

    count(){
        txa = new JTextArea();
        btn = new JButton("Count words");
        lb = new JLabel();

        txa.setBounds(30, 40, 300, 150);
        btn.setBounds(60, 200, 200,30);
        lb.setBounds(30, 250, 300, 30);

        add(txa);
        add(btn);
        add(lb);

        btn.addActionListener(this);

        setSize(400, 350);
        setLayout(null);
        setVisible(true);
    }

    public void actionPerformed(ActionEvent e){
        String txt = txa.getText();

        int chars = txt.length();

        String arr[] = txt.trim().split("\\s+");

        int words = 0;

        if(txt.trim().isEmpty()){
            words = 0;
        }
        else{
            words = arr.length;
        }

        lb.setText("Words: " + words + " Char: " + chars);
    }

    public static void main(String [] args){
        new count();
    }

}