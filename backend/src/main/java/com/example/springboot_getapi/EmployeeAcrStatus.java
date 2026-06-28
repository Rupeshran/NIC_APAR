package com.example.springboot_getapi;

import jakarta.persistence.*;

@Entity
@Table(name = "employee_acr_status", schema = "tran")
public class EmployeeAcrStatus {

    @Id
    @Column(name = "employee_id")
    private Long employeeId;

    @Column(name = "organization_id")
    private Integer organizationId;

    @Column(name = "office_id")
    private Integer officeId;

    @Column(name = "department_id")
    private Integer departmentId;

    @Column(name = "emp_ini_name", length = 30)
    private String empIniName;

    @Column(name = "emp_first_name", length = 100)
    private String empFirstName;

    @Column(name = "emp_mid_name", length = 30)
    private String empMidName;

    @Column(name = "emp_last_name", length = 30)
    private String empLastName;

    @Column(name = "is_acr_submitted")
    private Boolean isAcrSubmitted = false;

    @Column(name = "sent_to_ro")
    private Boolean sentToRO = false;

    @Column(name = "is_reviewed")
    private Boolean isReviewed = false;

    // === Constructors ===
    public EmployeeAcrStatus() {}

    // === Getters and Setters ===
    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public Integer getOrganizationId() { return organizationId; }
    public void setOrganizationId(Integer organizationId) { this.organizationId = organizationId; }

    public Integer getOfficeId() { return officeId; }
    public void setOfficeId(Integer officeId) { this.officeId = officeId; }

    public Integer getDepartmentId() { return departmentId; }
    public void setDepartmentId(Integer departmentId) { this.departmentId = departmentId; }

    public String getEmpIniName() { return empIniName; }
    public void setEmpIniName(String empIniName) { this.empIniName = empIniName; }

    public String getEmpFirstName() { return empFirstName; }
    public void setEmpFirstName(String empFirstName) { this.empFirstName = empFirstName; }

    public String getEmpMidName() { return empMidName; }
    public void setEmpMidName(String empMidName) { this.empMidName = empMidName; }

    public String getEmpLastName() { return empLastName; }
    public void setEmpLastName(String empLastName) { this.empLastName = empLastName; }

    public Boolean getIsAcrSubmitted() { return isAcrSubmitted; }
    public void setIsAcrSubmitted(Boolean isAcrSubmitted) { this.isAcrSubmitted = isAcrSubmitted; }

    public Boolean getSentToRO() { return sentToRO; }
    public void setSentToRO(Boolean sentToRO) { this.sentToRO = sentToRO; }

    public Boolean getIsReviewed() { return isReviewed; }
    public void setIsReviewed(Boolean isReviewed) { this.isReviewed = isReviewed; }
}

