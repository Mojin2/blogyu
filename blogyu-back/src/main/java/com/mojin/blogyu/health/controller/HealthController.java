package com.mojin.blogyu.health.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api") // 공통 경로 설정
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        // 성공적으로 응답되면 HTTP 200 OK 상태 코드와 함께 메시지를 반환
        return ResponseEntity.ok("Server is healthy and running!");
    }
}