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
        uint256 attack;
        uint256 defense;
        uint256 hp;
        uint8 rarity;
        bool Shiny;
    }
    struct Listing {
        price;
        address;
    }
    struct Auction {

    }

    mapping(uint256 =>  Card) public cards;

    // Probably only admin or owner should mint cards
    function _mintCard(address to, uint256 cardId) internal{
        require(to != address(0), "Invalid address/ mint to zero address");
        require(_ownerOf[cardId] == address(0), "Card already minted");
        _balanceOf[to] ++;
        _ownerOf[id] =  to;
        emit Transfer(address(0), to, id);
    }

    function  listCard()

    function buyCard()






}