/**
 * @author Michael Boyd
 *
 */

/**
* PNG Card Images provided by:
*
* Vectorized Playing Cards 1.3- http://code.google.com/p/vectorized-playing-cards/
* Copyright 2011 - Chris Aguilar
* Licensed under LGPL 3 - www.gnu.org/copyleft/lesser.html
*/

/**
 * Player Object used in CardGame
 */
var Player = function(name,isComp,isDealer){
   this.dealer = false;
   this.hand = [];
   this.giveCards = [];
   this.giveCardsIdxs = [];

   var playerInfo = document.createElement("div");
   playerInfo.className = "playerInfo";
   
   var cardPlayer = document.createElement("div");
   cardPlayer.className = "cardPlayer";
   var playerName = document.createElement("div");
   playerName.className = "playerName";
   playerName.innerHTML = name;
   var playerStatus = document.createElement("div");
   playerStatus.className = "status";
   var playerDealer = document.createElement("div");
   playerDealer.className = "dealer";
   if(!isComp){
      var playerPlay = document.createElement("input");
      playerPlay.className = "playerTurn playerPlay";
      playerPlay.type = "button";
      playerPlay.value = "Play";
      playerPlay.disabled = false;
      var playerPass = document.createElement("input");
      playerPass.className = "playerTurn playerPass";
      playerPass.type = "button";
      playerPass.value = "Pass";
      playerPass.disabled = false;
      this.play = playerPlay;
      this.pass = playerPass;
   }
   if(isDealer){
      $(playerDealer).addClass("Show");
      playerDealer.innerHTML = "D";
      this.dealer = true;
   }

   var currentTurn = document.createElement("div");
   currentTurn.className = "currentTurn";
   currentTurn.innerHTML = "Turn";

   var handStatus = document.createElement("div");
   handStatus.className = "handStatus";
   handStatus.innerHTML = "Passed";

   var trickStatus = document.createElement("div");
   trickStatus.className = "playerTrickStatus";
   trickStatus.innerHTML = "OUT";

   var handContainer = document.createElement("div");
   handContainer.className = "hand";
   var compContainer = document.createElement("div");
   compContainer.className = "compHand";

   this.node = cardPlayer;
   this.info = playerInfo;
   this.name = playerName;
   this.status = playerStatus;
   this.deal = playerDealer;
   this.isComp = isComp;
   this.handContainer = handContainer;
   this.compContainer = compContainer;
   this.turn = currentTurn;
   this.handStatus = handStatus;
   this.trickStatus = trickStatus;
   this.playedCard = false;

   this.passHand = false;
   this.result = -1;

   playerInfo.appendChild(playerName);
   playerInfo.appendChild(playerStatus);
   playerInfo.appendChild(playerDealer);
   playerInfo.appendChild(currentTurn);
   if(!isComp){
      playerInfo.appendChild(playerPlay);
      playerInfo.appendChild(playerPass);
      playerInfo.appendChild(handStatus);
      playerInfo.appendChild(trickStatus);
      cardPlayer.appendChild(playerInfo);
   }
   if(isComp){
      playerInfo.appendChild(handStatus);
      playerInfo.appendChild(trickStatus);
      cardPlayer.appendChild(playerInfo);
      cardPlayer.appendChild(compContainer);
   }
   cardPlayer.appendChild(handContainer);

   var playContainer = document.getElementById("PlayersContainer");
   playContainer.appendChild(cardPlayer);
}

/**
 * Sort players cards in hand after deal
 * Cards sorted in numerical order from 3-10
 * then Jack, Queen, King, Ace, Two
 */
Player.prototype.sortHand = function(){
   this.hand.sort(function(a,b){
      return (a.val - b.val)
   });
}

Player.prototype.getGiveCards = function(isSet){
   var cards = [];
   var cardIdxs = [];
   // Scum and Vice Scum
   if(this.result > 2){
      cards.push(this.hand[this.hand.length-1]);
      cardIdxs.push(this.hand.length-1);
      if(this.result == 4){
         cards.push(this.hand[this.hand.length-2]);
         cardIdxs.splice(0,0,this.hand.length-2);
      }
   }
   // Pres and Vice Pres
   else{
      cards.push(this.hand[0]);
      cardIdxs.push(0);
      if(this.result == 1){
         cards.push(this.hand[1]);
         cardIdxs.push(1);
      }
   }
   if(isSet){
      this.giveCardsIdxs = cardIdxs;
   }
   return cards;
}

Player.prototype.removeDisplayedCards = function(){
   for(var i = 0; i < this.hand.length; i++){
      if(config.debug.mode){
         $(this.hand[i].node).off("click");
         this.handContainer.removeChild(this.hand[i].node);
      }else{
         if(!this.isComp){
            $(this.hand[i].node).off("click");
            this.handContainer.removeChild(this.hand[i].node);
         }
      }
   }
}

/**
 * Displays cards in player's hand
 */
Player.prototype.displayCards = function(){
   for(var i = 0; i < this.hand.length; i++){
      $(this.hand[i].node).addClass("playerCard");
      this.handContainer.appendChild(this.hand[i].node);
      this.attachCardSelect(this.hand[i]);
      /*
      $(this.hand[i].node).click({context: this.hand[i]}, function(e){
         var this_ptr = e.data.context;
         this_ptr.selectCard(this);   
      });
      */
   }
}

Player.prototype.attachCardSelect = function(card){
   $(card.node).click({context: card}, function(e){
      var this_ptr = e.data.context;
      this_ptr.selectCard(this);
   });
}

/**
 * Displays back of card image and counter for computer players
 */
Player.prototype.displayCompCards = function(isStart){
   if(isStart){
      var cardImg = document.createElement("img");
      cardImg.className = "CardImage";
      cardImg.src = "PNG_Cards/Red_Back.png";
      var cardCounter = document.createElement("div");
      cardCounter.className = "CardCounter";
      cardCounter.innerHTML = "x "+this.hand.length;
      this.counter = cardCounter;
      this.compContainer.appendChild(cardImg);
      this.compContainer.appendChild(cardCounter);
   }else{
      this.counter.innerHTML = "x "+this.hand.length;
   }
}

/**
 * Deck object to create cards in deck
 */
var Deck = function(){
   var cardValues = [3,4,5,6,7,8,9,10,11,12,13,14,15];
   var cardSuits = ['clubs','diamonds','hearts','spades'];
   this.cards = [];
   for(var i = 0; i < cardValues.length; i++){
      for(var j = 0; j < cardSuits.length; j++){                             
         this.cards.push(new Card(cardValues[i], cardSuits[j]));             
      }
   }
}

/**
 * Card Object
 */
var Card = function(val, suit){                                              
   this.val = val;                                                         
   this.suit = suit;                                                         
   this.image = ""+val+"_of_"+suit+".png";

   var cardImg = document.createElement("img");
   cardImg.className = "CardImage";
   cardImg.src = "PNG_Cards/"+this.image;
   this.node = cardImg;
   this.isEvent = false;
   
   // Save possibly for multi player, 
   // every card will be played (clicked)
   /*
   $(this.node).click({context: this}, function(e){
      var this_ptr = e.data.context;
      this_ptr.selectCard(this_ptr.node);   
   });
   */
}

/**
 * Card event to toggle selection
 * of card to be played in trick
 */
Card.prototype.selectCard = function(cardImg){
   console.log("select card");
   if($(cardImg).hasClass("selectedCard")){
      $(cardImg).removeClass("selectedCard"); 
   }else{
      $(cardImg).addClass("selectedCard"); 
   }
}
