package com.devlearn.repository;

import com.devlearn.model.Summary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * Summary Repository
 * Database operations for Summary entity
 *
 * @author Anudari Ganbaatar (12327086)
 */
@Repository
public interface SummaryRepository extends JpaRepository<Summary, Long> {

    Optional<Summary> findByDocumentId(Long documentId);
}