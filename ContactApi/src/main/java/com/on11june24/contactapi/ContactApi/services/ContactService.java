package com.on11june24.contactapi.ContactApi.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Optional;
import java.util.function.BiFunction;
import java.util.function.Function;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.on11june24.contactapi.ContactApi.constant.Constant;
import com.on11june24.contactapi.ContactApi.domain.Contact;
import com.on11june24.contactapi.ContactApi.repository.ContactRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@Transactional(rollbackOn = Exception.class)
@RequiredArgsConstructor
public class ContactService {

	private final ContactRepository contactRepository;

	public Page<Contact> getAllContacts(int page, int size) {
		return contactRepository.findAll(PageRequest.of(page, size, Sort.by("name")));
	}

	public Contact getContact(String id) {
		return contactRepository.findById(id).orElseThrow(() -> new RuntimeException("Contact not found!"));
	}

	public Contact saveContact(Contact contact) {
		return contactRepository.save(contact);
	}

	public void deleteContact(String id) {
		Contact contact = getContact(id);

		String photoUrl = contact.getPhotoUrl();
		String filename = photoUrl.substring(photoUrl.lastIndexOf("/") + 1);

		if (filename.contains("?")) {
		    filename = filename.substring(0, filename.indexOf("?"));
		}

		contactRepository.delete(contact);

		try {
		    Files.deleteIfExists(Paths.get(Constant.PHOTO_DIRECTROY).toAbsolutePath().normalize().resolve(filename));
		} catch (IOException e) {
		    throw new RuntimeException("Photo deletion failed!", e);
		}

	}

	public String uploadPhoto(String id, MultipartFile file) {
		log.info("Saving picture for user ID : {}" , id);
		
		Contact contact = getContact(id);
		String photoUrl = photoFunction.apply(id, file);
		contact.setPhotoUrl(photoUrl);
		contactRepository.save(contact);
		return photoUrl;
	}

	private final Function<String, String> fileExtension = filename -> Optional.of(filename)
			.filter(name -> name.contains(".")).map(name -> "." + name.substring(filename.lastIndexOf(".") + 1))
			.orElse(".png");

	private BiFunction<String, MultipartFile, String> photoFunction = (id, image) -> {
		String filename = id + fileExtension.apply(image.getOriginalFilename());
		try {
			Path fileStorageLocation = Paths.get(Constant.PHOTO_DIRECTROY).toAbsolutePath().normalize();
			if (!Files.exists(fileStorageLocation)) {
				Files.createDirectories(fileStorageLocation);
			}
			Files.copy(image.getInputStream(), fileStorageLocation.resolve(filename),
					StandardCopyOption.REPLACE_EXISTING);
			
			return ServletUriComponentsBuilder
					.fromCurrentContextPath()
					.path("/contacts/image/" + filename)
					.toUriString();
		} catch (IOException e) {
			throw new RuntimeException("Unable to upload image!");
		}
		
	};

}
