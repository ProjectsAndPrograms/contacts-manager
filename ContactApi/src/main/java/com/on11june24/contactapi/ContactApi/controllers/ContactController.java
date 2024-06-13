package com.on11june24.contactapi.ContactApi.controllers;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.on11june24.contactapi.ContactApi.constant.Constant;
import com.on11june24.contactapi.ContactApi.domain.Contact;
import com.on11june24.contactapi.ContactApi.services.ContactService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/contacts")
@RequiredArgsConstructor
public class ContactController {

	private final ContactService contactService;
	
	@PostMapping
	public ResponseEntity<Contact> createContact(@RequestBody Contact contact){
		return ResponseEntity.created(URI.create("/contacts/userId")).body(contactService.saveContact(contact));
	}
	
	@GetMapping
	public ResponseEntity<Page<Contact>> getContacts(@RequestParam(name="page", defaultValue = "0") int page, 
													 @RequestParam(name="size", defaultValue = "10") int size){
		return ResponseEntity.ok().body(contactService.getAllContacts(page, size));
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Contact> getContact(@PathVariable("id") String id) {
		return ResponseEntity.ok().body(contactService.getContact(id));
	}
	
	@PutMapping("/photo")
	public ResponseEntity<String> uploadPhoto(@RequestParam("id") String id, @RequestParam("file") MultipartFile file){
		return ResponseEntity.ok().body(contactService.uploadPhoto(id, file));
	}
	
	@GetMapping(path = "/image/{filename}", produces = {MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE, MediaType.IMAGE_GIF_VALUE})
	public byte[] getPhoto(@PathVariable("filename") String filename) throws IOException{
		return Files.readAllBytes(Paths.get(Constant.PHOTO_DIRECTROY + filename));
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<Map<String, Object>> deleteGivenContact(@PathVariable("id") String id) {
	    contactService.deleteContact(id);
	    Map<String, Object> map = new HashMap<>();
	    map.put("message", "Contact Deleted Successfully!!");
	    return ResponseEntity.ok(map);
	}

	
	
}
