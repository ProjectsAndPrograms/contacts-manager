package com.on11june24.contactapi.ContactApi.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.on11june24.contactapi.ContactApi.domain.Contact;

@Repository
public interface ContactRepository extends JpaRepository<Contact, String> {
	Optional<Contact> findById(String id);
}
