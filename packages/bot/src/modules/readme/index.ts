// Copyright (c) 2021 Siberian, Inc. All rights reserved.
// Use of this source code is governed by the MIT license that can be
// found in the LICENSE file.

import { LunaworkClient, listener, Stage } from '@siberianmh/lunawork'
import { Snowflake, MessageEmbed } from 'discord.js'
import { guild } from '../../lib/config'
import { getRulesEmbed } from './embed-rules'
import { getHelpEmbed } from './embed-asking-for-help'

/**
 * Syncs basic text README files to specific channels.
 * Currently only supports single embeds.
 */
export class ReadmeStage extends Stage {
  public constructor(client: LunaworkClient) {
    super(client)
  }

  @listener({ event: 'ready' })
  public async onReady() {
    await this.syncReadme(guild.channels.askHelpChannel, getHelpEmbed())
    await this.syncReadme(guild.channels.rules, getRulesEmbed())
  }

  private async syncReadme(channelId: Snowflake, embed: MessageEmbed) {
    const server = await this.client.guilds.fetch(guild.id)
    const channel = await server.channels.fetch(channelId)

    if (channel?.isText()) {
      const messages = await channel.messages.fetch()
      const latest = messages.first()
      const payload = { embeds: [embed] }

      if (latest && !latest.embeds[0].equals(embed)) {
        // if we're the author, edit it
        if (latest.author.bot) {
          await latest.edit(payload)
        } else {
          // otherwise, clear channel and send new message
          await channel.bulkDelete(50)
          await channel.send(payload)
        }
      } else if (!latest) {
        // if no latest message exists, send one
        await channel.send(payload)
      }
    }
  }
}
