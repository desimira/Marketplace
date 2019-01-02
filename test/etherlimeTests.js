const etherlime = require('etherlime');
const Proxy = require('../build/Proxy.json');
const Marketplace = require('../build/Marketplace.json');
const IMarketPlace = require('../build/IMarketplace.json');
const ethers = require("ethers");

describe('register new product tests', async () => {
    let deployer;
    let implementedContract;
    let proxy;
    let marketplace;

    const _owner = accounts[0];
    const _notOwner = accounts[1];
    


    before(async function () {
        deployer = new etherlime.EtherlimeGanacheDeployer(_owner.secretKey);
        instance = await deployer.deploy(Marketplace);

        // proxy = await deployer.deploy(Proxy, {}, marketplace.contractAddress);
        // instance = await deployer.wrapDeployedContract(IMarketPlace, proxy.contractAddress);
        await instance.init()
    });


    it('should add "kola" as a new product with price 100 wei, quantity 20', async () => {
        await instance.newProduct("kola", 100, 20);
        let productID = await instance.getProducts();
        let newProduct = await instance.getProduct(productID[0]);
        assert.equal(newProduct[0], "kola")
        assert.equal(newProduct[1], 100)
        assert.equal(newProduct[2], 20)
    })

    it('should allow only owner to add new product', async () => {
        await assert.revert(instance.from(2).newProduct("fanta", 100, 20))
    })

    it('should not allow to add "kola" twice', async () => {
        await assert.revert(instance.newProduct("kola", 100, 20));
    })

    it('should emit event', async() => {
        const expectedEvent = 'LogNewProduct';

        let transaction = await instance.newProduct("kola2", 100, 20);
        
        const transactionReceipt = await instance.verboseWaitForTransaction(transaction);

        let isEmitted = utils.hasEvent(transactionReceipt, instance, expectedEvent);
        assert(isEmitted, 'Event LogNewProduct was not emitted');

        // parse logs
        let logs = utils.parseLogs(transactionReceipt, instance, expectedEvent);
        assert.equal(logs[0].name, "kola2", '"newLime4" was not created');
    });

})


describe('update product tests', async () => {

	let implementedContract;
    let proxy;
    let marketplace;

    const _owner = accounts[0];
	const _notOwner = accounts[1];

    before(async function () {
        deployer = new etherlime.EtherlimeGanacheDeployer(_owner.secretKey);
        instance = await deployer.deploy(Marketplace);

        // proxy = await deployer.deploy(Proxy, {}, marketplace.contractAddress);
        // instance = await deployer.wrapDeployedContract(IMarketPlace, proxy.contractAddress);
        await instance.init()
        await instance.newProduct("kola", 100, 20);
    });

	it('should update the quantity of the "kola" to 10', async() => {
		let productID = await instance.getProducts();
		await instance.update(productID[0], 10);
		let newProduct = await instance.getProduct(productID[0]);
		assert.equal(newProduct[0], "kola")
		assert.equal(newProduct[1].toNumber(), 100)
		assert.equal(newProduct[2].toNumber(), 10)
	});

	it('should not allow to update unexisting product', async() => {
        let unexistingID = "0xea7bd56046d635e21074958ea4488967d9e01376159d9aa60dfea6dddddddddd"
		await assert.revert(instance.update(unexistingID, 10));
	});

	it('should allow only owner to update the product', async() => {
		let productID = await instance.getProducts();
		await assert.revert(instance.from(2).update(productID[0], 10));
	});

	it('should increase the price if new quantity is less than 5', async() =>{
		let productID = await instance.getProducts();
		await instance.update(productID[0], 3);
		let newProduct = await instance.getProduct(productID[0]);
		assert.equal(newProduct[0], "kola")
		assert.equal(newProduct[1], 110)
		assert.equal(newProduct[2], 3)
	});

	it('should restore the price if a new quantity more than 5 is added', async() => {
		let productID = await instance.getProducts();
		await instance.update(productID[0], 8);
		let newProduct = await instance.getProduct(productID[0]);
		assert.equal(newProduct[0], "kola")
		assert.equal(newProduct[1], 100)
		assert.equal(newProduct[2], 8)
	});

	it('should not restore the price if it was not increased', async() => {
		let productID = await instance.getProducts();
		await instance.update(productID[0], 10);
		let newProduct = await instance.getProduct(productID[0]);
		assert.equal(newProduct[0], "kola")
		assert.equal(newProduct[1], 100)
		assert.equal(newProduct[2], 10)
	});

});

