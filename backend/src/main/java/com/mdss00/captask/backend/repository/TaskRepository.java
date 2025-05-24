package com.mdss00.captask.backend.repository;

import com.mdss00.captask.backend.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
}
