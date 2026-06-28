package com.example.springboot_getapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class EmployeeDashboardService {

    @Autowired
    private EmployeeDetailsRepository employeeDetailsRepository;

    @Autowired
    private EmployeeAcrStatusRepository acrStatusRepository;

    public List<EmployeeDashboardDTO> getAllEmployeeDashboardData() {
        List<EmployeeDetails> employees = employeeDetailsRepository.findAll();
        List<EmployeeDashboardDTO> result = new ArrayList<>();

        for (EmployeeDetails emp : employees) {
            // Build display name from first + last name
            String name = (emp.getEmpFirstName() != null ? emp.getEmpFirstName() : "");
            if (emp.getEmpLastName() != null && !emp.getEmpLastName().isEmpty()) {
                name += " " + emp.getEmpLastName();
            }

            // Get ACR status
            Boolean acrSubmitted = false;
            EmployeeAcrStatus acrStatus = acrStatusRepository
                    .findById(emp.getEmployeeId()).orElse(null);
            if (acrStatus != null) {
                acrSubmitted = Boolean.TRUE.equals(acrStatus.getIsAcrSubmitted());
            }

            result.add(new EmployeeDashboardDTO(
                emp.getEmployeeId(),
                name.trim(),
                emp.getOrganizationId(),
                acrSubmitted
            ));
        }

        return result;
    }
}
