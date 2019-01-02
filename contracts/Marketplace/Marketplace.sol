pragma solidity ^0.4.23;
import '../Upgradeability/OwnableUpgradeableImplementation.sol';
import './SafeMath.sol';
import './ProductLib.sol';
import './Icontracts/IMarketplace.sol';


contract Marketplace is IMarketplace, OwnableUpgradeableImplementation {
    using SafeMath for uint;
    using ProductLib for ProductLib.Product;
    
    // event LogNewProduct(string name, bytes32 ID);
    // event LogPurchase(string productName, uint quantity);
    

    mapping (bytes32 => ProductLib.Product) stock;
    bytes32[] allProductsID;

    function buy(bytes32 ID, uint quantity) public payable {
        require(stock[ID].canBeBought(msg.value, quantity));
        require(stock[ID].productExist());
        stock[ID].buyProduct(quantity);

        emit LogPurchase(stock[ID].name, quantity);
        
        //increase the price if stock scarcity
        updatePrice(ID, stock[ID].quantity);
    }
    
    function update(bytes32 ID, uint newQuantity) public onlyOwner {
        require(stock[ID].productExist());
        
        stock[ID].quantity = newQuantity;
        
        //increase or restore the price
        updatePrice(ID, newQuantity);
    }
    
    function updatePrice(bytes32 ID, uint newQuantity) internal {
        if(newQuantity <= 5 && !stock[ID].wasIncreased){
            stock[ID].wasIncreased = true;
            stock[ID].increasePriceOnLowQuantity();
        }
        if(newQuantity > 5 && stock[ID].wasIncreased){
            stock[ID].wasIncreased = false;
            stock[ID].restorePrice();
        }
    }
    
    //creates a new product and returns its ID
    function newProduct(string name, uint price, uint quantity) public onlyOwner returns(bytes32) {
        bytes32 ID = keccak256(name);// the ID is the hash of product name
        require(!stock[ID].productExist());
        allProductsID.push(ID);//add the ID to the array

        stock[ID] = ProductLib.regNewProduct(name, price, quantity, allProductsID.length-1, false);
        
        emit LogNewProduct(name, ID);
        assert(stock[ID].quantity == quantity);
        return ID;
    }
    
    function removeProduct(bytes32 ID) public onlyOwner {
        require(stock[ID].productExist());
        stock[ID].removeProduct();
        
        //remove the productID from the array
        uint index = stock[ID].IDindex;//take the index of the ID
        delete allProductsID[index];//delete the ID with certain index
        //to fill the gap, take the last value of the array
        //and store it at the index of the deleted ID
        allProductsID[index] = allProductsID[allProductsID.length-1];
        stock[allProductsID[allProductsID.length-1]].IDindex = index;
        allProductsID.length--; //remove the last value and index
    }
    
    function getProduct(bytes32 ID) public view returns(string name, uint price, uint quantity) {
        return (stock[ID].name, stock[ID].price, stock[ID].quantity);
    }
    
    function getProducts() public view returns(bytes32[]) {
        return allProductsID;
    }
    
    function getPrice(bytes32 ID, uint quantity) public view returns (uint) {
        require(stock[ID].quantity >= quantity);
        return stock[ID].price.mul(quantity);
    }
    
    function withdraw() public onlyOwner {
        owner.transfer(this.balance);
    }
    
    function getBalance() public view returns (uint){
        return this.balance;
    }
}