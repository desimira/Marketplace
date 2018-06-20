const Proxy = artifacts.require('./Proxy.sol');
const Marketplace = artifacts.require('./Marketplace.sol');
const IMarketplace = artifacts.require('./IMarketplace.sol');
const expectThrow = require('./util').expectThrow;

contract('register new product tests', async (accounts) => {
	let implementedContract;
    let proxy;
    let marketplace;

    const _owner = accounts[0];
	const _notOwner = accounts[1];
	

	beforeEach(async function() {
		marketplace = await Marketplace.new();
		proxy = await Proxy.new(marketplace.address);
		instance = await IMarketplace.at(proxy.address);
		await instance.init();
	});


	it('should add "kola" as a new product with price 100 wei, quantity 20', async() => {
		await instance.newProduct("kola", 100, 20, {from:accounts[0]});
		let productID = await instance.getProducts.call();
		let newProduct = await instance.getProduct.call(productID[0]);
		assert.equal(newProduct[0], "kola")
		assert.equal(newProduct[1], 100)
		assert.equal(newProduct[2], 20)
	})

	it('should allow only owner to add new product', async() => {
		await expectThrow(instance.newProduct("fanta", 100, 20, {from:_notOwner}));
	})

	it('should not allow to add "kola" twice', async() => {
		await expectThrow(instance.newProduct("fanta", 100, 20, {from:_notOwner}));
	})

	
})


contract('update product tests', async (accounts) => {

	let implementedContract;
    let proxy;
    let marketplace;

    const _owner = accounts[0];
	const _notOwner = accounts[1];

	beforeEach(async function() {
		marketplace = await Marketplace.new();
		proxy = await Proxy.new(marketplace.address);
		instance = await IMarketplace.at(proxy.address);
		await instance.init();

		await instance.newProduct("kola", 100, 20, {from:accounts[0]});
	});

	it('slould update the quantity of the "kola" to 10', async() => {
		let productID = await instance.getProducts.call();
		await instance.update(productID[0], 10, {from:accounts[0]});
		let newProduct = await instance.getProduct.call(productID[0]);
		assert.equal(newProduct[0], "kola")
		assert.equal(newProduct[1], 100)
		assert.equal(newProduct[2], 10)
	});

	it('should not allow to update unexisting product', async() => {
		await expectThrow(instance.update("jdue85", 10, {from:accounts[0]}));
	});

	it('should allow only owner to update the product', async() => {
		let productID = await instance.getProducts.call();
		await expectThrow(instance.update(productID[0], 10, {from:_notOwner}));
	});

	it('should increase the price if new quantity is less than 5', async() =>{
		let productID = await instance.getProducts.call();
		await instance.update(productID[0], 3);
		let newProduct = await instance.getProduct.call(productID[0]);
		assert.equal(newProduct[0], "kola")
		assert.equal(newProduct[1], 110)
		assert.equal(newProduct[2], 3)
	});

	it('should restore the price if new quantity more than 5 is added', async() => {
		let productID = await instance.getProducts.call();
		await instance.update(productID[0], 8);
		let newProduct = await instance.getProduct.call(productID[0]);
		assert.equal(newProduct[0], "kola")
		assert.equal(newProduct[1], 100)
		assert.equal(newProduct[2], 8)
	});

	it('should not restore the price if it was not increased', async() => {
		let productID = await instance.getProducts.call();
		await instance.update(productID[0], 10);
		let newProduct = await instance.getProduct.call(productID[0]);
		assert.equal(newProduct[0], "kola")
		assert.equal(newProduct[1], 100)
		assert.equal(newProduct[2], 10)
	});

});

contract('byu product tests', async(accounts) => {
	
	let implementedContract;
    let proxy;
    let marketplace;

    const _owner = accounts[0];
	const _notOwner = accounts[1];

	beforeEach(async function() {
		marketplace = await Marketplace.new();
		proxy = await Proxy.new(marketplace.address);
		instance = await IMarketplace.at(proxy.address);
		await instance.init();

		await instance.newProduct("kola", 100, 20, {from:accounts[0]});
	});
	
	it('should buy 1 kola for 100 wei', async() => {
		let productID = await instance.getProducts.call();
		await instance.buy(productID[0], 1, {value: 100});
		let product = await instance.getProduct.call(productID[0]);
		assert.equal(product[0], "kola")
		assert.equal(product[1], 100)
		assert.equal(product[2], 19)
		let balance = await instance.getBalance.call();
		let balance_num = balance.toNumber();
		assert.equal(balance_num, 100)
	})

	it('should buy 2 kola for 200 wei', async() => {
		let productID = await instance.getProducts.call();
		await instance.buy(productID[0], 2, {value: 200});
		let product = await instance.getProduct.call(productID[0]);
		assert.equal(product[0], "kola")
		assert.equal(product[1], 100)
		assert.equal(product[2], 18)
	})

	it('should not allow to buy kola on low price', async() => {
		let productID = await instance.getProducts.call();
		
		await expectThrow(instance.buy(productID[0], 2, {value: 100}));
		
	})


	it('should not allow to buy more kola than instock', async() => {
		let productID = await instance.getProducts.call();
		
		await expectThrow(instance.buy(productID[0], 21, {value: 2100}));
	})

	it('should increase the price with 10 wei when instock less than 5', async() => {
		let productID = await instance.getProducts.call();
		await instance.buy(productID[0], 16, {value: 1600});
		let product = await instance.getProduct.call(productID[0]);
		assert.equal(product[0], "kola")
		assert.equal(product[1], 110)
		assert.equal(product[2], 4)
	})

})

