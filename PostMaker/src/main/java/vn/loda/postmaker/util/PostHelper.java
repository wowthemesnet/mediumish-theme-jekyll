package vn.loda.postmaker.util;

import java.text.Normalizer;
import org.apache.commons.lang3.StringUtils;

public class PostHelper {

  public static String normalize(String title) {
    return Normalizer.normalize(title, Normalizer.Form.NFD).replaceAll("\\s+", " ").trim();
  }

  public static String removeAccents(String title){
    return StringUtils.stripAccents(title.replaceAll(" ", "-"))
        .replace('đ', 'd').replace('Đ', 'D');
  }

  public static String normalizeImagePath(String image){
    String normalized = image;
    if(normalized.startsWith("../")) normalized = normalized.replaceFirst("../","");
    if(normalized.startsWith("./")) normalized = normalized.replaceFirst("./","");
    return normalized;
  }


}
