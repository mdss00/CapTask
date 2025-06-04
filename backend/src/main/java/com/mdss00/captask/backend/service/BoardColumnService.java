package com.mdss00.captask.backend.service;

import com.mdss00.captask.backend.model.BoardColumn;
import com.mdss00.captask.backend.repository.BoardColumnRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BoardColumnService {

    @Autowired
    private BoardColumnRepository columnRepository;

    public List<BoardColumn> getAllColumns() {
        return columnRepository.findAll();
    }

    public BoardColumn getColumnById(Long id) {
        return columnRepository.findById(id).orElse(null);
    }


    public BoardColumn createColumn(BoardColumn column) {
        return columnRepository.save(column);
    }

    public void deleteColumn(Long id) {
        columnRepository.deleteById(id);
    }

    public BoardColumn updateColumn(Long id, BoardColumn newColumnData) {
        return columnRepository.findById(id)
                .map(column -> {
                    column.setTitle(newColumnData.getTitle());
                    return columnRepository.save(column);
                }).orElse(null);
    }
}
