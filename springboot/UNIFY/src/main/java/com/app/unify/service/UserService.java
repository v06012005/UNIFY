package com.app.unify.service;

import com.app.unify.dto.UserCreateRequest;
import com.app.unify.entity.Role;
import com.app.unify.entity.User;
import com.app.unify.exceptions.UserNotFoundException;
import com.app.unify.repositories.RoleRepository;
import com.app.unify.repositories.UserRepository;
import com.app.unify.utils.EncryptPasswordUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Service
public class UserService {


    private UserRepository userRepository;
    private RoleRepository roleRepository;

    @Autowired
    public UserService(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    public List<User> findAll(){
        return userRepository.findAll();
    }

    public User createUser(UserCreateRequest request) {
        User user = User.builder()
                .id(null)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .username(request.getUserName())
                .email(request.getUserName())
                .phone(request.getPhone())
                .birthDay(request.getBirthDay())
                .gender(request.getGender())
                .password(EncryptPasswordUtil.encryptPassword(request.getPassword()))
                .registeredAt(request.getRegisteredAt())
                .location(request.getLocation())
                .education(request.getEducation())
                .workAt(request.getWorkAt())
                .status(request.getStatus())
                .roles(Collections.singleton(roleRepository.findByName("USER").orElse(null)))
                .build();
        return userRepository.save(user);
    }

    public User findById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found !"));
    }

    public User updateUser(UserCreateRequest request) {
        User user = userRepository.findById(request.getId())
                .orElseThrow(() -> new UserNotFoundException("User not found !"));

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setUsername(request.getUserName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setBirthDay(request.getBirthDay());
        user.setGender(request.getGender());
        user.setPassword(EncryptPasswordUtil.encryptPassword(request.getPassword()));
        user.setRegisteredAt(request.getRegisteredAt());
        user.setLocation(request.getLocation());
        user.setEducation(request.getEducation());
        user.setWorkAt(request.getWorkAt());
        user.setStatus(request.getStatus());

        return userRepository.save(user);
    }

    public void removeUser(String id){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found !"));
       userRepository.delete(user);
    }

}
