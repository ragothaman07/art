package com.example.security.controller;

import com.example.security.model.Student;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class StudentController {

    private List<Student> students=new ArrayList<>(List.of(new Student(1,"rago",100),
            new Student(2,"rag",100)));
    @GetMapping("/students")
    public List<Student> getStudents(){
        return students;
    }
}
