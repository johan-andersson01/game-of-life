# The Game of Life

![](https://github.com/johan-andersson01/game-of-life/blob/master/game-of-life.gif)

Devised by John Conway in 1970, The Game of Life is a [cellular automaton](https://en.wikipedia.org/wiki/Cellular_automaton).

The game is initialized with a random number of alive cells. After this initialization, the game requires no input as its state depends entirely on its previous state. (The process is therefore entirely deterministic, given an initial state)

The game follows 4 rules:

1. Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.
2. Any live cell with two or three live neighbours lives on to the next generation.
3. Any live cell with more than three live neighbours dies, as if by overpopulation.
4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

The game state is represented by a round. Each round, these rules are evaluated based on the state of the previous round. The current round's state is set as described by the rules. The game then continues until no evolution is possible (until the state is static).


See [Wikipedia](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) for more information.
