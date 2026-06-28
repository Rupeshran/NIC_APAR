package com.example.springboot_getapi;

import java.util.List;

public class SendToRORequest {

    private List<Long> employeeIds;

    public SendToRORequest() {}

    public List<Long> getEmployeeIds() { return employeeIds; }
    public void setEmployeeIds(List<Long> employeeIds) { this.employeeIds = employeeIds; }
}
