package com.app.unify.services;

import com.app.unify.dto.global.GroupDTO;
import com.app.unify.dto.global.GroupMemberDTO;
import com.app.unify.entities.Group;
import com.app.unify.entities.GroupMember;
import com.app.unify.entities.User;
import com.app.unify.repositories.GroupRepository;
import com.app.unify.repositories.GroupMemberRepository;
import com.app.unify.repositories.UserRepository;
import com.app.unify.mapper.GroupMapper;
import com.app.unify.types.GroupMemberRole;
import com.app.unify.types.PrivacyType;
import com.app.unify.types.GroupStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class GroupServiceImpl implements GroupService {
    @Autowired
    private GroupRepository groupRepository;
    @Autowired
    private GroupMemberRepository groupMemberRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private GroupMapper groupMapper;

    @Override
    @Transactional
    public GroupDTO createGroup(GroupDTO groupDTO, String ownerId) {
        Group group = groupMapper.toGroupEntity(groupDTO);
        LocalDateTime now = LocalDateTime.now();
        group.setCreatedAt(now);
        group.setUpdatedAt(now);
        // Set default values if not provided
        if (group.getPrivacyType() == null) {
            group.setPrivacyType(PrivacyType.PUBLIC);
        }
        if (group.getStatus() == null) {
            group.setStatus(GroupStatus.ACTIVE);
        }
        group = groupRepository.save(group);
        User owner = userRepository.findById(ownerId).orElseThrow();
        GroupMember member = new GroupMember();
        member.setGroup(group);
        member.setUser(owner);
        member.setJoinedAt(LocalDateTime.now());
        member.setRole(GroupMemberRole.OWNER);
        groupMemberRepository.save(member);
        return groupMapper.toGroupDTO(group);
    }

    @Override
    public GroupDTO updateGroup(String groupId, GroupDTO groupDTO) {
        Group group = groupRepository.findById(groupId).orElseThrow();
        group.setName(groupDTO.getName());
        group.setPrivacyType(groupDTO.getPrivacyType());
        group.setDescription(groupDTO.getDescription());
        group.setCoverImageUrl(groupDTO.getCoverImageUrl());
        group.setStatus(groupDTO.getStatus());
        group.setUpdatedAt(LocalDateTime.now());
        group = groupRepository.save(group);
        return groupMapper.toGroupDTO(group);
    }

    @Override
    public void deleteGroup(String groupId) {
        groupRepository.deleteById(groupId);
    }

    @Override
    public GroupDTO getGroup(String groupId) {
        Group group = groupRepository.findById(groupId).orElseThrow();
        return groupMapper.toGroupDTO(group);
    }

    @Override
    public List<GroupDTO> getAllGroups() {
        return groupRepository.findAll().stream().map(groupMapper::toGroupDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public GroupMemberDTO joinGroup(String groupId, String userId) {
        Group group = groupRepository.findById(groupId).orElseThrow();
        User user = userRepository.findById(userId).orElseThrow();
        GroupMember member = new GroupMember();
        member.setGroup(group);
        member.setUser(user);
        member.setJoinedAt(LocalDateTime.now());
        member.setRole(GroupMemberRole.MEMBER);
        member = groupMemberRepository.save(member);
        return groupMapper.toGroupMemberDTO(member);
    }
    
    @Override
    public List<GroupDTO> getGroupsByPrivacyType(PrivacyType privacyType) {
        return groupRepository.findByPrivacyType(privacyType)
                .stream()
                .map(groupMapper::toGroupDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<GroupDTO> getGroupsByStatus(GroupStatus status) {
        return groupRepository.findByStatus(status)
                .stream()
                .map(groupMapper::toGroupDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public GroupDTO updateGroupStatus(String groupId, GroupStatus status) {
        Group group = groupRepository.findById(groupId).orElseThrow();
        group.setStatus(status);
        group.setUpdatedAt(LocalDateTime.now());
        group = groupRepository.save(group);
        return groupMapper.toGroupDTO(group);
    }
    
    @Override
    public GroupDTO updateGroupPrivacy(String groupId, PrivacyType privacyType) {
        Group group = groupRepository.findById(groupId).orElseThrow();
        group.setPrivacyType(privacyType);
        group.setUpdatedAt(LocalDateTime.now());
        group = groupRepository.save(group);
        return groupMapper.toGroupDTO(group);
    }
} 