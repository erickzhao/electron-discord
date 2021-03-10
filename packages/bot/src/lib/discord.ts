import CookiecordClient from 'cookiecord'
import { Intents } from 'discord.js'

export const client = new CookiecordClient(
  {
    prefix: ['!', 'e!', '.'],
  },
  {
    ws: { intents: Intents.ALL },
    partials: ['REACTION', 'MESSAGE', 'USER', 'CHANNEL'],
  },
)
