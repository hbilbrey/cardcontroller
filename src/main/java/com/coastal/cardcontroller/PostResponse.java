package com.coastal.cardcontroller;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class PostResponse implements ResponseObj{

  private String message;

  public PostResponse() {
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  @Override
  public String toString() {
    return "PostResponse{" +
        "messsage='" + message + '\'' +
        '}';
  }
}