// Copyright (c) 2021 Siberian, Inc. All rights reserved.
// Use of this source code is governed by the MIT license that can be
// found in the LICENSE file.

import { LunaworkClient, listener, Stage } from '@siberianmh/lunawork'
import { Message, ThreadChannel } from 'discord.js'
import { guild } from '../../../lib/config'

/**
 * Module for moderating and automating help threads.
 */
export class ThreadHelpStage extends Stage {
  public constructor(client: LunaworkClient) {
    super(client)
  }

  /**
   * Whenever a message is sent in the help channel, the bot
   * creates a thread for the user.
   * @param msg
   */
  @listener({ event: 'messageCreate' })
  public async onNewQuestion(msg: Message) {
    if (
      msg.author.bot ||
      !msg.guild ||
      !msg.member ||
      msg.channel.type !== 'GUILD_TEXT' ||
      msg.channel.id !== guild.channels.threadHelpChannel
    ) {
      return
    }

    await msg.channel.threads.create({
      autoArchiveDuration: 1440,
      name: `Help: ${msg.author.username}`,
      reason: `Help thread for user ${msg.author.username}`,
      startMessage: msg.id,
      type: 'GUILD_PUBLIC_THREAD',
    })
  }

  /**
   * Invites all `Helper` role users to any new thread.
   * @param thread
   */
  @listener({ event: 'threadCreate' })
  public async onNewThread(thread: ThreadChannel) {
    if (!thread.guild || thread.parentId !== guild.channels.threadHelpChannel) {
      return
    }
    thread.send(
      `👋 Hey there, thanks for using our help thread system! Looping in the <@&${guild.roles.helper}> role.`,
    )
  }
}
