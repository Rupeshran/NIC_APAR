package com.example.springboot_getapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
public class EmployeeAcrStatusController {

    @Autowired
    private EmployeeAcrStatusService acrStatusService;

    // GET ACR status for a specific employee
    @GetMapping("/acr-status/{employeeId}")
    public ResponseEntity<?> getAcrStatus(@PathVariable Long employeeId) {
        EmployeeAcrStatus status = acrStatusService.getAcrStatusByEmployeeId(employeeId);
        if (status == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(status);
    }

    // POST — Send selected employees to Reporting Officer
    @PostMapping("/acr-status/sendToRO")
    public ResponseEntity<String> sendToRO(@RequestBody SendToRORequest request) {
        String result = acrStatusService.sendToRO(request.getEmployeeIds());
        return ResponseEntity.ok(result);
    }
}
