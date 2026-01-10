package com.example.test.demo.Services.Movie;

import com.example.test.demo.Schema.Movie;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface Repo extends MongoRepository<Movie, ObjectId> {
    Optional<Movie> findByTitle(String title);

    Optional<Movie> findByImdbId(String imdbId);
}
