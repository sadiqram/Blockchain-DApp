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
    mapping(string => string) public cardToImage;
    mapping(uint256 => address) internal _ownerOf;
    mapping(address => to uint256[]) private tokenOwnerstoIds;
    mapping(address => uint256) internal _balanceOf;
    mapping(uint256 => address) internal _approvals;
    mapping(address => mapping(address => bool)) public isApprovedForAll;

    constructor(){}

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == contractOwner, "Not the owner");
        _;
    }

    // Events
    event Transfer(address indexed from, address indexed to, uint256 tokenId);
    event Approval(address indexed owner, address indexed buyer, uint256 tokenId);
    event ApprovedForAll(address indexed owner, address indexed operator, bool approved);


    // Probably only admin or owner should mint cards
    function _mintCard(address to, uint256 cardId) internal{
        require(to != address(0), "Invalid address/ mint to zero address");
        require(_ownerOf[cardId] == address(0), "Card already minted");
        _balanceOf[to] ++;
        _ownerOf[id] =  to;
        emit Transfer(address(0), to, id);
    }

    function  listCard(){}

    function buyCard(uint256 cardId) public {
        require(_ownerOf[cardId] != address(0), "Card not minted");
        require(_ownerOf[cardId] != msg.sender, "You already own this card");
        require(listings[cardId].price > 0, "Card not listed for sale");
        require(listings[cardId].price <= msg.value, "Insufficient funds");
        address owner = _ownerOf[cardId];
        uint256 price = listings[cardId].price;
        delete listings[cardId];
        _ownerOf[cardId] = msg.sender;
        _balanceOf[owner] --;
        _balanceOf[msg.sender] ++;
        tokenOwnerstoIds[msg.sender].push(cardId);
        emit Transfer(owner, msg.sender, cardId);
        payable(owner).transfer(price);


    }

    





}