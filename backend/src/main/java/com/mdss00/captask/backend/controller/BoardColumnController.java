package com.mdss00.captask.backend.controller;
import com.mdss00.captask.backend.model.BoardColumn;
import com.mdss00.captask.backend.service.BoardColumnService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/columns")
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
    public BoardColumn createColumn(@RequestBody BoardColumn column) {
        return columnService.createColumn(column);
    }

    @PutMapping("/{id}")
    public BoardColumn updateColumn(@PathVariable Long id, @RequestBody BoardColumn column) {
        return columnService.updateColumn(id, column);
    }

    @DeleteMapping("/{id}")
    public void deleteColumn(@PathVariable Long id) {
        columnService.deleteColumn(id);
    }
}

