package com.example.springboot_getapi;

public class LoginResponse {

    private String message;
    private Long employeeId;
    private String username;
    private String role;

    public LoginResponse() {}

    public LoginResponse(String message) {
        this.message = message;
    }

    public LoginResponse(String message, Long employeeId, String username, String role) {
        this.message = message;
        this.employeeId = employeeId;
        this.username = username;
        this.role = role;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
