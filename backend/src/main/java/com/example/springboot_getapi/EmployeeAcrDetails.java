package com.example.springboot_getapi;

import jakarta.persistence.*;

@Entity
@Table(name = "employee_acr_details", schema = "tran")
public class EmployeeAcrDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "_id")
    private Long id;

    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @Column(name = "organisation_id")
    private Integer organisationId;

    @Column(name = "office_id")
    private Integer officeId;

    @Column(name = "department_id")
    private Integer departmentId;

    @Column(name = "target", columnDefinition = "text")
    private String target;

    @Column(name = "achievements", columnDefinition = "text")
    private String achievements;

    // === Constructors ===
    public EmployeeAcrDetails() {}

    // === Getters and Setters ===
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public Integer getOrganisationId() { return organisationId; }
    public void setOrganisationId(Integer organisationId) { this.organisationId = organisationId; }

    public Integer getOfficeId() { return officeId; }
    public void setOfficeId(Integer officeId) { this.officeId = officeId; }

    public Integer getDepartmentId() { return departmentId; }
    public void setDepartmentId(Integer departmentId) { this.departmentId = departmentId; }

    public String getTarget() { return target; }
    public void setTarget(String target) { this.target = target; }

    public String getAchievements() { return achievements; }
    public void setAchievements(String achievements) { this.achievements = achievements; }
}
