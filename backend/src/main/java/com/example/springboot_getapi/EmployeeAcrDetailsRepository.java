package com.example.springboot_getapi;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeAcrDetailsRepository extends JpaRepository<EmployeeAcrDetails, Long> {

    List<EmployeeAcrDetails> findByEmployeeId(Long employeeId);
}
