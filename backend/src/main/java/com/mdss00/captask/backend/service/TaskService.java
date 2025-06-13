package com.mdss00.captask.backend.service;

import com.mdss00.captask.backend.dto.TaskCreateDto;
import com.mdss00.captask.backend.model.BoardColumn;
import com.mdss00.captask.backend.model.Task;
import com.mdss00.captask.backend.repository.BoardColumnRepository;
import com.mdss00.captask.backend.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private final TaskRepository repository;

    @Autowired
    private final BoardColumnRepository columnRepository;

    public TaskService(TaskRepository repository, BoardColumnRepository columnRepository) {
        this.repository = repository;
        this.columnRepository = columnRepository;
    }

    public List<Task> getAllTasks() {
        return repository.findAll();
    }

    public Task createTask(Task task) {

        return repository.save(task);
    }

    @Transactional
    public Task updateTask(Long id, Task updatedTask) {
        Optional<Task> optionalTask = repository.findById(id);
        if (optionalTask.isEmpty()) {
            throw new RuntimeException("Tarea no encontrada con ID: " + id);
        }

        Task existingTask = optionalTask.get();

        existingTask.setTitle(updatedTask.getTitle());
        existingTask.setDescription(updatedTask.getDescription());
        existingTask.setPriority(updatedTask.getPriority());
        existingTask.setColumn(updatedTask.getColumn());

        // Si estás usando 'status' como String
        existingTask.setStatus(updatedTask.getStatus());

        // Si usas columnId (mejor práctica)
        if (updatedTask.getColumn() != null && updatedTask.getColumn().getId() != null) {
            BoardColumn column = columnRepository.findById(updatedTask.getColumn().getId())
                    .orElseThrow(() -> new RuntimeException("Columna no encontrada"));
            existingTask.setColumn(column);
        }

        return repository.save(existingTask);
    }

    public Task updateTaskColumn(Long taskId, Long columnId) {
        Task task = repository.findById(taskId)
                .orElse(null);

        BoardColumn newColumn = columnRepository.findById(columnId)
                .orElse(null);

        BoardColumn oldColumn = task.getColumn();

        if (oldColumn != null) {
            oldColumn.getTasks().remove(task);  // Quitar tarea de la columna antigua
        }

        task.setColumn(newColumn);
        newColumn.getTasks().add(task);        // Añadir tarea a la nueva columna

        return repository.save(task);
    }

    public Task updateFromDto(Long id, TaskCreateDto dto) {
        Task task = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));

        task.setTitle(dto.getTitle());
        task.setStatus(dto.getStatus());
        task.setPriority(dto.getPriority());
        task.setDescription(dto.getDescription());

        if (dto.getColumn() != null) {
            BoardColumn column = columnRepository.findById(dto.getColumn())
                    .orElseThrow(() -> new RuntimeException("Columna no encontrada"));
            task.setColumn(column);
        }

        return repository.save(task);
    }

    public void deleteTask(Long id) {
        repository.deleteById(id);
    }
}
