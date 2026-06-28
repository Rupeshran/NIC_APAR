
package com.example.springboot_getapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class ReminderController {

    @Autowired
    private RemainderRepository reminderRepository;

    // POST — Admin sends reminders to selected employees
    @PostMapping("/reminders/send")
    public ResponseEntity<String> sendReminders(@RequestBody ReminderRequest request) {
        try {
            for (Long empId : request.getEmployeeIds()) {
                Remainder reminder = new Remainder(
                    empId,
                    request.getMessage(),
                    "Admin"
                );
                reminderRepository.save(reminder);
            }
            return ResponseEntity.ok(
                "Reminders sent to " + request.getEmployeeIds().size() + " employee(s)."
            );
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    // GET — Employee fetches their reminders
    @GetMapping("/reminders/employee/{employeeId}")
    public ResponseEntity<List<Remainder>> getReminders(@PathVariable Long employeeId) {
        List<Remainder> reminders = reminderRepository
                .findByEmployeeIdOrderBySentAtDesc(employeeId);
        return ResponseEntity.ok(reminders);
    }
}
