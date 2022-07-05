package com.coastal.cardcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
public class CardService {
    private RestTemplate restTemplate;

    @Autowired
    public CardService() {
        this.restTemplate = new RestTemplate();
        header.add("API-key", API_KEY);
    }

    final String API_KEY = "C5F5A63C-E604-47AA-A7CC-B01F95FFBF09";

    final MultiValueMap<String, String> header = new LinkedMultiValueMap<String, String>();

    final String CARD_CONTROLS = "https://anypoint.mulesoft.com/mocking/api/v1/sources/exchange/assets/1a662d35-8008-4343-b811-226e2284646b/appdeveloperinterview/1.0.1/m/cardcontrols";
    final String CARD_INFO = "https://anypoint.mulesoft.com/mocking/api/v1/sources/exchange/assets/1a662d35-8008-4343-b811-226e2284646b/appdeveloperinterview/1.0.1/m/cardInfo";

    // Add a ClientHttpRequestInterceptor to the RestTemplate
    // restTemplate.getInterceptors().add(new ClientHttpRequestInterceptor() {
    // @Override
    // public ClientHttpResponse intercept(HttpRequest request, byte[] body,
    // ClientHttpRequestExecution execution) throws IOException {
    // request.getHeaders().set("API-key", API_KEY); //Set the header for each
    // request
    // return execution.execute(request, body);
    // }
    // });

    public ResponseEntity<CardInfo> getInfo(String cardId) {
        // determine if our response is either the 403 Forbidden { message:
        // "unauthorized" } OR the actual GET response object, then cast the response
        // into the proper object

        HttpHeaders headers = new HttpHeaders();
        headers.set("API-key", API_KEY);

        HttpEntity<Void> requestEntity = new HttpEntity<Void>(headers);

        ResponseEntity<CardInfo> infoResponse = restTemplate.exchange(CARD_INFO + "/" + cardId, HttpMethod.GET, requestEntity, CardInfo.class);


        //this API can't seem to ever 403 or fail out into the "message" JSON objet, but if it did we should probably handle that return here
        return infoResponse;
    }

    public ResponseEntity<PostResponse> toggleCard(String cardId) {
        HttpEntity<Object> httpEntity = new HttpEntity<Object>(null, header);
        ResponseEntity<PostResponse> toggleResponse = restTemplate.postForEntity(CARD_CONTROLS + "/onoff/" + cardId,
                httpEntity, PostResponse.class);

        return toggleResponse;
    }

    public ResponseEntity<PostResponse> reportIssue(ReportIssue issueString) {
        HttpEntity<ReportIssue> httpEntity = new HttpEntity<ReportIssue>(issueString, header);
        ResponseEntity<PostResponse> reportResponse = restTemplate.postForEntity(CARD_CONTROLS + "/reportcardissue",
                httpEntity, PostResponse.class);
        return reportResponse;
    }
}