const MarketPlace = artifacts.require("MarketPlace");

contract('register new product tests', async (accounts) => {

	it('should add "kola" as a new product with price 100 wei, quantity 20', async() => {
		let instance = await MarketPlace.deployed();
		await instance.newProduct("kola", 100, 20, {from:accounts[0]});
		let productID = await instance.getProducts.call();
		let newProduct = await instance.getProduct.call(productID[0]);
		assert.equal(newProduct[0], "kola")
		assert.equal(newProduct[1], 100)
		assert.equal(newProduct[2], 20)
	})

	it('should allow only owner to add new product', async() => {
		let instance = await MarketPlace.deployed();
		let hasError = false;
		try {
			await instance.newProduct("fanta", 100, 20, {from:accounts[1]});
		} catch (e) {
			hasError = true;
		}

		assert.equal(hasError, true)
	})

	it('should not allow to add "kola" twice', async() => {
		let instance = await MarketPlace.deployed();
		let hasError = false;
		try {
			await instance.newProduct("kola", 100, 20, {from:accounts[0]});
		} catch (e) {
			hasError = true;
		}

		assert.equal(hasError, true)
	})

	
})


contract('update product tests', async (accounts) => {

	it('slould update the quantity of the "kola" to 10', async() => {
		let instance = await MarketPlace.deployed();
		await instance.newProduct("kola", 100, 20, {from:accounts[0]});
		let productID = await instance.getProducts.call();
		await instance.update(productID[0], 10, {from:accounts[0]});
		let newProduct = await instance.getProduct.call(productID[0]);
		assert.equal(newProduct[0], "kola")
		assert.equal(newProduct[1], 100)
		assert.equal(newProduct[2], 10)
	})

	it('should not allow to update unexisting product', async() => {
		let instance = await MarketPlace.deployed();
		let productID = await instance.getProducts.call();
		let hasError = false;
		try {
			await instance.update(productID[1], 10, {from:accounts[0]});
		} catch (e) {
			hasError = true;
		}

		assert.equal(hasError, true)
	})

	it('should allow only owner to update the product', async() => {
		let instance = await MarketPlace.deployed();
		let hasError = false;
		try {
			await instance.update(productID[0], 10, {from:accounts[1]});
		} catch (e) {
			hasError = true;
		}

		assert.equal(hasError, true)
	})

	it('should increase the price if new quantity is less than 5', async() =>{
		let instance = await MarketPlace.deployed();
		let productID = await instance.getProducts.call();
		await instance.update(productID[0], 3);
		let newProduct = await instance.getProduct.call(productID[0]);
		assert.equal(newProduct[0], "kola")
		assert.equal(newProduct[1], 110)
		assert.equal(newProduct[2], 3)
	})

	it('should restore the price if new quantity more than 5 is added', async() => {
		let instance = await MarketPlace.deployed();
		let productID = await instance.getProducts.call();
		await instance.update(productID[0], 8);
		let newProduct = await instance.getProduct.call(productID[0]);
		assert.equal(newProduct[0], "kola")
		assert.equal(newProduct[1], 100)
		assert.equal(newProduct[2], 8)
	})

	it('should not restore the price if it was not increased', async() => {
		let instance = await MarketPlace.deployed();
		let productID = await instance.getProducts.call();
		await instance.update(productID[0], 10);
		let newProduct = await instance.getProduct.call(productID[0]);
		assert.equal(newProduct[0], "kola")
		assert.equal(newProduct[1], 100)
		assert.equal(newProduct[2], 10)
	})

})

contract('byu product tests', async(accounts) => {

	it('should buy 1 kola for 100 wei', async() => {
		let instance = await MarketPlace.deployed();
		await instance.newProduct("kola", 100, 20, {from:accounts[0]});
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
		let instance = await MarketPlace.deployed();
		let productID = await instance.getProducts.call();
		await instance.buy(productID[0], 2, {value: 200});
		let product = await instance.getProduct.call(productID[0]);
		assert.equal(product[0], "kola")
		assert.equal(product[1], 100)
		assert.equal(product[2], 17)
	})

	it('should not allow to buy 2 kola for 100 wei', async() => {
		let instance = await MarketPlace.deployed();
		let productID = await instance.getProducts.call();
		let hasError = false;
		try {
			await instance.buy(productID[0], 2, {value: 100});
		} catch (e) {
			hasError = true;
		}

		assert.equal(hasError, true)
	})


	it('should not allow to buy more kola than instock', async() => {
		let instance = await MarketPlace.deployed();
		let productID = await instance.getProducts.call();
		let hasError = false;
		try {
			await instance.buy(productID[0], 18, {value: 1800});
		} catch (e) {
			hasError = true;
		}

		assert.equal(hasError, true)
	})

	it('should increase the price with 10 wei when instock less than 5', async() => {
		let instance = await MarketPlace.deployed();
		let productID = await instance.getProducts.call();
		await instance.buy(productID[0], 13, {value: 1300});
		let product = await instance.getProduct.call(productID[0]);
		assert.equal(product[0], "kola")
		assert.equal(product[1], 110)
		assert.equal(product[2], 4)
	})

})

