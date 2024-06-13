package com.on11june24.contactapi.ContactApi.services;

import org.junit.jupiter.api.Test;

import com.on11june24.contactapi.ContactApi.domain.Contact;

class ContactServiceTest {

	@Test
	void test() {
		Contact contact  = new Contact();
		contact.setPhotoUrl("http://localhost:8080/contacts/image/2d9f5293-fa88-4ad9-895f-0f02febdc4ef.png");
		String photoUrl = contact.getPhotoUrl().substring(contact.getPhotoUrl().lastIndexOf("/") + 1);
		System.out.println(photoUrl);
	}


	
}
