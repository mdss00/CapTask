package com.mdss00.captask.backend.controller;

import com.mdss00.captask.backend.dto.TaskCreateDto;
import com.mdss00.captask.backend.dto.TaskUpdateColumnDTO;
import com.mdss00.captask.backend.model.Board;
import com.mdss00.captask.backend.model.BoardColumn;
import com.mdss00.captask.backend.model.Task;
import com.mdss00.captask.backend.repository.BoardColumnRepository;
import com.mdss00.captask.backend.service.BoardService;
import com.mdss00.captask.backend.service.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.http.HttpResponse;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:4200")
public class TaskController {

    private final TaskService service;
    private final TaskService taskService;
    private final BoardColumnRepository columnRepository;

    public TaskController(TaskService service, TaskService taskService, BoardColumnRepository columnRepository) {
        this.service = service;
        this.taskService = taskService;
        this.columnRepository = columnRepository;
    }

    @GetMapping
    public List<Task> getAll() {
        return service.getAllTasks();
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody TaskCreateDto dto) {
        BoardColumn column = columnRepository.findById(dto.getColumn())
                .orElseThrow(() -> new RuntimeException("Board no encontrado"));
        Task newTask = new Task();
        newTask.setTitle(dto.getTitle());
        newTask.setStatus(dto.getStatus());
        newTask.setPriority(dto.getPriority());
        newTask.setColumn(column);
        Task savedTask = taskService.createTask(newTask);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedTask);
    }
    @PutMapping("{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task updatedTask) {
        Task saved = taskService.updateTask(id, updatedTask);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{taskId}/column")
    public ResponseEntity<Task> updateTaskColumn(
            @PathVariable Long taskId,
            @RequestBody TaskUpdateColumnDTO dto) {

        Task updatedTask = taskService.updateTaskColumn(taskId, dto.getColumnId());
        return ResponseEntity.ok(updatedTask);
    }

    @PutMapping("/{id}/update")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody TaskCreateDto dto) {
        Task updated = taskService.updateFromDto(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}