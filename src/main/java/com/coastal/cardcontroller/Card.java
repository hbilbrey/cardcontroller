package com.coastal.cardcontroller;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Card {

  private String cardId;
  private String cardName;
  private String maskedCardNumber;

  public Card() {
  }

  public String getCardId() {
    return this.cardId;
  }

  public String getCardName() {
    return this.cardName;
  }

  public String getMaskedCardNumber() {
      return this.maskedCardNumber;
  }

  public void setCardId(String cardId){
      this.cardId = cardId;
  }

  public void setCardName(String cardName){
      this.cardName = cardName;
  }

  public void setMaskedCardNumber(String maskedCardNumber) {
      this.maskedCardNumber = maskedCardNumber;
  }

  @Override
  public String toString() {
    return "Card{" +
        "cardId='" + cardId + '\'' +
        ", cardName='" + cardName + '\'' +
        ", maskedCardNumber='" + maskedCardNumber + '\'' +
        '}';
  }
}