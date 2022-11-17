// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MoviesNFT is ERC721URIStorage {
    uint256 MAX_RATING_COUNT = 100000000000;
    uint256 private movieNumber = 1;
    address private _owner; // owner of the movie NFT

    struct movieData {
        uint256 movieNumber;
        string movieName;
        string movieDescription;
        string release;
        string director;
        string imageURL;
        string ipfsHash;
    }

    struct rating {
        address ratingOwner; // address who made the rating
        uint256 movieNumber; // number of the movie for which the rating is being casted
        uint8 ratingVal; // must be between 1(min rate) and 10(max rate)
        uint256 createdAt; // timestamp of rating
    }

    movieData[] movies;
    rating[] ratings;
    mapping(address => rating) userRating;

    // mapping(uint256 => rating[]) movieRating;
    // mapping(uint256 => uint8) movieRatingAverage;

    constructor(address owner) ERC721("MovieNFT", "MNFT") {
        _owner = owner;
    }

    function createMovieNft(
        string memory name,
        string memory description,
        string memory release,
        string memory director,
        string memory imageURL,
        string memory ipfsHash
    ) public {
        require(msg.sender == _owner);

        movieData memory nextMovie = movieData(
            movieNumber,
            name,
            description,
            release,
            director,
            imageURL,
            ipfsHash
        );

        movies.push(nextMovie);
        _mint(msg.sender, movieNumber);
        _setTokenURI(movieNumber, ipfsHash);
        movieNumber++;
    }

    function getAllMovies() public view returns (movieData[] memory) {
        return movies;
    }

    function getMovieByNumber(uint256 _movieNum)
        public
        view
        returns (
            uint256,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory
        )
    {
        for (uint256 i = 0; i < movieNumber; i++) {
            if (movies[i].movieNumber == _movieNum) {
                return (
                    movies[i].movieNumber,
                    movies[i].movieName,
                    movies[i].movieDescription,
                    movies[i].release,
                    movies[i].director,
                    movies[i].imageURL,
                    movies[i].ipfsHash
                );
            }
        }
        return (0, "", "", "", "", "", "");
    }

    function castMovieRating(uint256 _movieNum, uint8 ratingVal) public {
        rating memory prevRating = userRating[msg.sender];
        require(prevRating.ratingVal <= 0);

        rating memory r = rating(
            msg.sender,
            _movieNum,
            ratingVal,
            block.timestamp
        );

        userRating[msg.sender] = r;
        // rating[] storage prevMovieR = movieRating[movieNum];
        // prevMovieR.push(r);
        // movieRating[movieNum] = prevMovieR;
        ratings.push(r);
    }

    function getAvgMovieRating(uint256 _movieNum) public view returns (uint8) {
        uint256 s = 0;
        uint256 n = 0;
        for (uint256 i = 0; i < ratings.length; i++) {
            if (ratings[i].movieNumber == _movieNum) {
                s = s + ratings[i].ratingVal;
                n++;
            }
        }
        uint8 avg = uint8(s / n);
        return avg;
    }

    // function getMovieRatings(uint256 _movieNum)
    //     public
    //     view
    //     returns (rating[] memory)
    // {
    //     // rating[] memory rs = movieRating[movieNum];
    //     // return rs;
    //     rating[] memory allRs = new rating[](10000000);
    //     for (uint256 i = 0; i < movieNumber; i++) {
    //         if (ratings[i].movieNumber == _movieNum) {
    //             allRs.push(ratings[i]);
    //         }
    //     }
    //     return allRs;
    // }

    function getUserRating(address userAdd)
        public
        view
        returns (bool, rating memory)
    {
        rating memory rs = userRating[userAdd];
        if (rs.ratingVal > 0) {
            return (true, rs);
        }
        return (false, rs);
    }
}
