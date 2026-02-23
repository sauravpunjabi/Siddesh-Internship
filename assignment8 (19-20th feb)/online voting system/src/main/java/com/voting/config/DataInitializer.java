package com.voting.config;

import com.voting.model.Election;
import com.voting.model.User;
import com.voting.repository.ElectionRepository;
import com.voting.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ElectionRepository electionRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // creating default admin inside the database
        if (userRepository.findByUsername("admin") == null) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin"));
            admin.setRole("ADMIN");
            userRepository.save(admin);
        }

        // default stopped election
        if (electionRepository.count() == 0) {
            Election election = new Election();
            election.setName("General Election 2024");
            election.setActive(false);
            electionRepository.save(election);
        }
    }
}
