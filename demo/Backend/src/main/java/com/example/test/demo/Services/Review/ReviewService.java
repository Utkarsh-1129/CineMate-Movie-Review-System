package com.example.test.demo.Services.Review;

import com.example.test.demo.Services.Movie.MovieService;
import com.example.test.demo.Schema.Movie;
import com.example.test.demo.Schema.Review;
import com.mongodb.client.result.UpdateResult;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepo repo;

    @Autowired
    private MongoTemplate  mongoTemplate;

    @Autowired
    private MovieService movieService;

    public Review newReview(String body, String imdbId, ObjectId userId, String name) {

        if(userId == null || name.isEmpty()){
            throw new RuntimeException("Login To Continue");
        }

        Review review = repo.insert(new Review(body, userId, name, imdbId));

        UpdateResult result = mongoTemplate.update(Movie.class)
                .matching(Criteria.where("imdbId").is(imdbId))
                .apply(new Update().push("reviewIds").value(review))
                .first();

        if (result.getMatchedCount() == 0) {
            throw new RuntimeException("Movie with given imdbId not found.");
        }
        return review;
    }

    public Optional<List<Review>> findRev(String imdbId){

        Optional<Movie> m = movieService.findByImdb(imdbId);

        if(m.isEmpty()){
            throw new RuntimeException("Movie with given imdbId not found.");
        }

        List<Review> rev = m.get().getReviewIds();

        return Optional.of(rev);
    }

    public ResponseEntity<?> delete(ObjectId id){
        Optional<Review> r = repo.findById(id);

        if(r.isEmpty()){
            throw new RuntimeException("Review with given id not found.");
        }

        String imdbId = r.get().getImdbId();

        repo.deleteById(id);

        UpdateResult result = mongoTemplate.update(Movie.class)
                .matching(Criteria.where("imdbId").is(imdbId))
                .apply(new Update().pull("reviewIds", id))
                .first();

        if (result.getModifiedCount() == 0) {
            return ResponseEntity.ok().body("Review deleted, but not removed from Movie's review list.");
        }

        return ResponseEntity.ok().body("Review Deleted Successfully");
    }
}
