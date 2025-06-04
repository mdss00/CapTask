package com.mdss00.captask.backend.service;

import com.mdss00.captask.backend.model.Column;
import com.mdss00.captask.backend.repository.ColumnRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ColumnService {

    @Autowired
    private ColumnRepository columnRepository;

    public List<Column> getAllColumns() {
        return columnRepository.findAll();
    }

    public Column getColumnById(Long id) {
        return columnRepository.findById(id).orElse(null);
    }

    public Column createColumn(Column column) {
        return columnRepository.save(column);
    }

    public void deleteColumn(Long id) {
        columnRepository.deleteById(id);
    }

    public Column updateColumn(Long id, Column newColumnData) {
        return columnRepository.findById(id)
                .map(column -> {
                    column.setTitle(newColumnData.getTitle());
                    return columnRepository.save(column);
                }).orElse(null);
    }
}
