# PokerMon V0.1

Pokémon random generator

Inspired by YouTube videos by :
- [QuickGG](https://www.youtube.com/c/QuickGG/)
- [Chilln Play](https://www.youtube.com/c/ChillnPlay/)

The core concept for this V0.1 is ispired by this video : "[1 Truth, 1 Lie, 1 Mystery Pokemon Choice.. Then we FIGHT!](https://www.youtube.com/watch?v=I2JmKxGUkmA)". The goal of this video is to build a team by choosing Pokémons from a set of 3 random ones, but the opponent gets to tell what the choices are. To do so, they must tell the truth for one of the Pokémon, a lie for another one, and the last Pokémon remains a mystery. After choosing among the 3 possibilities, the player can see what their Pokémon really is, including its moves and ability (also randomized). They can keep it in their team or skip it (3 skips in total are allowed), and this operation is repeated until a team of 6 for each trainer is completed.

The V0.1 of PokerMon should allow something similar to that.

## Get informations about Pokémons

The source of informations about species, moves, abilities, etc. used to generate random Pokémons is the [PokéAPI](https://pokeapi.co). Currently, all necessary information (which is a lot !) is retrieved each time you launch PokerMon. The loading time is juste ridiculous right now, so in the future, I would like to greatly reduce it by just storing the minimum information which is required to generate random Pokémon and Moves, and then retrieve further data to display from PokéAPI.

## Generate random Pokémons

The generation process is still work-in-progress. I think many options will be available and I'm currently working on their implementation.

## Make the tool actually usable

I want to make a clean user interface to allow anyone to generate random Pokémons, using all the options I will implement.

## Use the tool to implement the game

The name of the project - PokerMon - would be the name of a game, not the actual generator. The "game" would consist of making a team of 6 Pokémon with various constraints. For a V1, I would like to make something to allow players to reproduce the scenario of QuickGG and ChillnPlay's video : have a set of 3 Pokémon, let their opponent choose from this set and add them or not to the team. The idea would be to generate the Pokémon Showdown's teambuilder import text, so that the team could then easily be used to fight.