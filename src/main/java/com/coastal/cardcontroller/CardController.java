package com.coastal.cardcontroller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/cardcontrols")
@CrossOrigin("*")
public class CardController {

    private CardService cardService;

    public CardController(CardService cardService){
        this.cardService = cardService;
    }

    //-------------------------- GET METHODS -----------------------------
	@GetMapping("/cardInfo/{userId}")
	public ResponseEntity<CardInfo> getInfo(@PathVariable String userId) {
        return cardService.getInfo(userId);
    }

    //--------------------------- POST METHODS ---------------------------
    @PostMapping("/reportcardissue")
    public ResponseEntity<PostResponse> reportIssue(ReportIssue issueBody) {
        return cardService.reportIssue(issueBody);
    }

    @PostMapping("/onoff/{cardId}")
    public ResponseEntity<PostResponse> toggleCard(@PathVariable String cardId) {
        return cardService.toggleCard(cardId);
    }
}