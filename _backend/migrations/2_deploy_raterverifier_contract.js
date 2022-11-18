
const raterVerfier = artifacts.require("RaterVerifier");

module.exports = async function (deployer) {
    var moviesAddr = "0x328856f632FB526000E1eD170CBD16e4931d570b";
    await deployer.deploy(raterVerfier, moviesAddr).then(function (resp2) {
        console.log("RaterVerifier Contract Deployed at: ", resp2.address);
    });

};