package com.example.springboot_getapi;

import java.util.List;

public class ReminderRequest {

    private List<Long> employeeIds;
    private String message;

    public ReminderRequest() {}

    public List<Long> getEmployeeIds() { return employeeIds; }
    public void setEmployeeIds(List<Long> employeeIds) { this.employeeIds = employeeIds; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
