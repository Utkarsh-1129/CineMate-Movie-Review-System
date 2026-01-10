package com.example.test.demo.Controllers;

import com.example.test.demo.Services.User.UserRepo;
import com.example.test.demo.Services.User.UserService;
import com.example.test.demo.Schema.User;
import jakarta.servlet.http.HttpServletResponse;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.Optional;

import static com.example.test.demo.Utility.Util.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private UserRepo userRepo;

    @PostMapping("/signin")
    public ResponseEntity<?> createUser(@RequestBody Map<String,String> req, HttpServletResponse res){
        try {
            String name = req.get("name");
            String email = req.get("email");
            String mobile = req.get("mobile");
            String password = req.get("password");
            String confirmPassword = req.get("confirmPassword");

            if (name == null || name.isBlank() ||
                    email == null || email.isBlank() ||
                    mobile == null || mobile.isBlank() ||
                    password == null || password.isBlank() ||
                    confirmPassword == null || confirmPassword.isBlank()) {
                throw new RuntimeException("All fields (name, email, mobile, password, confirmPassword) are required");
            }

            if(!password.equals(confirmPassword)){
                throw new RuntimeException("Passwords do not match");
            }

            String hpassword = hashPassword(password);

            User newUser = new User(name, mobile, email, hpassword);
            ResponseEntity<User> result = userService.newUser(newUser);

            assert result.getBody() != null;

            addCookie(res, "user_id", result.getBody().getId().toString());
            addCookie(res, "name", result.getBody().getName());
            addCookie(res, "email", result.getBody().getEmail());
            addCookie(res, "mobile", result.getBody().getMobile());

            return ResponseEntity.ok(Map.of(
                    "message", "User created successfully",
                    "user", result.getBody()
            ));

        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/data")
    public ResponseEntity<?> getUsers(@CookieValue(value = "user_id", required = false) String id,
                                      HttpServletResponse res){
        try {
            String userId = id != null ? URLDecoder.decode(id, StandardCharsets.UTF_8) : "";

            if(userId.isEmpty()){
                throw new RuntimeException("User not found");
            }

            ObjectId uid = new ObjectId(userId);
            Optional<User> optionalUser = userService.findById(uid).getBody() instanceof Optional
                    ? (Optional<User>) userService.findById(uid).getBody()
                    : Optional.empty();

            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found in database"));
            }

            User user = optionalUser.get();

            // Refresh cookies (optional logic)
            addCookie(res, "user_id", user.getId().toString());
            addCookie(res, "name", user.getName());
            addCookie(res, "email", user.getEmail());
            addCookie(res, "mobile", user.getMobile());

            return  ResponseEntity.ok(user);
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }

    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String,String> req, HttpServletResponse res){
        try{
            String userId = req.getOrDefault("userId", "");
            String password = req.getOrDefault("password", "");

            if(userId.isEmpty() || password.isEmpty()){
                throw new RuntimeException("All  fields (userId, password) are required");
            }

            Optional<User> optionalUser = userService.login(userId,password).getBody() instanceof Optional
                    ? (Optional<User>) userService.login(userId,password).getBody()
                    : Optional.empty();

            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found in database"));
            }

            User user = optionalUser.get();

            // Refresh cookies (optional logic)
            addCookie(res, "user_id", user.getId().toString());
            addCookie(res, "name", user.getName());
            addCookie(res, "email", user.getEmail());
            addCookie(res, "mobile", user.getMobile());

            return ResponseEntity.ok(Map.of(
                    "message", "User Login successfully",
                    "user", user
            ));

        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse res){
        try{
            clearCookie(res, "user_id");
            clearCookie(res, "name");
            clearCookie(res, "email");
            clearCookie(res, "mobile");

            return ResponseEntity.ok(Map.of("message", "User successfully logged out"));
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }
}
