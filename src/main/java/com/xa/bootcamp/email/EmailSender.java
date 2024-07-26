package com.xa.bootcamp.email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/email")
public class EmailSender {
    @Autowired
    private EmailService emailService;

    @GetMapping("/send/{to}/{subject}/{message}")
    public String sendEmail(
		@PathVariable("to") String to, 
		@PathVariable("subject") String subject, 
		@PathVariable("message") String message
	) {
        emailService.sendSimpleEmail(to, subject, message);
        return "Email sent successfully!";

		/* http://localhost:7000/email/send/shwibowo17@gmail.com/mysubject/mymessage */
    }
}
