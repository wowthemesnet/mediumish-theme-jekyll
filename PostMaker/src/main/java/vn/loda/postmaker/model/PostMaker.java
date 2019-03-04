/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package vn.loda.postmaker.model;

import java.io.Serializable;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *
 * @author namhn
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostMaker implements Serializable {

    private String id;
    private String title;
    private String author;
    private List<String> categories;
    private String image;
    private String description;
    private boolean featured;
    private boolean hidden;
    private float rating;

    public PostMaker(String author) {
        this.author = author;
        this.id = author + System.currentTimeMillis();
    }

}
