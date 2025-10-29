package com.devlearn.repository;

import com.devlearn.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Document Repository
 * Database operations for Document entity
 *
 * @author Anudari Ganbaatar (12327086)
 */
@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findByProcessingStatus(String status);

    List<Document> findByFileType(String fileType);
}