// package com.app.unify.services;

// import java.time.LocalDateTime;
// import java.time.format.DateTimeFormatter;
// import java.util.Collections;
// import java.util.HashMap;
// import java.util.List;
// import java.util.Map;
// import java.util.stream.Collectors;

// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.beans.factory.annotation.Qualifier;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.core.ParameterizedTypeReference;
// import org.springframework.http.HttpEntity;
// import org.springframework.http.HttpHeaders;
// import org.springframework.http.HttpMethod;
// import org.springframework.http.ResponseEntity;
// import org.springframework.stereotype.Service;
// import org.springframework.web.client.HttpClientErrorException;
// import org.springframework.web.client.HttpServerErrorException;
// import org.springframework.web.client.RestTemplate;

// import com.app.unify.dto.global.NotificationDTO;
// import com.app.unify.entities.Notification;
// import com.app.unify.mapper.NotificationMapper;

// @Service
// public class SupabaseServiceImpl implements SupabaseService {

//     private static final Logger logger = LoggerFactory.getLogger(SupabaseServiceImpl.class);

//     @Autowired
//     @Qualifier("restTemplate")
//     private RestTemplate restTemplate;

//     @Autowired
//     private NotificationMapper notificationMapper;

//     private final String supabaseUrl;
//     private final String supabaseKey;

//     public SupabaseServiceImpl(
//             @Value("${supabase.url}") String supabaseUrl,
//             @Value("${supabase.key}") String supabaseKey) {
//         this.supabaseUrl = supabaseUrl;
//         this.supabaseKey = supabaseKey;
//     }

//     private HttpHeaders createHeaders() {
//         HttpHeaders headers = new HttpHeaders();
//         headers.set("apikey", supabaseKey);
//         headers.set("Authorization", "Bearer " + supabaseKey);
//         headers.set("Content-Type", "application/json");
//         logger.info("Headers: Authorization={}", "Bearer " + supabaseKey);
//         return headers;
//     }

//     @Override
//     public void sendNotification(NotificationDTO notificationDTO) {
//         if (notificationDTO == null || notificationDTO.getUserId() == null || notificationDTO.getType() == null) {
//             throw new IllegalArgumentException("NotificationDTO, userId, and type must not be null");
//         }
//         try {
//             String url = supabaseUrl + "/rest/v1/notifications";
//             Map<String, Object> data = new HashMap<>();
//             data.put("user_id", notificationDTO.getUserId());
//             data.put("type", notificationDTO.getType());
//             data.put("sender_id", notificationDTO.getSenderId());
//             data.put("related_entity_id", notificationDTO.getRelatedEntityId());
//             data.put("related_entity_type", notificationDTO.getRelatedEntityType());
//             data.put("is_read", false); // Giá trị mặc định
//             data.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

//             HttpEntity<Map<String, Object>> request = new HttpEntity<>(data, createHeaders());
//             restTemplate.postForObject(url, request, String.class);
//         } catch (HttpClientErrorException | HttpServerErrorException e) {
//             throw new RuntimeException("HTTP Error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
//         } catch (Exception e) {
//             throw new RuntimeException("Failed to send notification: " + e.getMessage());
//         }
//     }

//     @Override
//     public List<NotificationDTO> getNotificationsByUserId(String userId) {
//         if (userId == null || userId.trim().isEmpty()) {
//             throw new IllegalArgumentException("userId must not be null or empty");
//         }
//         try {
//             String selectedColumns = "id,user_id,type,timestamp,is_read"; // Specify the columns you want to fetch
//             String url = supabaseUrl + "/rest/v1/notifications?user_id=eq." + userId +
//                     "&select=" + selectedColumns + "&order=timestamp.desc";
//             logger.info("Fetching notifications for userId: {}", userId);
//             logger.info("Request URL: {}", url);

//             HttpEntity<String> request = new HttpEntity<>(createHeaders());
//             ResponseEntity<List<Notification>> response = restTemplate.exchange(
//                     url, HttpMethod.GET, request, new ParameterizedTypeReference<List<Notification>>() {
//                     });

//             if (response == null || response.getBody() == null) {
//                 logger.warn("Response or response body is null for userId: {}", userId);
//                 return Collections.emptyList();
//             }

//             logger.info("Raw Response: {}", response);
//             logger.info("Response Body: {}", response.getBody());

//             return response.getBody()
//                     .stream()
//                     .map(notificationMapper::toNotificationDTO)
//                     .collect(Collectors.toList());
//         } catch (HttpClientErrorException | HttpServerErrorException e) {
//             logger.error("HTTP Error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
//             throw new RuntimeException("HTTP Error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
//         } catch (Exception e) {
//             logger.error("Failed to fetch notifications: {}", e.getMessage());
//             throw new RuntimeException("Failed to fetch notifications: " + e.getMessage());
//         }
//     }

//     @Override
//     public void markNotificationAsRead(Long notificationId, String userId) {
//         try {
//             String url = supabaseUrl + "/rest/v1/notifications?id=eq." + notificationId +
//                     "&user_id=eq." + userId;
//             Map<String, Object> updates = new HashMap<>();
//             updates.put("is_read", true);

//             HttpEntity<Map<String, Object>> request = new HttpEntity<>(updates,
//                     createHeaders());
//             restTemplate.patchForObject(url, request, String.class);
//         } catch (HttpClientErrorException | HttpServerErrorException e) {
//             throw new RuntimeException("HTTP Error: " + e.getStatusCode() + " - " +
//                     e.getResponseBodyAsString());
//         } catch (Exception e) {
//             throw new RuntimeException("Failed to mark notification as read: " +
//                     e.getMessage());
//         }
//     }

//     @Override
//     public void markAllNotificationsAsRead(String userId) {
//         try {
//             String url = supabaseUrl + "/rest/v1/notifications?user_id=eq." + userId;
//             Map<String, Object> updates = new HashMap<>();
//             updates.put("is_read", true);

//             HttpEntity<Map<String, Object>> request = new HttpEntity<>(updates,
//                     createHeaders());
//             restTemplate.patchForObject(url, request, String.class);
//         } catch (HttpClientErrorException | HttpServerErrorException e) {
//             throw new RuntimeException("HTTP Error: " + e.getStatusCode() + " - " +
//                     e.getResponseBodyAsString());
//         } catch (Exception e) {
//             throw new RuntimeException("Failed to mark all notifications as read: " +
//                     e.getMessage());
//         }
//     }
// }
