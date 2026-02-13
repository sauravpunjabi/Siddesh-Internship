import java.awt.*;
import java.awt.event.*;

public class info extends Frame implements ActionListener{
    Button btA, btB;
    TextArea txa;

    info(){
        btA = new Button("A");
        btB = new Button("B");

        txa = new TextArea();

        btA.setBounds(100, 150, 40,30);
        btB.setBounds(200, 150, 40, 30 );
        txa.setBounds(50, 180, 300, 100);

        add(btA);
        add(btB);
        add(txa);

        btA.addActionListener(this);
        btB.addActionListener(this);

        setSize(400, 350);
        setLayout(null);
        
        addWindowListener(new WindowAdapter() {
            public void windowClosing(WindowEvent e){
                dispose();
            }
        });

        setVisible(true);
    }

    public void actionPerformed(ActionEvent e){
        if(e.getSource() == btA){
            txa.setText("Name: Saurav Punjabi | Course: SY-MCA | Roll no: 1272240111 | College MIT-WPU");
        }

        if(e.getSource() == btB){
            txa.setText("Previous sem cgpa: 6.54");
        }
    }

    public static void main(String[] args){
        new info();
    }
}