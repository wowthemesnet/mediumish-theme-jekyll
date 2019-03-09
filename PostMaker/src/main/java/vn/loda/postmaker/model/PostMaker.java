/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package vn.loda.postmaker.model;

import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import org.apache.commons.lang3.StringUtils;
import vn.loda.postmaker.util.PostHelper;

/**
 * @author namhn
 */
@Data
@Builder
@AllArgsConstructor
@Accessors(chain = true, fluent = true)
public class PostMaker implements Serializable {

  private String id;
  private String title;
  private String author;
  private String[] categories;
  private String image;
  private String description;
  private boolean featured;
  private boolean hidden;
  private float rating;

  public PostMaker() {
    this.id = "loda" + System.currentTimeMillis();
  }

  private static final String NEW_LINE = "\n";

  public String getHeader() {
    StringBuilder sb = new StringBuilder();
    sb.append("---").append(NEW_LINE)
        .append("id: ").append(id).append(NEW_LINE)
        .append("layout: post").append(NEW_LINE)
        .append("title: ").append(title).append(NEW_LINE)
        .append("author: ").append(author).append(NEW_LINE)
        .append("categories: ").append(categoriesToString()).append(NEW_LINE)
        .append("image: ").append(image).append(NEW_LINE)
        .append("description: ").append(description).append(NEW_LINE)
        .append("featured: ").append(featured).append(NEW_LINE)
        .append("hidden: ").append(hidden).append(NEW_LINE)
        .append("rating: ").append(rating).append(NEW_LINE)
        .append("---").append(NEW_LINE);
    return sb.toString();
//        title:  "Trợ lý ảo vẫn sẽ là xu hướng công nghệ 2019"
//        author: loda
//        categories: [ Virtual Assistant, Machine Learning, AI ]
//        image: assets/images/loda1551586738/1.jpg
//        description: "Trợ lý ảo (Virtual Assistant) - một cụm từ “hot” được nhắc tới rất nhiều trong khoảng 3 năm trở lại đây. Nó đang tạo ra một cuộc đua ngầm trong thế giới công nghệ."
//        featured: true
//        hidden: true
//        rating: 4.5
  }

  public String getFileName() {
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
    return sdf.format(new Date()) + "-" + PostHelper.removeAccents(title) + ".md";
  }

  public String categoriesToString() {
    StringBuilder sb = new StringBuilder();
    sb.append("[ ");
    for (String str : categories) {
      sb.append(str.trim() + ", ");
    }
    sb.append("]");
    return sb.toString().replace(", ]", " ]");
  }
}
