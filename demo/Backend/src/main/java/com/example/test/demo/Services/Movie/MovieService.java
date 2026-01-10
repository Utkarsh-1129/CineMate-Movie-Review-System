package com.example.test.demo.Services.Movie;

import com.example.test.demo.Schema.Movie;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MovieService {

    @Autowired
    private Repo repo;

    public List<Movie> findAll() {
        return repo.findAll();
    }

    public Optional<Movie> findById(ObjectId id) {
        return repo.findById(id);
    }

    public Optional<Movie> findByName(String name) {
        return repo.findByTitle(name);
    }

    public Optional<Movie> findByImdb(String name) {
        return repo.findByImdbId(name);
    }
}
