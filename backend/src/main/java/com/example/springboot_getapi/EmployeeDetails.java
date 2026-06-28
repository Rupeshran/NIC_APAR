package com.example.springboot_getapi;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "employee_details", schema = "tran")
public class EmployeeDetails {

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

    @Column(name = "gender", length = 1)
    private String gender;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "mobile_number")
    private String mobileNumber;

    // === Constructors ===
    public EmployeeDetails() {}

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

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }
}
