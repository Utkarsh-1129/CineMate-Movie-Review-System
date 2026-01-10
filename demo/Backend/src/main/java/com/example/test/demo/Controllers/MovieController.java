package com.example.test.demo.Controllers;

import com.example.test.demo.Services.Movie.MovieService;
import com.example.test.demo.Schema.Movie;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    @Autowired
    private MovieService  movieService;

    @GetMapping("/")
    public ResponseEntity<List<Movie>> getMovies() {
        return new ResponseEntity<List<Movie>>(movieService.findAll(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Movie>> getMovieById(@PathVariable ObjectId id) {
        return new ResponseEntity<Optional<Movie>>(movieService.findById(id), HttpStatus.OK);
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<String> getName(@PathVariable ObjectId id) {
        Optional<Movie> movie = movieService.findById(id);

        return movie.map(m -> new ResponseEntity<String>(m.getTitle(), HttpStatus.OK)).orElseGet(()->new ResponseEntity<String>("Movie Not Found", HttpStatus.NOT_FOUND));
    }

    @GetMapping("/findbyname/{name}")
    public ResponseEntity<Optional<Movie>> getMovieByName(@PathVariable String name) {
        return new ResponseEntity<Optional<Movie>>(movieService.findByName(name), HttpStatus.OK);
    }

    @GetMapping("/imdb/{id}")
    public ResponseEntity<?> getMovieByImdbId(@PathVariable String id) {
        Optional<Movie> mov =  movieService.findByImdb(id);

        if (mov.isPresent()) {
            return new ResponseEntity<>(mov.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>("Movie Not Found",HttpStatus.NOT_FOUND);
    }

}
