package com.mdss00.captask.backend.service;
import com.mdss00.captask.backend.model.Board;
import com.mdss00.captask.backend.model.User;
import com.mdss00.captask.backend.repository.BoardRepository;
import com.mdss00.captask.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class BoardService {

    private final UserRepository userRepository;

    private final BoardRepository boardRepository;

    public BoardService(UserRepository userRepository, BoardRepository boardRepository) {
        this.userRepository = userRepository;
        this.boardRepository = boardRepository;
    }

    public List<Board> findAll() {
        return boardRepository.findAll();
    }

    public Board findById(Long id) {
        return boardRepository.findById(id).orElse(null);
    }

    public Board save(Board board) {
        return boardRepository.save(board);
    }

    public void deleteById(Long id) {
        boardRepository.deleteById(id);
    }

    public Set<Board> getBoardsByUserEmail(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        assert user != null;
        return user.getBoards();
    }
}
