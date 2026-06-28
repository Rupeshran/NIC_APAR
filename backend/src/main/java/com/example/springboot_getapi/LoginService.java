package com.example.springboot_getapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LoginService {

    @Autowired
    private UserLoginRepository userLoginRepository;

    public LoginResponse authenticate(LoginRequest request) {
        Optional<UserLogin> optUser = userLoginRepository.findByUsername(request.getUsername());

        if (optUser.isEmpty()) {
            return new LoginResponse("Invalid username or password.");
        }

        UserLogin user = optUser.get();

        if (!user.getPassword().equals(request.getPassword())) {
            return new LoginResponse("Invalid username or password.");
        }

        return new LoginResponse(
            "Login Successful",
            user.getEmployeeId(),
            user.getUsername(),
            user.getRole()
        );
    }
}

