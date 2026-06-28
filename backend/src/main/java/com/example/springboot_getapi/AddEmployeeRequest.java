package com.example.springboot_getapi;

public class AddEmployeeRequest {

    private Long employeeId;
    private String empIniName;
    private String empFirstName;
    private String empMidName;
    private String empLastName;
    private Integer organizationId;
    private Integer officeId;
    private Integer departmentId;
    private String gender;
    private String dateOfBirth;
    private String mobileNumber;
    private String username;
    private String password;
    private String role;

    public AddEmployeeRequest() {}

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public String getEmpIniName() { return empIniName; }
    public void setEmpIniName(String empIniName) { this.empIniName = empIniName; }

    public String getEmpFirstName() { return empFirstName; }
    public void setEmpFirstName(String empFirstName) { this.empFirstName = empFirstName; }

    public String getEmpMidName() { return empMidName; }
    public void setEmpMidName(String empMidName) { this.empMidName = empMidName; }

    public String getEmpLastName() { return empLastName; }
    public void setEmpLastName(String empLastName) { this.empLastName = empLastName; }

    public Integer getOrganizationId() { return organizationId; }
    public void setOrganizationId(Integer organizationId) { this.organizationId = organizationId; }

    public Integer getOfficeId() { return officeId; }
    public void setOfficeId(Integer officeId) { this.officeId = officeId; }

    public Integer getDepartmentId() { return departmentId; }
    public void setDepartmentId(Integer departmentId) { this.departmentId = departmentId; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
