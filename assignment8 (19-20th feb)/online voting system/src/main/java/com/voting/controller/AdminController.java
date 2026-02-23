package com.voting.controller;

import com.voting.model.Candidate;
import com.voting.model.Election;
import com.voting.model.User;
import com.voting.repository.CandidateRepository;
import com.voting.repository.ElectionRepository;
import com.voting.repository.UserRepository;
import com.voting.repository.VoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private ElectionRepository electionRepository;

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/dashboard")
    public String loadDashboard(Model model) {
        Election election = electionRepository.findAll().get(0);
        model.addAttribute("election", election);

        List<Candidate> candidates = candidateRepository.findAll();
        Map<Candidate, Long> results = new HashMap<>();
        for (Candidate c : candidates) {
            results.put(c, voteRepository.countByCandidateId(c.getId()));
        }
        model.addAttribute("results", results);

        return "admin/dashboard";
    }

    @PostMapping("/election/toggle")
    public String changeElectionStatus() {
        Election election = electionRepository.findAll().get(0);
        election.setActive(!election.isActive());
        electionRepository.save(election);
        return "redirect:/admin/dashboard";
    }

    // show voters page
    @GetMapping("/voters")
    public String showVotersList(Model model) {
        model.addAttribute("voters", userRepository.findAll().stream()
                .filter(u -> u.getRole().equals("USER")).toList());
        return "admin/voters";
    }

    // add new voter from admin side
    @PostMapping("/voters/add")
    public String createNewVoter(@RequestParam String username, @RequestParam String password) {
        if (userRepository.findByUsername(username) == null) {
            User user = new User();
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode(password));
            user.setRole("USER");
            user.setHasVoted(false);
            userRepository.save(user);
        }
        return "redirect:/admin/voters";
    }

    @PostMapping("/voters/delete/{id}")
    public String removeVoter(@PathVariable Long id) {
        userRepository.deleteById(id);
        return "redirect:/admin/voters";
    }

    // show candidates page
    @GetMapping("/candidates")
    public String viewCandidates(Model model) {
        model.addAttribute("candidates", candidateRepository.findAll());
        return "admin/candidates";
    }

    // add new politician
    @PostMapping("/candidates/add")
    public String saveNewCandidate(@RequestParam String name, @RequestParam String party) {
        Candidate candidate = new Candidate(name, party);
        candidateRepository.save(candidate);
        return "redirect:/admin/candidates";
    }

    @PostMapping("/candidates/delete/{id}")
    public String dropCandidate(@PathVariable Long id) {
        candidateRepository.deleteById(id);
        return "redirect:/admin/candidates";
    }
}
