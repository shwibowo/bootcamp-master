package com.xa.bootcamp.validation;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import jakarta.validation.Valid;

@Controller
@RequestMapping("/user")
public class UserController {

    @GetMapping("/register")
    public ModelAndView showRegistrationForm() {
        ModelAndView view = new ModelAndView("user/register");
        UserModel user = new UserModel();
        view.addObject("user", user);
        return view;
    }

    @PostMapping("/register")
    public String registerUser(@Valid @ModelAttribute("user") UserModel user, BindingResult result, Model model) {
        if (result.hasErrors()) {
            return "user/register";
        }
        model.addAttribute("message", "User registered successfully!");
        return "user/result";
    }

}
