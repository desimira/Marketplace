var config = {
  "blockchain": {
    "network": "rinkeby",
    "infura_api_key": "XTIF9kIt1kgSOOKclKG0",
  }
};

const providers = ethers.providers;
const nodeProvider = getNodeProvider();

function getNodeProvider() {
	if (config.blockchain.network === 'local') {
		return new providers.JsonRpcProvider("", providers.networks.unspecified);
	}
	return new providers.InfuraProvider(config.blockchain.network, config.blockchain.infura_api_key);
}


var contractInstance;
let blockNumber;

window.onload = async function(){
	if (typeof web3 === 'undefined') {
		displayMessage("Error! Are you sure that you are using Metamask?");
	} else {
		await init();

	// event.watch(function(err, res){
	// 	if(!err){
	// 		var isContains = $('table').text().indexOf(res.args.name) > -1;
	// 		if(!isContains){
	// 			$("table tbody").append("<tr><td>" + res.args.name + "</td><td>" + res.args.ID + "</td> <td>" + "<img src=" + "https://ipfs.io/ipfs/" + res.args.picHash +">" + "</a> </td> </tr>")
	// 		}
	// 	}
	// 	else{
	// 		displayMessage(err);
	// 	}
    // })
    
    }
    
}



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
var privateKey = "0x12FF89704509CA185796448B22573012F5671C7F524BC980475FD3D04E8FFB0D"
var acc;

let initWallet = async () => {
    return new ethers.Wallet(privateKey, nodeProvider);
}





async function init(){
    let wallet = await initWallet();
    contractInstance = new ethers.Contract(address, abi, wallet);
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
	
    contractInstance.newProduct(name, price, quantity, picHash);
    
    regNewEevent()
   
};

let regNewEevent = async () => {
    let event = contractInstance.interface.events.LogNewProduct;
   
    await nodeProvider.on(event.topics, function(log){
        const logData = event.parse(log.topics, log.data)
        console.log(logData)

        let name = logData.name.toString();
        let ID = logData.ID.toString();
        let picHash = logData.picHash.toString();

        $("table tbody").append("<tr><td>" + name + "</td><td>" + ID + "</td> <td>" + "<img src=" + "https://ipfs.io/ipfs/" + picHash +">" + "</a> </td> </tr>")

    })

}  


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
