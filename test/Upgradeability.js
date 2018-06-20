const Proxy = artifacts.require('./Proxy.sol');
const Marketplace = artifacts.require('./Marketplace.sol');
const Marketplace2 = artifacts.require('./Marketplace2.sol');
const IMarketplace = artifacts.require('./IMarketplace.sol');
const IMarketplace2 = artifacts.require('./IMarketplace2.sol');
const expectThrow = require('./util').expectThrow;

contract('Proxy', function (accounts){
    let implementedContract;
    let proxy;
    let marketplace;
    let marketplace2;

    const _owner = accounts[0];
    const _notOwner = accounts[1];

    describe('delegate to first contract', () => {

        beforeEach(async function() {
            marketplace = await Marketplace.new();
            proxy = await Proxy.new(marketplace.address);
            implementedContract = await IMarketplace.at(proxy.address);
            await implementedContract.init();
        });

        it('should be able to operate wiht functions of the first contract', async function() {
            await implementedContract.newProduct("kola", 10, 200, {from:_owner});
            let productID = await implementedContract.getProducts.call();
            let newProduct = await implementedContract.getProduct.call(productID[0]);
		    assert.equal(newProduct[0], "kola")
		    assert.equal(newProduct[1], 10)
		    assert.equal(newProduct[2], 200)
        });

    });

    describe('delegate to second contract', () => {
        beforeEach(async function() {
            marketplace = await Marketplace.new();
            marketplace2 = await Marketplace2.new();
            proxy = await Proxy.new(marketplace.address);
            implementedContract = await IMarketplace.at(proxy.address);
            await implementedContract.init();

            await implementedContract.newProduct("kola", 10, 200, {from:_owner});
        });

        it('should be able to operate with the new added function "increasePrice" of the second contract', async function() {
            await implementedContract.upgradeImplementation(marketplace2.address);
            implementedContract = await IMarketplace2.at(proxy.address);
            let productID = await implementedContract.getProducts.call();
            await implementedContract.increasePrice(productID[0], 20); //new added function; increase the price from 10 to 20
            let newProduct = await implementedContract.getProduct.call(productID[0]);
            assert.equal(newProduct[0], "kola")
		    assert.equal(newProduct[1], 20)
		    assert.equal(newProduct[2], 200)
        });

        // basic library increased the price just with 10 (not %), upgraded library do it with 20 %
        it('should increase price on low quantity based on the new scheme in upgraded product library', async function() {
            let productID = await implementedContract.getProducts.call();
            await implementedContract.update(productID[0], 3, {from: _owner});
            let product = await implementedContract.getProduct(productID[0]);
            let increasedPriceBefore = product[1];

            await implementedContract.update(productID[0], 8, {from: _owner}); //restore the price

            await implementedContract.upgradeImplementation(marketplace2.address);
            implementedContract = await IMarketplace2.at(proxy.address);

            await implementedContract.update(productID[0], 3, {from: _owner});
            product = await implementedContract.getProduct(productID[0]);

            increasePriceAfter = product[1];

            assert.equal(increasedPriceBefore, 20)
            assert.equal(increasePriceAfter, 12)
        });

        it("should work correctly with new added modifier for existing product", async function() {
            await implementedContract.upgradeImplementation(marketplace2.address);
            implementedContract = await IMarketplace2.at(proxy.address);
            
            let productID = await implementedContract.getProducts.call();
            await implementedContract.buy(productID[0], 3, {from:_notOwner, value: 36});
            let product = await implementedContract.getProduct(productID[0]);

            assert.equal(product[2], 197)
        });

        it("should revert if product is not existing", async function() {
            await implementedContract.upgradeImplementation(marketplace2.address);
            implementedContract = await IMarketplace2.at(proxy.address);

            await expectThrow(implementedContract.buy("dhishf23hw", 3, {from:_notOwner, value: 36}))
        });

    });
});