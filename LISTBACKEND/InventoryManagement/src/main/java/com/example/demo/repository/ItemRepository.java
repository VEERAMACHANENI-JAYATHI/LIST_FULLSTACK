package com.example.demo.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.entity.Item;

@Repository
public interface ItemRepository extends JpaRepository<Item, Integer> {
	
}

