package com.xa.bootcamp.uploadfile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import jakarta.mail.Multipart;

@Controller
@RequestMapping("/upload")
public class UploadController {

    @GetMapping("")
    public ModelAndView index() {
        ModelAndView view = new ModelAndView("upload/index");
        return view;
    }

    @GetMapping("form")
    public ModelAndView form() {
        ModelAndView view = new ModelAndView("upload/form");
        return view;
    }

	private static String UPLOADED_FOLDER = "/home/shwibowo/Pictures/javaupload/";
    
    @PostMapping("save")
    public ModelAndView upload(@RequestParam("photofile") MultipartFile file) throws Exception {
        ModelAndView view = new ModelAndView("upload/index");
        try {
            if(file.getOriginalFilename() != "") { 
                byte[] bytes = file.getBytes();
                Path path = Paths.get(UPLOADED_FOLDER+file.getOriginalFilename());
                Files.write(path, bytes);
                view.addObject("filename", file.getOriginalFilename());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
		return view;
    }

}
