package com.app.unify.controllers;

import com.app.unify.dto.global.GroupDTO;
import com.app.unify.dto.global.GroupMemberDTO;
import com.app.unify.services.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/groups")
public class GroupController {
    @Autowired
    private GroupService groupService;

    @PostMapping
    public GroupDTO createGroup(@RequestBody GroupDTO groupDTO, @RequestParam String ownerId) {
        return groupService.createGroup(groupDTO, ownerId);
    }

    @PutMapping("/{groupId}")
    public GroupDTO updateGroup(@PathVariable String groupId, @RequestBody GroupDTO groupDTO) {
        return groupService.updateGroup(groupId, groupDTO);
    }

    @DeleteMapping("/{groupId}")
    public void deleteGroup(@PathVariable String groupId) {
        groupService.deleteGroup(groupId);
    }

    @GetMapping("/{groupId}")
    public GroupDTO getGroup(@PathVariable String groupId) {
        return groupService.getGroup(groupId);
    }

    @GetMapping
    public List<GroupDTO> getAllGroups() {
        return groupService.getAllGroups();
    }

    @PostMapping("/{groupId}/join")
    public GroupMemberDTO joinGroup(@PathVariable String groupId, @RequestParam String userId) {
        return groupService.joinGroup(groupId, userId);
    }
    
    @GetMapping("/my-groups")
    public List<GroupDTO> getMyGroups() {
        return groupService.getGroupsByCurrentUser();
    }
} 