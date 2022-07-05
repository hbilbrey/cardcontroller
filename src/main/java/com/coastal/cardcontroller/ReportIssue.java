package com.coastal.cardcontroller;

/*

{
  "cardId":"012345",
  "cardStatus":"lost",
  "comment":"It was two days ago when I last saw my card, and I cant find it anywhere!"              
}

*/
public class ReportIssue {
    private String cardId;
    private String cardStatus;
    private String comment;

    public ReportIssue() {

    }

    public String getCardId() {
        return cardId;
    }

    public void setCardId(String cardId) {
        this.cardId = cardId;
    }

    public String getCardStatus() {
        return cardStatus;
    }

    public void setCardStatus(String cardStatus) {
        this.cardStatus = cardStatus;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    @Override
    public String toString() {
        return "ReportIssue{" +
                "cardId='" + cardId + '\'' +
                ", cardStatus='" + cardStatus + '\'' +
                "comment='" + comment +
                '}';
    }
}