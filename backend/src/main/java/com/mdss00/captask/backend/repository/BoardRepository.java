package com.mdss00.captask.backend.repository;
import com.mdss00.captask.backend.model.Board;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardRepository extends JpaRepository<Board, Long> {

}