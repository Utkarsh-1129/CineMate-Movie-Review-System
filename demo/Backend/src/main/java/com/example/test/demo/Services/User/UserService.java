package com.example.test.demo.Services.User;

import com.example.test.demo.Schema.User;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import static com.example.test.demo.Utility.Util.hashPassword;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    public ResponseEntity<User> newUser(User u) {

        Optional<User> emailchk = userRepo.findByEmail(u.getEmail());
        Optional<User> mobileChk = userRepo.findByMobile(u.getMobile());

        if (emailchk.isPresent() || mobileChk.isPresent()) {
            throw  new RuntimeException("Email Or Mobile already exists");
        }

        User result = userRepo.save(u);
        return ResponseEntity.ok(result);
    }

    public ResponseEntity<List<User>> findAll() {
        return ResponseEntity.ok(userRepo.findAll());
    }

    public ResponseEntity<?> findById(ObjectId id) {
        Optional<User> r = userRepo.findById(id);

        if (r.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User Not Found");
        }

        return ResponseEntity.ok(r);
    }

    public ResponseEntity<?> login(String userId, String password){
        Optional<User> u = userRepo.findByEmail(userId);
        if(u.isEmpty()){
            u = userRepo.findByMobile(userId);
        }
        if(u.isEmpty()){
            throw  new RuntimeException("User not found");
        }

        String pass = u.get().getPassword();

        String hpass = hashPassword(password);

        if(hpass.equals(pass)){
            return ResponseEntity.ok(u);
        }

        throw new RuntimeException("Wrong Password");

    }
}
