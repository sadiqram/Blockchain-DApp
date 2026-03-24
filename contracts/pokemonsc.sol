//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;


contract PokemonFTCG {

    // Todo
    /* 
     Implement Structs(Cards)
     Functions
     * Mint Card
     * List Card for sale
     * Track Listings
     * Buy Card
     * Auctions
    
    */

    struct Card {
        string name;
    }
    struct Listing {
        price;
        address;
    }
    struct Auction {
        
    }

    mapping(uint256 =>  Card) public cards;

    // Probably only admin or seller should mint cards
    function mintCard()

    function  listCard()

    function buyCard()






}