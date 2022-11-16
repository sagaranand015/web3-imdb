
const moviesNft = artifacts.require("MoviesNFT");
const moviesNftOwner = "0xf4267F20B463421D2cF3db534491b7920F79Ac4F";

module.exports = async function (deployer) {
    var moviesAddr = undefined;
    await deployer.deploy(moviesNft, moviesNftOwner).then(function (resp) {
        console.log("Movies NFT Contract Deployed at: ", resp.address);
        moviesAddr = resp.address;
    });

};