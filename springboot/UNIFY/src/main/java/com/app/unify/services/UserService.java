package com.app.unify.services;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.app.unify.dto.global.UserDTO;
import com.app.unify.entities.Role;
import com.app.unify.entities.User;
import com.app.unify.exceptions.UserNotFoundException;
import com.app.unify.mapper.UserMapper;
import com.app.unify.repositories.RoleRepository;
import com.app.unify.repositories.UserRepository;
import com.app.unify.utils.EncryptPasswordUtil;

@Service
@RequiredArgsConstructor
public class UserService {

    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private UserMapper userMapper;

    @Autowired
    public UserService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.roleRepository = roleRepository;
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<UserDTO> findAll(){
        return userRepository.findAll()
                             .stream().map(userMapper::toUserDTO)
                             .collect(Collectors.toList());
    }

    public UserDTO createUser(UserDTO userDto) {
        userDto.setPassword(EncryptPasswordUtil.encryptPassword(userDto.getPassword()));
        Role role = roleRepository.findByName("USER")
                                  .orElseThrow(() -> new RuntimeException("Role not found !"));
        userDto.setRoles(Collections.singleton(role));
        User user = userRepository.save(userMapper.toUser(userDto));
        return userMapper.toUserDTO(user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public UserDTO findById(String id) {
        return userMapper.toUserDTO(userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found !")));
    }

    @PreAuthorize("#userDto.email == authentication.name")
    public UserDTO updateUser(UserDTO userDto) {
        Role role = roleRepository.findByName("USER")
                .orElseThrow(() -> new RuntimeException("Role not found !"));
        userDto.setPassword(userRepository.findById(userDto.getId())
                .orElseThrow(() -> new UserNotFoundException("User not found !")).getPassword());
        userDto.setRoles(Collections.singleton(role));
        User user = userRepository.save(userMapper.toUser(userDto));
        return userMapper.toUserDTO(user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void removeUser(String id){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found !"));
       userRepository.delete(user);
    }

    public UserDTO getMyInfo(){
        var context  = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();
        User user = userRepository.findByEmail(name)
                                  .orElseThrow(() -> new UserNotFoundException("User not found !"));
        return userMapper.toUserDTO(user);
    }

}
