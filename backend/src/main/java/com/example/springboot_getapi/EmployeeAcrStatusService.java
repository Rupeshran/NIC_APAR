package com.example.springboot_getapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeAcrStatusService {

    @Autowired
    private EmployeeAcrStatusRepository acrStatusRepository;

    // Inject EmployeeDetailsRepository to fetch employee data if the status row is missing
    @Autowired
    private EmployeeDetailsRepository employeeDetailsRepository;

    public List<EmployeeAcrStatus> getAllAcrStatus() {
        return acrStatusRepository.findAll();
    }

    public EmployeeAcrStatus getAcrStatusByEmployeeId(Long employeeId) {
        return acrStatusRepository.findById(employeeId).orElse(null);
    }

    public String sendToRO(List<Long> employeeIds) {
        int count = 0;
        for (Long empId : employeeIds) {
            // Check if the status record already exists
            EmployeeAcrStatus status = acrStatusRepository.findById(empId).orElse(null);
            
            // If the record doesn't exist, create a new one automatically
            if (status == null) {
                status = new EmployeeAcrStatus();
                status.setEmployeeId(empId);
                
                // Fetch employee details to populate the name and organization fields
                EmployeeDetails empDetails = employeeDetailsRepository.findById(empId).orElse(null);
                if (empDetails != null) {
                    status.setOrganizationId(empDetails.getOrganizationId());
                    status.setOfficeId(empDetails.getOfficeId());
                    status.setDepartmentId(empDetails.getDepartmentId());
                    status.setEmpIniName(empDetails.getEmpIniName());
                    status.setEmpFirstName(empDetails.getEmpFirstName());
                    status.setEmpMidName(empDetails.getEmpMidName());
                    status.setEmpLastName(empDetails.getEmpLastName());
                }
            }
            
            // Set both the submission and RO flags to true
            status.setIsAcrSubmitted(true);
            status.setSentToRO(true);
            
            // Save (will UPDATE if it exists, or INSERT if it's new)
            acrStatusRepository.save(status);
            count++;
        }
        
        return count + " employee(s) forwarded to Reporting Officer successfully.";
    }
}

