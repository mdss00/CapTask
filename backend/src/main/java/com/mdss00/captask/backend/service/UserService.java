package com.mdss00.captask.backend.service;

import com.mdss00.captask.backend.exceptions.EmailAlreadyUsedException;
import com.mdss00.captask.backend.model.User;
import com.mdss00.captask.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Transactional
    public User registerUser(User user) {
        if (emailExists(user.getEmail())) {
            throw new EmailAlreadyUsedException("El email ya está en uso");
        }
        return userRepository.save(user);
    }

    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }

    public boolean emailExists(String email) {
        return userRepository.findByEmail(email).isPresent();
    }
}