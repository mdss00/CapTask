package com.mdss00.captask.backend.service;
import com.mdss00.captask.backend.model.Board;
import com.mdss00.captask.backend.model.BoardColumn;
import com.mdss00.captask.backend.model.User;
import com.mdss00.captask.backend.repository.BoardRepository;
import com.mdss00.captask.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class BoardService {

    private final UserRepository userRepository;

    private final BoardRepository boardRepository;
    private final BoardColumnService boardColumnService;

    public BoardService(UserRepository userRepository, BoardRepository boardRepository, BoardColumnService boardColumnService) {
        this.userRepository = userRepository;
        this.boardRepository = boardRepository;
        this.boardColumnService = boardColumnService;
    }

    public List<Board> findAll() {
        return boardRepository.findAll();
    }

    public Board findById(Long boardId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("Board not found"));

        if (board.getColumns() == null || board.getColumns().isEmpty()) {
            BoardColumn board1 = new BoardColumn("Por hacer", board);
            boardColumnService.createColumn(board1);
            BoardColumn board2 = new BoardColumn("En progreso", board);
            boardColumnService.createColumn(board1);
            BoardColumn board3 = new BoardColumn("Hecho", board);
            boardColumnService.createColumn(board1);

            board.getColumns().add(board1);
            board.getColumns().add(board2);
            board.getColumns().add(board3);
            boardRepository.save(board);
        }

        return board;
    }

    public Board save(Board board) {
        return boardRepository.save(board);
    }

    public void deleteById(Long id) {
        boardRepository.deleteById(id);
    }

    public Set<Board> getBoardsByUserEmail(String email) {
        System.out.println(email);
        User user = userRepository.findByEmail(email).orElse(null);
        assert user != null;
        return user.getBoards();
    }

    public Board createBoardForUser(String email, String titulo, String bitacora) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con email: " + email));

        Board board = new Board();
        board.setTitulo(titulo);
        board.setBitacora(bitacora);

        board = boardRepository.save(board);

        user.getBoards().add(board);

        userRepository.save(user);
        return board;
    }

    @Transactional
    public void deleteBoardForUser(String email, Long boardId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("Board no encontrado"));

        user.getBoards().remove(board);
        board.getUsers().remove(user);

        userRepository.save(user);
        boardRepository.save(board);

        if (board.getUsers().isEmpty()) {
            boardRepository.delete(board);
        }
    }

    public Board updateBoardTitle(Long id, String nuevoTitulo) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Board no encontrado"));

        board.setTitulo(nuevoTitulo);
        return boardRepository.save(board);
    }

    public void updateBitacora(Long boardId, String nuevaBitacora) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("Board no encontrado con id " + boardId));

        board.setBitacora(nuevaBitacora);
        boardRepository.save(board);
    }
}
