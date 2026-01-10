package com.example.test.demo.Controllers;

import com.example.test.demo.Services.Review.ReviewService;
import com.example.test.demo.Schema.Review;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/review")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping("/")
    public ResponseEntity<?> createReview(@RequestBody Map<String,String> req,
                                          @CookieValue(value = "user_id", required = false) String id,
                                          @CookieValue(value = "name", required = false) String name){
        try{
            String imdbId = req.getOrDefault("imdbId","");
            String body = req.getOrDefault("body","");

            if(imdbId.isEmpty() || body.isEmpty()){
                throw new RuntimeException("Provide Comment");
            }

            if(id == null || id.isEmpty() || name == null || name.isEmpty()){
                throw new RuntimeException("Login To Continue");
            }

            String decodedId = URLDecoder.decode(id, StandardCharsets.UTF_8);
            String decodedName = URLDecoder.decode(name, StandardCharsets.UTF_8);

            ObjectId userId = new ObjectId(decodedId);

            Review saved = reviewService.newReview(body, imdbId, userId, decodedName);
            return new ResponseEntity<>(saved, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/viewreview")
    public ResponseEntity<?> viewReview(@RequestBody Map<String,String> req){
        try{
            String imdbId = req.getOrDefault("imdbId","");
            if(imdbId == null || imdbId.isEmpty()){
                throw new RuntimeException("Provide IMDB");
            }

            Optional<List<Review>> r = reviewService.findRev(imdbId);

            return ResponseEntity.status(HttpStatus.OK).body(r);
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }

    }

    @GetMapping("/delete")
    public ResponseEntity<?> deleteReview(@RequestBody Map<String,String> req){
        try{
            String id = req.getOrDefault("id","");

            if(id == null || id.isEmpty()){
                throw new RuntimeException("Provide ID");
            }

            ObjectId revId = new ObjectId(id);

            ResponseEntity<?> res = reviewService.delete(revId);

            return ResponseEntity.status(HttpStatus.OK).body(res);
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

}
