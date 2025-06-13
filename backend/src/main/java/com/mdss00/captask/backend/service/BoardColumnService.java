package com.mdss00.captask.backend.service;

import com.mdss00.captask.backend.dto.CreateColumnDto;
import com.mdss00.captask.backend.model.Board;
import com.mdss00.captask.backend.model.BoardColumn;
import com.mdss00.captask.backend.repository.BoardColumnRepository;
import com.mdss00.captask.backend.repository.BoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BoardColumnService {

    @Autowired
    private BoardColumnRepository columnRepository;

    @Autowired
    private BoardRepository boardRepository;

    public List<BoardColumn> getAllColumns() {
        return columnRepository.findAll();
    }

    public BoardColumn getColumnById(Long id) {
        return columnRepository.findById(id).orElse(null);
    }

    public BoardColumn createColumn(BoardColumn column) {
        return columnRepository.save(column);
    }

    @Transactional
    public void deleteColumn(Long columnId) {
        BoardColumn column = columnRepository.findById(columnId)
                .orElseThrow(() -> new RuntimeException("Columna no encontrada"));

        Board board = column.getBoard();
        if (board != null) {
            board.getColumns().remove(column);
            boardRepository.save(board);
        }

        columnRepository.delete(column);
    }

    public BoardColumn updateColumn(Long id, BoardColumn newColumnData) {
        return columnRepository.findById(id)
                .map(column -> {
                    column.setTitle(newColumnData.getTitle());
                    return columnRepository.save(column);
                }).orElse(null);
    }

    public BoardColumn createNewColumn(CreateColumnDto dto) {
        Board board = boardRepository.findById(dto.getBoardId())
                .orElseThrow(() -> new RuntimeException("Board no encontrado"));

        BoardColumn column = new BoardColumn();
        column.setTitle(dto.getTitle());
        column.setBoard(board);

        BoardColumn savedColumn = columnRepository.save(column);

        board.getColumns().add(savedColumn);
        boardRepository.save(board);

        return savedColumn;
    }
}