contract('remove product tests', async(accounts) => {

	it('should delete "kola" as a product', async() => {
		let instance = await MarketPlace.deployed();
		await instance.newProduct("kola", 100, 20, {from:accounts[0]});
		let productID = await instance.getProducts.call();
		await instance.removeProduct(productID[0], {from:accounts[0]});
		let productID2 = await instance.getProducts.call();
		let product = await instance.getProduct.call(productID[0]);
		assert.equal(product[0], "")
		assert.equal(product[1], 0)
		assert.equal(product[2], 0)
		assert.equal(productID2.length, 0)
	})

	it('should add "kola", "fanta" and "sprite" and delete "fanta"', async() => {
		let instance = await MarketPlace.deployed();
		await instance.newProduct("kola", 100, 20, {from:accounts[0]});
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
	})

	it('should delete "sprite" too', async() => {
		let instance = await MarketPlace.deployed();
		let productID = await instance.getProducts.call();
		await instance.removeProduct(productID[1], {from:accounts[0]});
		let productID2 = await instance.getProducts.call();
		let product = await instance.getProduct.call(productID2[0]);
		assert.equal(product[0], "kola")
		assert.equal(product[1], 100)
		assert.equal(product[2], 20)
		assert.equal(productID2.length, 1)
	})

	it('should allow only owner to delete product', async() => {
		let instance = await MarketPlace.deployed();
		let productID = await instance.getProducts.call();
		let hasError = false;
		try {
			await instance.removeProduct(productID[0], {from:accounts[1]});
		} catch (e) {
			hasError = true;
		}

		assert.equal(hasError, true)
	})

	it('should allow to add "sprite" and "fanta" again', async() => {
		let instance = await MarketPlace.deployed();
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

	})
})

contract('getPrice tests', async(accounts) => {

	it('the totalPrice for 30 "kola" should be 3000', async() => {
		let instance = await MarketPlace.deployed();
		await instance.newProduct("kola", 100, 5000, {from:accounts[0]});
		let productID = await instance.getProducts.call();
		let totalPrice = await instance.getPrice.call(productID[0], 30);
		let totalPrice_num = totalPrice.toNumber();
		assert.equal(totalPrice_num, 3000)
	})

	it('the totalPrice for 3 "kola" should be 330 because of low quantity', async() => {
		let instance = await MarketPlace.deployed();
		let productID = await instance.getProducts.call();
		await instance.update(productID[0], 3);
		let totalPrice = await instance.getPrice.call(productID[0], 3);
		let totalPrice_num = totalPrice.toNumber();
		assert.equal(totalPrice_num, 330)
	})

	it('should not allow to see the price for more "kola" than instock', async() => {
		let instance = await MarketPlace.deployed();
		let productID = await instance.getProducts.call();
		let hasError = false;
		try {
			await instance.getPrice.call(productID[0], 5, {from:accounts[1]});
		} catch (e) {
			hasError = true;
		}

		assert.equal(hasError, true)
	})
})

contract('withdraw tests', async(accounts) => {

	it('should allow to owner to withdraw the balance', async() => {
		let instance = await MarketPlace.deployed();
		await instance.newProduct("kola", 100, 20, {from:accounts[0]});
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
		let instance = await MarketPlace.deployed();
		await instance.newProduct("fanta", 100, 20, {from:accounts[0]});
		let productID = await instance.getProducts.call();
		await instance.buy(productID[1], 1, {value: 100});
		let hasError = false;
		try {
			await instance.withdraw({from:accounts[1]});
		} catch (e) {
			hasError = true;
		}

		assert.equal(hasError, true)
		
	})
})