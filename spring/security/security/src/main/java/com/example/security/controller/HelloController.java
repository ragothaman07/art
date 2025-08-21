package com.example.security.controller;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class HelloController {
    @GetMapping("/")
    public String great(HttpServletRequest request){
        return  "welcome"+ request.getSession().getId();
    }
}
