package com.mdss00.captask.backend.controller;
import com.mdss00.captask.backend.dto.CreateColumnDto;
import com.mdss00.captask.backend.model.BoardColumn;
import com.mdss00.captask.backend.service.BoardColumnService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/columns")
@CrossOrigin(origins = "http://localhost:4200")
public class BoardColumnController {

    @Autowired
    private BoardColumnService columnService;

    @GetMapping
    public List<BoardColumn> getAllColumns() {
        return columnService.getAllColumns();
    }

    @GetMapping("/{id}")
    public BoardColumn getColumnById(@PathVariable Long id) {
        return columnService.getColumnById(id);
    }

    @PostMapping
    public ResponseEntity<BoardColumn> createColumn(@RequestBody CreateColumnDto dto) {
        BoardColumn column = columnService.createNewColumn(dto);
        return ResponseEntity.ok(column);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BoardColumn> updateColumn(@PathVariable Long id, @RequestBody BoardColumn column) {
        BoardColumn columna = columnService.updateColumn(id, column);
        return ResponseEntity.ok(columna);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteColumn(@PathVariable Long id) {
        columnService.deleteColumn(id);
        return ResponseEntity.ok().build();
    }
}