describe('byu product tests', async() => {

	let implementedContract;
    let proxy;
    let marketplace;

    const _owner = accounts[0];
	const _notOwner = accounts[1];

	before(async function() {
		deployer = new etherlime.EtherlimeGanacheDeployer(_owner.secretKey);
        instance = await deployer.deploy(Marketplace);

        // proxy = await deployer.deploy(Proxy, {}, marketplace.contractAddress);
        // instance = await deployer.wrapDeployedContract(IMarketPlace, proxy.contractAddress);
        await instance.init()
        await instance.newProduct("kola", 100, 20);
	});

	it('should buy 1 kola for 100 wei', async() => {
		let productID = await instance.getProducts();
		await instance.buy(productID[0], 1, {value: 100});
		let product = await instance.getProduct(productID[0]);
		assert.equal(product[0], "kola")
		assert.equal(product[1], 100)
		assert.equal(product[2], 19)
		let balance = await instance.getBalance();
		let balance_num = balance.toNumber();
		assert.equal(balance_num, 100)
	})

	it('should buy 2 kola for 200 wei', async() => {
		let productID = await instance.getProducts();
		await instance.buy(productID[0], 2, {value: 200});
		let product = await instance.getProduct(productID[0]);
		assert.equal(product[0], "kola")
		assert.equal(product[1], 100)
		assert.equal(product[2], 17)
	})

	it('should not allow to buy kola on low price', async() => {
		let productID = await instance.getProducts();

		await assert.revert(instance.buy(productID[0], 2, {value: 100}));

	})


	it('should not allow to buy more kola than instock', async() => {
		let productID = await instance.getProducts();

		await assert.revert(instance.buy(productID[0], 21, {value: 2100}));
	})

	it('should increase the price with 10 wei when instock is less than 5', async() => {
		let productID = await instance.getProducts();
		await instance.buy(productID[0], 16, {value: 1600});
		let product = await instance.getProduct(productID[0]);
		assert.equal(product[0], "kola")
		assert.equal(product[1], 110)
		assert.equal(product[2], 1)
	})

})

describe('remove product tests', async() => {

	let implementedContract;
    let proxy;
    let marketplace;

    const _owner = accounts[0];
	const _notOwner = accounts[1];

	beforeEach(async function() {
		deployer = new etherlime.EtherlimeGanacheDeployer(_owner.secretKey);
        instance = await deployer.deploy(Marketplace);

        // proxy = await deployer.deploy(Proxy, {}, marketplace.contractAddress);
        // instance = await deployer.wrapDeployedContract(IMarketPlace, proxy.contractAddress);
        await instance.init()
        await instance.newProduct("kola", 100, 20);
	});

	it('should delete "kola" as a product', async() => {
		let productID = await instance.getProducts();
		await instance.removeProduct(productID[0]);
		let productID2 = await instance.getProducts();
		let product = await instance.getProduct(productID[0]);
		assert.equal(product[0], "")
		assert.equal(product[1], 0)
		assert.equal(product[2], 0)
		assert.equal(productID2.length, 0)
	})

	it('should add "fanta" and "sprite" and delete "fanta"', async() => {
		await instance.newProduct("fanta", 80, 10);
		await instance.newProduct("sprite", 650, 28);
		let productID = await instance.getProducts();
		await instance.removeProduct(productID[1]);
		let productID2 = await instance.getProducts();
		let product_1 = await instance.getProduct(productID2[0]);
		let product_2 = await instance.getProduct(productID2[1]);
		assert.equal(product_1[0], "kola")
		assert.equal(product_1[1], 100)
		assert.equal(product_1[2], 20)
		assert.equal(product_2[0], "sprite")
		assert.equal(product_2[1], 650)
		assert.equal(product_2[2], 28)
		assert.equal(productID2.length, 2)
	});

	it('should allow only owner to delete product', async() => {
		let productID = await instance.getProducts();
		await assert.revert(instance.from(2).removeProduct(productID[0]))
	})

	it('should allow to add "sprite" and "fanta" again', async() => {
		await instance.newProduct("fanta", 80, 10);
		await instance.newProduct("sprite", 650, 28);
		let productID = await instance.getProducts();
		let product_1 = await instance.getProduct(productID[0]);
		let product_2 = await instance.getProduct(productID[1]);
		let product_3 = await instance.getProduct(productID[2]);
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

describe('getPrice tests', async() => {

	let implementedContract;
    let proxy;
    let marketplace;

    const _owner = accounts[0];
	const _notOwner = accounts[1];

	beforeEach(async function() {
		deployer = new etherlime.EtherlimeGanacheDeployer(_owner.secretKey);
        instance = await deployer.deploy(Marketplace);

        // proxy = await deployer.deploy(Proxy, {}, marketplace.contractAddress);
        // instance = await deployer.wrapDeployedContract(IMarketPlace, proxy.contractAddress);
        await instance.init()
        await instance.newProduct("kola", 100, 20);
	});

	it('should count the totalPrice for product', async() => {
		let productID = await instance.getProducts();
		let totalPrice = await instance.getPrice(productID[0], 20);
		let totalPrice_num = totalPrice.toNumber();
		assert.equal(totalPrice_num, 2000)
	});

	it('should not allow to see the price for more "kola" than instock', async() => {
		let productID = await instance.getProducts();

		await assert.revert(instance.getPrice(productID[0], 25));
	});
})

