// package com.app.unify.config;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.http.client.SimpleClientHttpRequestFactory;
// import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
// import org.springframework.web.client.RestTemplate;

// import com.fasterxml.jackson.databind.DeserializationFeature;
// import com.fasterxml.jackson.databind.ObjectMapper;
// import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

// @Configuration
// public class RestTemplateConfig {
//     @Bean
//     public RestTemplate restTemplate() {
//         // Tạo RestTemplate với timeout
//         SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
//         factory.setConnectTimeout(5000); // 5 giây
//         factory.setReadTimeout(5000); // 5 giây

//         RestTemplate restTemplate = new RestTemplate(factory);

//         // Tạo ObjectMapper với cấu hình tùy chỉnh
//         ObjectMapper objectMapper = new ObjectMapper();
//         objectMapper.registerModule(new JavaTimeModule());
//         objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

//         // Tạo MappingJackson2HttpMessageConverter với ObjectMapper tùy chỉnh
//         MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
//         converter.setObjectMapper(objectMapper);

//         // Thêm converter vào danh sách hiện có
//         restTemplate.getMessageConverters().add(converter);

//         return restTemplate;
//     }
// }