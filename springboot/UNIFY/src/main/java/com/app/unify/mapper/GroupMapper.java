package com.app.unify.mapper;

import com.app.unify.entities.Group;
import com.app.unify.entities.GroupMember;
import com.app.unify.dto.global.GroupDTO;
import com.app.unify.dto.global.GroupMemberDTO;
import org.mapstruct.*;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface GroupMapper {
    GroupDTO toGroupDTO(Group group);

    Group toGroupEntity(GroupDTO dto);

    GroupMemberDTO toGroupMemberDTO(GroupMember member);
} 