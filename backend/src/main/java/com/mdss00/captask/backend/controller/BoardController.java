package com.mdss00.captask.backend.controller;
import com.mdss00.captask.backend.dto.BoardDto;
import com.mdss00.captask.backend.model.Board;
import com.mdss00.captask.backend.service.BoardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/boards")
@CrossOrigin(origins = "http://localhost:4200")
public class BoardController {

    private final BoardService boardService;

    public BoardController(BoardService boardService) {
        this.boardService = boardService;
    }

    @GetMapping
    public List<Board> getAllBoards() {
        return boardService.findAll();
    }

    @GetMapping("/{id}")
    public Board getBoardById(@PathVariable Long id) {
        return boardService.findById(id);
    }

    @PostMapping
    public ResponseEntity<Board> createBoard(@RequestBody BoardDto request) {
        Board board = boardService.createBoardForUser(
                request.getEmail(),
                request.getTitulo(),
                request.getBitacora()
        );
        return ResponseEntity.ok(board);
    }

    @GetMapping("/user/{email}")
    public ResponseEntity<?> getBoardsByUserEmail(@PathVariable String email) {
        Set<Board> boards = boardService.getBoardsByUserEmail(email);
        System.out.println(email);
        return ResponseEntity.ok(boards);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBoard(
            @PathVariable Long id,
            @RequestParam String email) {
        boardService.deleteBoardForUser(email, id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Board> updateBoardTitle(@PathVariable Long id, @RequestBody String nuevoTitulo) {
        Board updatedBoard = boardService.updateBoardTitle(id, nuevoTitulo);
        return ResponseEntity.ok(updatedBoard);
    }
}
