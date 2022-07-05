package com.coastal.cardcontroller;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CardInfo implements ResponseObj{

  private String cardHolder;
  private List<Card> cards = new ArrayList<Card>();

  public CardInfo() {
  }

  public String getCardHolder() {
    return cardHolder;
  }

  public void setCardHolder(String cardHolder) {
    this.cardHolder = cardHolder;
  }

  public List<Card> getCards() {
    return cards;
  }

  public void setCards(List<Card> cards) {
    this.cards = cards;
  }

  @Override
  public String toString() {
    return "CardInfo{" +
        "cardHolder='" + cardHolder + '\'' +
        ", cards=" + cards +
        '}';
  }
}