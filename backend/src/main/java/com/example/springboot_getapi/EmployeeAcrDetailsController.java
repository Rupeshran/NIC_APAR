package com.example.springboot_getapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class EmployeeAcrDetailsController {

    @Autowired
    private EmployeeAcrDetailsRepository acrDetailsRepository;

    @Autowired
    private EmployeeAcrStatusRepository acrStatusRepository;

    // POST — Employee submits their ACR
    @PostMapping("/acr/submit")
    public ResponseEntity<String> submitAcr(@RequestBody Map<String, Object> request) {
        try {
            Long employeeId = Long.valueOf(request.get("employeeId").toString());
            String achievements = (String) request.getOrDefault("achievements", "");
            String target = (String) request.getOrDefault("goals", "");

            // Save ACR details
            EmployeeAcrDetails acrDetails = new EmployeeAcrDetails();
            acrDetails.setEmployeeId(employeeId);
            acrDetails.setAchievements(achievements);
            acrDetails.setTarget(target);

            // Update status flags
            EmployeeAcrStatus status = acrStatusRepository.findById(employeeId).orElse(null);
            if (status != null) {
                acrDetails.setOrganisationId(status.getOrganizationId());
                acrDetails.setOfficeId(status.getOfficeId());
                acrDetails.setDepartmentId(status.getDepartmentId());

                status.setIsAcrSubmitted(true);
                // Ensure other flags are reset if re-submitting
                status.setSentToRO(false); 
                status.setIsReviewed(false);
                acrStatusRepository.save(status);
            }

            acrDetailsRepository.save(acrDetails);

            return ResponseEntity.ok("ACR submitted successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error submitting ACR: " + e.getMessage());
        }
    }

    // GET — All submitted ACRs (for admin review)
    @GetMapping("/acr/submitted")
    public ResponseEntity<List<EmployeeAcrDetails>> getSubmittedAcrs() {
        List<EmployeeAcrDetails> all = acrDetailsRepository.findAll();
        return ResponseEntity.ok(all);
    }

    // POST — Admin reviews an ACR
    @PostMapping("/acr/review")
    public ResponseEntity<String> reviewAcr(@RequestBody Map<String, Object> request) {
        try {
            Long employeeId = Long.valueOf(request.get("employeeId").toString());
            String rating = (String) request.getOrDefault("reviewerRating", "");
            String comments = (String) request.getOrDefault("reviewerComments", "");

            // Update the status to 'Reviewed'
            EmployeeAcrStatus status = acrStatusRepository.findById(employeeId).orElse(null);
            if (status != null) {
                status.setIsReviewed(true);
                acrStatusRepository.save(status);
            }

            return ResponseEntity.ok("Review submitted for Employee #" + employeeId);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    // DELETE — Admin deletes a submitted APAR
    @DeleteMapping("/acr/submitted/{employeeId}")
    @Transactional
    public ResponseEntity<String> deleteAcr(@PathVariable Long employeeId) {
        try {
            // Find and delete the ACR details entry (assuming findByEmployeeId returns a list)
            List<EmployeeAcrDetails> details = acrDetailsRepository.findByEmployeeId(employeeId);
            if (!details.isEmpty()) {
                acrDetailsRepository.deleteAll(details);
            }

            // Reset the employee's ACR status back to pending
            EmployeeAcrStatus status = acrStatusRepository.findById(employeeId).orElse(null);
            if (status != null) {
                status.setIsAcrSubmitted(false);
                status.setSentToRO(false);
                status.setIsReviewed(false);
                acrStatusRepository.save(status);
            }

            return ResponseEntity.ok("APAR deleted successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error deleting APAR: " + e.getMessage());
        }
    }
}

