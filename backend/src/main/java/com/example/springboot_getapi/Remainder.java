package com.example.springboot_getapi;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reminders", schema = "tran")
public class Remainder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @Column(name = "message", columnDefinition = "text")
    private String message;

    @Column(name = "sent_at")
    private LocalDateTime sentAt = LocalDateTime.now();

    @Column(name = "sent_by", length = 100)
    private String sentBy;

    // === Constructors ===
    public Remainder() {}

    public Remainder(Long employeeId, String message, String sentBy) {
        this.employeeId = employeeId;
        this.message = message;
        this.sentBy = sentBy;
        this.sentAt = LocalDateTime.now();
    }

    // === Getters and Setters ===
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public LocalDateTime getSentAt() { return sentAt; }
    public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }

    public String getSentBy() { return sentBy; }
    public void setSentBy(String sentBy) { this.sentBy = sentBy; }
}
