package com.example.springboot_getapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class EmployeeDetailsController {

    @Autowired
    private EmployeeDetailsRepository employeeDetailsRepository;

    @Autowired
    private EmployeeAcrStatusRepository acrStatusRepository;

    @Autowired
    private UserLoginRepository userLoginRepository;

    @Autowired
    private EmployeeDashboardService dashboardService;

    // ==========================
    // GET ALL EMPLOYEES
    // ==========================
    @GetMapping("/employees")
    public ResponseEntity<List<EmployeeDashboardDTO>> getAllEmployees() {

        List<EmployeeDashboardDTO> employees =
                dashboardService.getAllEmployeeDashboardData();

        return ResponseEntity.ok(employees);
    }

    // ==========================
    // ADD NEW EMPLOYEE
    // ==========================
    @PostMapping("/employees")
    public ResponseEntity<String> addEmployee(
            @RequestBody AddEmployeeRequest request) {

        try {

            // Check duplicate Employee ID
            if (employeeDetailsRepository.existsById(request.getEmployeeId())) {
                return ResponseEntity
                        .badRequest()
                        .body("Employee ID already exists.");
            }

            // Check duplicate Username
            if (userLoginRepository.existsByUsername(request.getUsername())) {
                return ResponseEntity
                        .badRequest()
                        .body("Username already exists.");
            }

            // =========================================
            // 1. SAVE EMPLOYEE DETAILS
            // =========================================

            EmployeeDetails details = new EmployeeDetails();

            details.setEmployeeId(request.getEmployeeId());
            details.setEmpIniName(request.getEmpIniName());
            details.setEmpFirstName(request.getEmpFirstName());
            details.setEmpMidName(request.getEmpMidName());
            details.setEmpLastName(request.getEmpLastName());

            details.setOrganizationId(request.getOrganizationId());
            details.setOfficeId(request.getOfficeId());
            details.setDepartmentId(request.getDepartmentId());

            details.setGender(request.getGender());
            details.setMobileNumber(request.getMobileNumber());

            if (request.getDateOfBirth() != null &&
                    !request.getDateOfBirth().isEmpty()) {

                details.setDateOfBirth(
                        LocalDate.parse(request.getDateOfBirth()));
            }

            employeeDetailsRepository.save(details);

            // =========================================
            // 2. SAVE ACR STATUS
            // =========================================

            EmployeeAcrStatus acrStatus = new EmployeeAcrStatus();

            acrStatus.setEmployeeId(request.getEmployeeId());

            acrStatus.setOrganizationId(request.getOrganizationId());
            acrStatus.setOfficeId(request.getOfficeId());
            acrStatus.setDepartmentId(request.getDepartmentId());

            acrStatus.setEmpIniName(request.getEmpIniName());
            acrStatus.setEmpFirstName(request.getEmpFirstName());
            acrStatus.setEmpMidName(request.getEmpMidName());
            acrStatus.setEmpLastName(request.getEmpLastName());

            acrStatus.setIsAcrSubmitted(false);
            acrStatus.setSentToRO(false);

            acrStatusRepository.save(acrStatus);

            // =========================================
            // 3. SAVE LOGIN DETAILS
            // =========================================

            UserLogin login = new UserLogin(

                    request.getEmployeeId(),
                    request.getUsername(),
                    request.getPassword(),

                    request.getRole() == null
                            ? "EMPLOYEE"
                            : request.getRole()

            );

            userLoginRepository.save(login);

            return ResponseEntity.ok("Employee added successfully.");

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(500)
                    .body("Error adding employee : " + e.getMessage());

        }
    }

    // ==========================
    // DELETE EMPLOYEE
    // ==========================
    @DeleteMapping("/employees/{id}")
    public ResponseEntity<String> deleteEmployee(
            @PathVariable Long id) {

        try {

            userLoginRepository.deleteById(id);

            acrStatusRepository.deleteById(id);

            employeeDetailsRepository.deleteById(id);

            return ResponseEntity.ok("Employee deleted successfully.");

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(500)
                    .body("Error deleting employee : " + e.getMessage());

        }
    }
}

