import Tournament from './modules/Tournament.js'

let tournament = new Tournament(
  [
    {
      id: 1,
      name: 'test',
    },
  ],
  {
    test: 'test',
  }
)

console.log(tournament)
