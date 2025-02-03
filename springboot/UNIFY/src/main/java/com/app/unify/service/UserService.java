package com.app.unify.service;

import com.app.unify.dto.UserCreateRequest;
import com.app.unify.entity.User;
import com.app.unify.exceptions.UserNotFoundException;
import com.app.unify.repositories.UserRepository;
import com.app.unify.utils.EncryptPasswordUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User createUser(UserCreateRequest request){
        User user = User.builder()
                        .id(null)
                        .firstName(request.getFirstName())
                        .lastName(request.getLastName())
                        .userName(request.getUserName())
                        .email(request.getUserName())
                        .phone(request.getPhone())
                        .birthDay(request.getBirthDay())
                        .gender(request.getGender())
                        .password(EncryptPasswordUtil.encryptPassword(request.getPassword()))
                        .registeredAt(request.getRegisteredAt())
                        .location(request.getLocation())
                        .education(request.getEducation())
                        .workAt(request.getWorkAt())
                        .build();
        return userRepository.save(user);
    }

    public User findById(String id){
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found !"));
    }
}
