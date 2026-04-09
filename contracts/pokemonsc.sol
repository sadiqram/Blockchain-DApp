//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/utils/Strings.sol"; 
// import "base64-sol/base64.sol"; 
interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

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
    
    IERC20 public yodaToken;
    address public contractOwner;
    uint256 public _nextTokenId;
    uint256 public mintPrice;
    
    struct Card {
        string name;
        uint256 attack;
        uint256 defense;
        uint256 hp;
        uint8 rarity;
        bool Shiny;
    }
    struct Listing {
        uint256 price;
        address seller;
    }
    struct Auction {
        uint256 startingPrice;
        uint256 currentPrice;
        uint256 endTime;
        address highestBidder;
        uint256 highestBid;
        uint256 tokenId ;
        address seller;
        bool active;
        bool ended;
        bool claimed;
        bool refunded;
    }

    mapping(uint256 =>  Card) public cards;
    mapping(uint256 => Listing) public listings;
    mapping(uint256 => Auction) public auctions;
    mapping(string => string) public cardToImage;
    mapping(uint256 => address) internal _ownerOf;
    // mapping(address => uint256[]) private tokenOwnerstoIds;
    mapping(address => uint256) internal _balanceOf;
    mapping(uint256 => address) internal _approvals;
    mapping(address => mapping(address => bool)) public isApprovedForAll;

    constructor(
        address _yodaTokenAddr
        // uint256 mintPrice
    ){
        yodaToken = IERC20(_yodaTokenAddr);
        contractOwner = msg.sender;
    }


    // Modifiers
    modifier onlyTokenOwner(uint256 cardId) {
        require(_ownerOf[cardId] == msg.sender, "Not the owner");
        _;
    }
    modifier cardExists(uint256 cardId) {
        require(_ownerOf[cardId] != address(0), "Card does not exist");
        _;
    }

    // Events
    event Transfer(address indexed from, address indexed to, uint256 tokenId);
    event Approval(address indexed owner, address indexed buyer, uint256 tokenId);
    event ApprovedForAll(address indexed owner, address indexed operator, bool approved);

    event CardMinted(uint256 tokenId, string name, address owner);
    event CardListed(uint256 tokenId, uint256 price, address seller);
    event CardPurchased(uint256 tokenId, address buyer, uint256 price);

    event AuctionStarted(uint256 tokenId, uint256 startingBid, uint256 endTime);
    event NewBid(uint256 tokenId, address bidder, uint256 amount);
    event AuctionEnded(uint256 tokenId, address winner, uint256 amount);


    // Probably only admin or owner should mint cards
    function _mintCard(address to, uint256 cardId) internal{
        require(to != address(0), "Invalid address/ mint to zero address");
        require(_ownerOf[cardId] == address(0), "Card already minted");
        _balanceOf[to] ++;
        _ownerOf[cardId] =  to;
        emit Transfer(address(0), to, cardId);
    }

    function mintCard(
    address to,
    string memory name,
    uint256 attack,
    uint256 defense,
    uint256 hp,
    uint8 rarity,
    bool shiny
    ) public {
        require(msg.sender == contractOwner, "Not contract owner");

        uint256 cardId = _nextTokenId++;

        _mintCard(to, cardId);

        cards[cardId] = Card(name, attack, defense, hp, rarity, shiny);

        emit CardMinted(cardId, name, to);
    }

    function listCard(uint256 cardId, uint256 price) public cardExists(cardId) onlyTokenOwner(cardId) {
        require(price > 0, "Price must be > 0");

        listings[cardId] = Listing({
        price: price,
        seller: msg.sender
        });

        emit CardListed(cardId, price, msg.sender);
    }

    function buyCard(uint256 cardId) public cardExists(cardId) {
        require(_ownerOf[cardId] != address(0), "Card not minted");
    
        Listing memory item = listings[cardId];
    
        require(item.price > 0, "Card not listed");
        require(msg.sender != item.seller, "Cannot buy your own card");
    
        // Transfer Yoda tokens
        bool success = yodaToken.transferFrom(msg.sender, item.seller, item.price);
        require(success, "Yoda transfer failed");
    
        // Transfer ownership
        address seller = item.seller;
    
        _ownerOf[cardId] = msg.sender;
        _balanceOf[seller]--;
        _balanceOf[msg.sender]++;
    
        delete listings[cardId];
    
        emit CardPurchased(cardId, msg.sender, item.price);
        emit Transfer(seller, msg.sender, cardId);
    }

    

}