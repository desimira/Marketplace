window.onload = function(){
	if (typeof web3 === 'undefined') {
		displayMessage("Error! Are you sure that you are using Metamask?");
	} else {
		init();

	var event = contractInstance.LogNewProduct();

	event.watch(function(err, res){
		if(!err){
			var isContains = $('table').text().indexOf(res.args.name) > -1;
			if(!isContains){
				$("table tbody").append("<tr><td>" + res.args.name + "</td><td>" + res.args.ID + "</td> <td>" + "<img src=" + "https://ipfs.io/ipfs/" + res.args.picHash +">" + "</a> </td> </tr>")
			}
		}
		else{
			displayMessage(err);
		}
	})
	}
}

var contractInstance;

var abi = [
  {
    "constant": false,
    "inputs": [
      {
        "name": "_newImpl",
        "type": "address"
      }
    ],
    "name": "upgradeImplementation",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getOwner",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getImplementation",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "init",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "name": "ID",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "name": "picHash",
        "type": "string"
      }
    ],
    "name": "LogNewProduct",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "productName",
        "type": "string"
      },
      {
        "indexed": false,
        "name": "quantity",
        "type": "uint256"
      }
    ],
    "name": "LogPurchase",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "ID",
        "type": "bytes32"
      },
      {
        "name": "quantity",
        "type": "uint256"
      }
    ],
    "name": "buy",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "ID",
        "type": "bytes32"
      },
      {
        "name": "newQuantity",
        "type": "uint256"
      }
    ],
    "name": "update",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "name",
        "type": "string"
      },
      {
        "name": "price",
        "type": "uint256"
      },
      {
        "name": "quantity",
        "type": "uint256"
      },
      {
        "name": "picHash",
        "type": "string"
      }
    ],
    "name": "newProduct",
    "outputs": [
      {
        "name": "",
        "type": "bytes32"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "ID",
        "type": "bytes32"
      }
    ],
    "name": "removeProduct",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "ID",
        "type": "bytes32"
      },
      {
        "name": "newPrice",
        "type": "uint256"
      }
    ],
    "name": "increasePrice",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "ID",
        "type": "bytes32"
      }
    ],
    "name": "getProduct",
    "outputs": [
      {
        "name": "name",
        "type": "string"
      },
      {
        "name": "price",
        "type": "uint256"
      },
      {
        "name": "quantity",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getProducts",
    "outputs": [
      {
        "name": "",
        "type": "bytes32[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "ID",
        "type": "bytes32"
      },
      {
        "name": "quantity",
        "type": "uint256"
      }
    ],
    "name": "getPrice",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getBalance",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
]
var address = "0x5028Afa772110dfC9d4fE234B1Cb29b5805EE651";
var acc;

function init(){
	var Contract = web3.eth.contract(abi);
	contractInstance = Contract.at(address);
	updateAccount();
}

function updateAccount(){
	acc = web3.eth.accounts[0];
}

function displayMessage(message){
	var el = document.getElementById("message");
	el.innerHTML = message;
}


function getInputName(){
	var name = document.getElementById("input_name");
	return name.value;
}

function getInputPrice(){
	var price = document.getElementById("input_price");
	return price.value;
}

function getInputQuantity() {
	var quantity = document.getElementById("input_quantity");
	return quantity.value;
}

function getInputPicHash() {
  var picHash = document.getElementById("pictureHash");
  return picHash.value;
}


function addProductPress(){
	updateAccount();

	var name = getInputName();
	var price = parseInt(getInputPrice());
	var quantity = parseInt(getInputQuantity());
	var picHash = getInputPicHash();
	
	contractInstance.newProduct(name, price, quantity, picHash, {"from": acc}, function(err, res) {
		if(!err){
			displayMessage("New product added! You can see its info in the table above. The transaction hash is: " + res.valueOf());
		} else{
			displayMessage("You couldn't! Are you the owner of the Marketplace? If, yes, check if the product has already been added?", err);
		}
	});
};


function updatePress(){
	updateAccount();
	var name = getInputName();
	var quantity = parseInt(getInputQuantity());
	console.log(name, quantity);	
		
	contractInstance.update(name, quantity, {"from": acc, "gas":100000}, function(err, res){
	if(!err){
		displayMessage("The new quantity of the product is: " + quantity);
	} else {
		console.log(err);
		displayMessage("If you are sure the product exists, check you type its ID correctly? Or maybe you aren't the owner of the MarketPlace?", err);
	}
	});	
};

function getInputID(){
	var name = document.getElementById("input_ID");
	return name.value;
}

function getQuantityToBuy(){
	var quantity = document.getElementById("input_quantity_toBuy")
	return quantity.value;
}

function getValue(){
	var value = document.getElementById("input_money")
	return value.value;
}


function buyProductPress(){
	updateAccount();

	var ID = getInputID();
	var quantity = getQuantityToBuy();
	var value = parseInt(getValue());
	
	contractInstance.buy(ID, quantity, {"from": acc, "value": value}, function(err, res) {
		if(!err){
			displayMessage("Your purchase is successful! The transaction hash is: " + res.valueOf());
		} else {
			displayMessage("Did you put enough money? Check 'GetPrice' button to see the total price.", err);
		}
	});	
};

function getPricePress(){
	updateAccount();

	var ID = getInputID();
	var quantity = getQuantityToBuy();
	
	contractInstance.getPrice.call(ID, quantity, function(err,res){
		if(!err){
			displayMessage("The total price is: " + res.valueOf());
		}
	});
};

function getProductPress(){
	updateAccount();

	var ID = getInputID();
	
	contractInstance.getProduct.call(ID, function(err,res){
		if(!err){
			displayMessage("You see the product name, price and quantity: " + res.valueOf());
		}
	});
};


function getProductsPress(){
	updateAccount();
		
	contractInstance.getProducts.call(function(err, res){
		if(!err){
			displayMessage("The product's IDs are: " + res.valueOf());
		}
	});
};
