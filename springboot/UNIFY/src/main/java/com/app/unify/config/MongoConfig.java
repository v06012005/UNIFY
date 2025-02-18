package com.app.unify.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import com.mongodb.client.MongoClients;

@Configuration
@EnableMongoRepositories(basePackages = "com.app.unify.repositories")
public class MongoConfig {

	@Value("${spring.data.mongodb.uri}")
	private String connectionConfig;

	@Value("${spring.data.mongodb.database}")
	private String databaseName;

	@Bean
	public MongoTemplate mongoTemplate() {
		return new MongoTemplate(MongoClients.create(connectionConfig), databaseName);
	}

}
