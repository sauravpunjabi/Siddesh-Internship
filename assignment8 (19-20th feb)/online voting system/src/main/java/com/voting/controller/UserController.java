package com.voting.controller;

import com.voting.model.Candidate;
import com.voting.model.Election;
import com.voting.model.User;
import com.voting.model.Vote;
import com.voting.repository.CandidateRepository;
import com.voting.repository.ElectionRepository;
import com.voting.repository.UserRepository;
import com.voting.repository.VoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private ElectionRepository electionRepository;

    @Autowired
    private VoteRepository voteRepository;

    @GetMapping("/dashboard")
    public String showUserPanel(Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByUsername(auth.getName());
        Election election = electionRepository.findAll().get(0);

        model.addAttribute("user", user);
        model.addAttribute("election", election);

        if (!user.isHasVoted() && election.isActive()) {
            model.addAttribute("candidates", candidateRepository.findAll());
        }

        return "user/dashboard";
    }

    @PostMapping("/vote/{candidateId}")
    public String submitVote(@PathVariable Long candidateId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByUsername(auth.getName());
        Election election = electionRepository.findAll().get(0);

        if (election.isActive() && !user.isHasVoted()) {
            Candidate candidate = candidateRepository.findById(candidateId).orElse(null);
            if (candidate != null) {
                Vote vote = new Vote(user, candidate);
                voteRepository.save(vote);

                user.setHasVoted(true);
                userRepository.save(user);
            }
        }
        return "redirect:/user/dashboard?voted=true";
    }
}
