const moviesNft = artifacts.require("MoviesNFT");
const raterVerfier = artifacts.require("RaterVerifier");

const moviesNftOwner = "0xf4267F20B463421D2cF3db534491b7920F79Ac4F";

module.exports = async function (deployer) {
    await deployer.deploy(moviesNft, moviesNftOwner).then(function (resp) {
        console.log("Movies NFT Contract Deployed at: ", resp.address);

        // deployer.deploy(raterVerfier, resp.address).then(function (resp2) {
        //     console.log("RaterVerifier Contract Deployed at: ", resp2.address);
        // });
    });
};