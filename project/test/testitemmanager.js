const ItemManager = artifacts.require("./ItemManager.sol");

contract("ItemManager", accounts =>{
    it("...should be able to add item.", async ()=>{
        const ItemManagerInstrance = await ItemManager.deployed();

        const itemName = "test1";
        const itemPrice = 500;

        const result = await ItemManagerInstrance.createItem(itemName, itemPrice, {from: accounts[0]});
        assert.equal(result.logs[0].args._itemIndex, 0, "It's not the first item");
        
        const item = await ItemManagerInstrance.items(0);
        assert.equal(item._identifier, itemName, "The identifier was different");

    })
})