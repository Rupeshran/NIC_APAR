package com.example.springboot_getapi;

public class EmployeeDashboardDTO {

    private Long employeeId;
    private String employeeName;
    private Integer organizationId;
    private Boolean acrSubmitted;

    public EmployeeDashboardDTO() {}

    public EmployeeDashboardDTO(Long employeeId, String employeeName,
                                 Integer organizationId, Boolean acrSubmitted) {
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.organizationId = organizationId;
        this.acrSubmitted = acrSubmitted;
    }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public Integer getOrganizationId() { return organizationId; }
    public void setOrganizationId(Integer organizationId) { this.organizationId = organizationId; }

    public Boolean getAcrSubmitted() { return acrSubmitted; }
    public void setAcrSubmitted(Boolean acrSubmitted) { this.acrSubmitted = acrSubmitted; }
}
