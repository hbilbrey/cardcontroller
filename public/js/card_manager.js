sessionStorage.setItem('userId', '012345'); //put pre-authenticated user in session

let cardSelectBuilder = "  <ons-select id=\"card-sel\" onchange=\"editSelects(event)\">"; //fairly dumb select builder


//get our user's cards and put them in session for use later
$.get("http://localhost:8080/cardcontrols/cardInfo/" + sessionStorage.getItem('userId'), function(data, status){
    $("#member-greeting").html("Hello, " + data.cardHolder + "! Your available credit cards are listed below.");

    $.each(data.cards, function(index,element){
        data.cards.status = 'Open';
    });

    if(!sessionStorage.getItem('userCards')){
        sessionStorage.setItem('userCards', JSON.stringify(data));
    }
    
    let cardData = JSON.parse(sessionStorage.getItem('userCards'));
    
    $("#cards_loading").remove();

    $.each(cardData.cards, function(index, element) {
        let statusMessage;

        let thisCard = findCard(element);

        if(thisCard.status == 'Locked') {
            statusMessage = "<span style=\"color:rgb(192, 47, 47)\">FROZEN</span>"
        }
        //this is redundant since we set to OPEN at the start of the promise, but good if we had multiple statuses
        else if(thisCard.status == 'Open' || !thisCard.status){ 
            statusMessage = "<span style=\"color:#00a950\">OPEN</span>"   
        }

        $("#card_list").append(`
            <ons-card>
                <h4><ion-icon name="card-outline"></ion-icon> ` + element.cardName + ` </p></h4>
                <ons-row>
                    <ons-col width="50%">Card Number:<br/> ` + element.maskedCardNumber + `
                        <br/><br/>
                    <span id="status-button-`+element.cardId+`"> <ons-button modifier="quiet" onclick="openFreezePage(` + JSON.stringify(element).replace(/'/g, '&apos;').replace(/"/g, '&quot;') + `)">Freeze credit</ons-button></span>
                    </ons-col>
                    <ons-col width="50%">Status:<br/><span id="status-message-`+element.cardId+`"> `+ statusMessage + `</span>
                        <br/><br/>
                    <span> <ons-button id="issue-button-`+element.cardId+`" modifier="quiet" onclick="openReportPage(` + JSON.stringify(element).replace(/'/g, '&apos;').replace(/"/g, '&quot;') + `)">Report an issue</ons-button></span>    
                    </ons-col>
                </ons-row>

            </ons-card>`
        )
        if(thisCard.status == 'Locked'){
            $("#status-button-"+element.cardId).html(`<ons-button modifier="quiet" onclick="openFreezePage(` + JSON.stringify(element).replace(/'/g, '&apos;').replace(/"/g, '&quot;') + `)">Unfreeze credit</ons-button>`);
            $("#issue-button-" +element.cardId).attr("disabled", true);
        }
    });
});

function openReportPage(cardDataElement) {
    let myNavigator = document.querySelector('#myNavigator');

    myNavigator
        .pushPage('issuePage.html', {data: {title: 'Report an Issue'}})
        .then(function() {
            $("#cards_loading").remove();

            $("#report-card").html(`
            <ons-card>
                <ons-row>
                    <ons-col><ion-icon name="card-outline"></ion-icon> ` + cardDataElement.cardName + ` </p></ons-col>
                    <ons-col>(` + cardDataElement.maskedCardNumber + `)</ons-col>                
                </ons-row>

            </ons-card>`);

            let statusType;

            $('ons-radio[name="card-status"]').change(
            function(e){
                if (e.target.checked){
                    $("#report-button").attr("disabled", false);
                    statusType = e.target.value;
                }
                else {
                    $("#report-button").attr("disabled", true);
                }
            });

            $("#report-button").click(() => sendIssueReport(cardDataElement, statusType, $("#card-issue-message").val()));
        });
}

function sendIssueReport(cardDataElement, statusType, reportMessage ){
    let reportBody = JSON.stringify({
        "cardId": cardDataElement.cardId,
        "cardStatus": statusType,
        "comment": reportMessage              
    })

    $.post( "http://localhost:8080/cardcontrols/reportcardissue", reportBody, function( data, status ) {

    }, "json");

    toggleCard(cardDataElement, 'off');
    document.querySelector('#myNavigator').popPage({refresh: true});
}
 
function openFreezePage(cardDataElement) {
  var dialog = document.getElementById('my-alter-dialog');
    if (dialog) {
        updateNotif(cardDataElement);
        dialog.show();
    } else {
        ons.createElement('alter-dialog.html', { append: true })
        .then(function(dialog) {
            updateNotif(cardDataElement);
            dialog.show();
        });
    }
};

//flip messages on alert notif, 
function updateNotif(cardDataElement){
    //always care about these two, DRY
    $('#card-to-alter').html(cardDataElement.maskedCardNumber);
    $("#name-to-alter").html(cardDataElement.cardName);

    if(cardDataElement.status == 'Open' || !cardDataElement.status){
        $('#alter-dialog-title').html("Freeze my card");
        $('#alter-dialog-header').html("You are about to freeze credit for the card ending in the numbers listed below:<br/><br/>")
        $('#alter-dialog-footer').html("Are you sure you wish to freeze this card? You will no longer be able to use it to make transactions.")
        $("#lock-confirm").attr("onclick","toggleCard(" + JSON.stringify(cardDataElement) + ", 'off')");
    }
    else if (cardDataElement.status == 'Locked'){
        $('#alter-dialog-title').html("Unlock my card");
        $('#alter-dialog-header').html("You are about to unlock credit for the card ending in the numbers listed below:<br/><br/>")
        $('#alter-dialog-footer').html("Are you sure you wish to unlock this card? You will enable transactions on the card.")
        $("#lock-confirm").attr("onclick","toggleCard(" + JSON.stringify(cardDataElement) + ", 'on')");
    }
}

function toggleCard(cardDataElement, onoff){
    let postId = cardDataElement.cardId;

    
    let userData = JSON.parse(sessionStorage.getItem('userCards'));
    let thisCard;

    if (onoff == 'off'){
        $.post( "http://localhost:8080/cardcontrols/onoff/" + postId, function( data, status ) {

        //find our card in session to update status. Not great for a lot of cards, but who has more than four or five credit cards?
        $.each(userData.cards, function(index, element){
            if (element.cardId == postId){
                element.status = 'Locked';
                thisCard = element;
                $("#status-button-"+thisCard.cardId).html(`<ons-button modifier="quiet" onclick="openFreezePage(` + JSON.stringify(thisCard).replace(/'/g, '&apos;').replace(/"/g, '&quot;') + `)">Unfreeze credit</ons-button>`);
                $("#status-message-"+thisCard.cardId).html("<span style=\"color:rgb(192, 47, 47)\">FROZEN</span>")
                $("#issue-button-" +thisCard.cardId).prop("disabled", true);
            }
        })

        sessionStorage.setItem('userCards', JSON.stringify(userData)); //update our master json in Session with new 'Locked' status

        if(document.getElementById('my-alter-dialog')){
            hideAlertDialog();
            notify(thisCard);
        }
    });
    }
    else if (onoff == 'on'){
        $.post( "http://localhost:8080/cardcontrols/onoff/" + postId, function( data, status ) {

        //find our card in session to update status. Not great for a lot of cards, but who has more than four or five credit cards?
        $.each(userData.cards, function(index, element){
            if (element.cardId == postId){
                element.status = 'Open';
                thisCard = element;
                $("#status-button-"+thisCard.cardId).html(`<ons-button modifier="quiet" onclick="openFreezePage(` + JSON.stringify(thisCard).replace(/'/g, '&apos;').replace(/"/g, '&quot;') + `)">Freeze credit</ons-button>`);
                $("#status-message-"+thisCard.cardId).html("<span style=\"color:#00a950\">OPEN</span>");
                $("#issue-button-" +thisCard.cardId).prop("disabled", false);
            }
        })

        sessionStorage.setItem('userCards', JSON.stringify(userData)); //update our master json in Session with new 'Locked' status

        if(document.getElementById('my-alter-dialog')){
            hideAlertDialog();
            notify(thisCard);
        }
    });
    }
    else {
        console.log("How'd you get here?");
        hideAlertDialog();
    }
}

var hideAlertDialog = function() {
  document
    .getElementById('my-alter-dialog')
    .hide();
};

function findCard(cardDataElement){
    let userData = JSON.parse(sessionStorage.getItem('userCards'));

    let returnObj = -1;

    $.each(userData.cards, function(index, element){
        if (element.cardId == cardDataElement.cardId){
            returnObj = element;
        }
    })

    return returnObj; //not great error handling for now, but we should always find our card id
}

var notify = function(cardDataElement) {
    if(cardDataElement.status == 'Locked'){
        ons.notification.alert('Your card ending in ' + cardDataElement.maskedCardNumber + ' was successfully frozen');
    }
    else {
        ons.notification.alert('Your card ending in ' + cardDataElement.maskedCardNumber + ' was successfully unlocked');
    }
};