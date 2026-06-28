package com.example.springboot_getapi;

import jakarta.persistence.*;

@Entity
@Table(name = "user_login", schema = "tran")
public class UserLogin {

    @Id
    @Column(name = "employee_id")
    private Long employeeId;

    @Column(name = "username", nullable = false, unique = true, length = 100)
    private String username;

    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @Column(name = "role", length = 20)
    private String role = "EMPLOYEE";

    // === Constructors ===
    public UserLogin() {}

    public UserLogin(Long employeeId, String username, String password, String role) {
        this.employeeId = employeeId;
        this.username = username;
        this.password = password;
        this.role = role;
    }

    // === Getters and Setters ===
    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
