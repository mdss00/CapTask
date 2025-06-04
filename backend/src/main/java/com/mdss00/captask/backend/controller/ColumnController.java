package com.mdss00.captask.backend.controller;
import com.mdss00.captask.backend.model.Column;
import com.mdss00.captask.backend.service.ColumnService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/columns")
public class ColumnController {

    @Autowired
    private ColumnService columnService;

    @GetMapping
    public List<Column> getAllColumns() {
        return columnService.getAllColumns();
    }

    @GetMapping("/{id}")
    public Column getColumnById(@PathVariable Long id) {
        return columnService.getColumnById(id);
    }

    @PostMapping
    public Column createColumn(@RequestBody Column column) {
        return columnService.createColumn(column);
    }

    @PutMapping("/{id}")
    public Column updateColumn(@PathVariable Long id, @RequestBody Column column) {
        return columnService.updateColumn(id, column);
    }

    @DeleteMapping("/{id}")
    public void deleteColumn(@PathVariable Long id) {
        columnService.deleteColumn(id);
    }
}