contract('remove product tests', async(accounts) => {

	let implementedContract;
    let proxy;
    let marketplace;

    const _owner = accounts[0];
	const _notOwner = accounts[1];

	beforeEach(async function() {
		marketplace = await Marketplace.new();
		proxy = await Proxy.new(marketplace.address);
		instance = await IMarketplace.at(proxy.address);
		await instance.init();

		await instance.newProduct("kola", 100, 20, {from:accounts[0]});
	});

	it('should delete "kola" as a product', async() => {
		let productID = await instance.getProducts.call();
		await instance.removeProduct(productID[0], {from:accounts[0]});
		let productID2 = await instance.getProducts.call();
		let product = await instance.getProduct.call(productID[0]);
		assert.equal(product[0], "")
		assert.equal(product[1], 0)
		assert.equal(product[2], 0)
		assert.equal(productID2.length, 0)
	})

	it('should add "fanta" and "sprite" and delete "fanta"', async() => {
		await instance.newProduct("fanta", 80, 10, {from:accounts[0]});
		await instance.newProduct("sprite", 650, 28, {from:accounts[0]});
		let productID = await instance.getProducts.call();
		await instance.removeProduct(productID[1], {from:accounts[0]});
		let productID2 = await instance.getProducts.call();
		let product_1 = await instance.getProduct.call(productID2[0]);
		let product_2 = await instance.getProduct.call(productID2[1]);
		assert.equal(product_1[0], "kola")
		assert.equal(product_1[1], 100)
		assert.equal(product_1[2], 20)
		assert.equal(product_2[0], "sprite")
		assert.equal(product_2[1], 650)
		assert.equal(product_2[2], 28)
		assert.equal(productID2.length, 2)
	});

	it('should allow only owner to delete product', async() => {
		let productID = await instance.getProducts.call();
		await expectThrow(instance.removeProduct(productID[0], {from:_notOwner}))
	})

	it('should allow to add "sprite" and "fanta" again', async() => {
		await instance.newProduct("fanta", 80, 10, {from:accounts[0]});
		await instance.newProduct("sprite", 650, 28, {from:accounts[0]});
		let productID = await instance.getProducts.call();
		let product_1 = await instance.getProduct.call(productID[0]);
		let product_2 = await instance.getProduct.call(productID[1]);
		let product_3 = await instance.getProduct.call(productID[2]);
		assert.equal(product_1[0], "kola")
		assert.equal(product_1[1], 100)
		assert.equal(product_1[2], 20)
		assert.equal(product_2[0], "fanta")
		assert.equal(product_2[1], 80)
		assert.equal(product_2[2], 10)
		assert.equal(product_3[0], "sprite")
		assert.equal(product_3[1], 650)
		assert.equal(product_3[2], 28)
		assert.equal(productID.length, 3)
	});
});

contract('getPrice tests', async(accounts) => {

	let implementedContract;
    let proxy;
    let marketplace;

    const _owner = accounts[0];
	const _notOwner = accounts[1];

	beforeEach(async function() {
		marketplace = await Marketplace.new();
		proxy = await Proxy.new(marketplace.address);
		instance = await IMarketplace.at(proxy.address);
		await instance.init();

		await instance.newProduct("kola", 100, 20, {from:accounts[0]});
	});

	it('should count the totalPrice for product', async() => {
		let productID = await instance.getProducts.call();
		let totalPrice = await instance.getPrice.call(productID[0], 20);
		let totalPrice_num = totalPrice.toNumber();
		assert.equal(totalPrice_num, 2000)
	});

	it('should not allow to see the price for more "kola" than instock', async() => {
		let productID = await instance.getProducts.call();
		
		await expectThrow(instance.getPrice.call(productID[0], 25, {from:accounts[1]}));
	});
})

contract('withdraw tests', async(accounts) => {

	let implementedContract;
    let proxy;
    let marketplace;

    const _owner = accounts[0];
	const _notOwner = accounts[1];

	beforeEach(async function() {
		marketplace = await Marketplace.new();
		proxy = await Proxy.new(marketplace.address);
		instance = await IMarketplace.at(proxy.address);
		await instance.init();

		await instance.newProduct("kola", 100, 20, {from:accounts[0]});
	});

	it('should allow to owner to withdraw the balance', async() => {
		let productID = await instance.getProducts.call();
		await instance.buy(productID[0], 1, {value: 100});
		let balance_before = await instance.getBalance.call();
		let balance_before_num = balance_before.toNumber();
		assert.equal(balance_before_num, 100)
		await instance.withdraw({from:accounts[0]});
		let balance = await instance.getBalance.call();
		let balance_num = balance.toNumber();
		assert.equal(balance_num, 0)
	})

	it('should not allow not an owner to withdraw the balance', async() => {
		let productID = await instance.getProducts.call();
		await instance.buy(productID[0], 1, {value: 100});
		
		await expectThrow(instance.withdraw({from:_notOwner}));
	});
});