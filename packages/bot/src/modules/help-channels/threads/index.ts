// Copyright (c) 2021 Siberian, Inc. All rights reserved.
// Use of this source code is governed by the MIT license that can be
// found in the LICENSE file.

import { LunaworkClient, listener, Stage } from '@siberianmh/lunawork'
import {
  Message,
  GuildMember,
  Collection,
  Snowflake,
  ThreadChannel,
  ThreadMember,
} from 'discord.js'
import { guild } from '../../../lib/config'

export class ThreadHelpStage extends Stage {
  public constructor(client: LunaworkClient) {
    super(client)
  }

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

    const createdThread = await msg.channel.threads.create({
      autoArchiveDuration: 1440,
      name: `Help Channel for ${msg.author.username} (${msg.id})`,
      reason: 'Someone want something new',
      startMessage: msg.id,
      type: 'GUILD_PUBLIC_THREAD',
    })

    await createdThread.setLocked(true, 'Should be closed by system')
  }

  // @listener({ event: 'threadMembersUpdate' })
  // public async onThreadMembersUpdate(
  //   _oldMembers: Collection<Snowflake, ThreadMember>,
  //   newMembers: Collection<Snowflake, ThreadMember>,
  // ) {
  //   // Some other thread do this.
  //   const newMembersMap = [...newMembers.values()]
  //   if (newMembersMap[0].thread.parentId !== guild.channels.threadHelpChannel) {
  //     return
  //   }

  //   const channel = await HelpChannel.findOne({
  //     where: { channel_id: newMembersMap[0].thread.id },
  //   })

  //   const member = newMembersMap.find(
  //     (x) => x.guildMember!.id === channel!.user_id,
  //   )

  //   if (!member) {
  //     const roleManger = (
  //       await (
  //         await this.client.guilds.fetch(guild.id)
  //       ).members.fetch(channel!.user_id)
  //     ).roles

  //     await roleManger.remove(guild.roles.helpCooldown)
  //     await channel!.remove()
  //     await newMembersMap[0].thread.setArchived(true, 'User left the thread')
  //   }
  // }
}
