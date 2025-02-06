package com.app.unify.service;

import com.app.unify.dto.UserDTO;
import com.app.unify.entity.User;
import com.app.unify.exceptions.UserNotFoundException;
import com.app.unify.mapper.UserMapper;
import com.app.unify.repositories.RoleRepository;
import com.app.unify.repositories.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {


    private UserRepository userRepository;
    private UserMapper userMapper;

    @Autowired
    public UserService(UserRepository userRepository,
                       UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    public List<UserDTO> findAll(){
        return userRepository.findAll()
                             .stream().map(userMapper::toUserDTO)
                             .collect(Collectors.toList());
    }

    public UserDTO createUser(UserDTO userDto) {
        User user = userRepository.save(userMapper.toUser(userDto));
        return userMapper.toUserDTO(user);
    }

    public UserDTO findById(String id) {
        return userMapper.toUserDTO(userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found !")));
    }

    public UserDTO updateUser(UserDTO userDto) {
        User user = userRepository.save(userRepository.findById(userDto.getId())
                .orElseThrow(() -> new UserNotFoundException("User not found !")));
        return userMapper.toUserDTO(user);
    }

    public void removeUser(String id){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found !"));
       userRepository.delete(user);
    }

}
