// Copyright (c) 2021 Siberian, Inc. All rights reserved.
// Use of this source code is governed by the MIT license that can be
// found in the LICENSE file.

import {
  LunaworkClient,
  listener,
  Stage,
  applicationCommand,
  ApplicationCommandOptionType,
} from '@siberianmh/lunawork'
import {
  CommandInteraction,
  Message,
  Snowflake,
  ThreadChannel,
  User,
} from 'discord.js'
import { guild } from '../../lib/config'
import { activeThreadEmbed } from './embed-active-thread'

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
    if (!isHelpThread(thread)) {
      return
    }
    thread.send(
      [
        `👋 Hey there, thanks for using our help thread system!`,
        `Looping in the <@&${guild.roles.helper}> role.`,
        `To rename this thread, use the \`/helpthread title\` command.`,
        `When you're done, use the \`/helpthread archive\` command to archive this channel.`,
      ].join(' '),
    )
  }

  @applicationCommand({
    description: 'Modify the current help thread',
    options: [
      {
        name: 'title',
        description: 'Change your thread title',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            type: ApplicationCommandOptionType.String,
            name: 'newtitle',
            description: 'Your new thread title',
            required: true,
          },
        ],
      },
      {
        name: 'archive',
        description: 'Archive your thread',
        type: ApplicationCommandOptionType.Subcommand,
      },
    ],
  })
  async helpthread(
    msg: CommandInteraction,
    { subCommand }: { subCommand: string },
  ) {
    const { channel } = msg

    // only allow usage of command on help threads
    if (channel?.isThread() && isHelpThread(channel)) {
      const originalPost = await channel.fetchStarterMessage()
      const threadAuthor = originalPost.author

      // only allow usage
      if (msg.user.id === threadAuthor.id) {
        switch (subCommand) {
          case 'title':
            const newTitle = msg.options.getString('newtitle')
            if (typeof newTitle === 'string' && newTitle.length > 0) {
              await channel.setName(newTitle)
              return msg.reply({
                content: 'I set your channel name!',
                ephemeral: true,
              })
            } else {
              return msg.reply({
                content: ':warning: Failed to new set channel name.',
                ephemeral: true,
              })
            }
          case 'archive':
            await msg.reply(
              `Archiving thread on <@${threadAuthor.id}>'s request. Thanks for using the help thread system!`,
            )
            await channel.setArchived(true, 'Thread closed by OP.')
            return
        }
      } else {
        return msg.reply({
          content: ':warning: You have to be the asker to modify this thread.',
          ephemeral: true,
        })
      }
    } else {
      return msg.reply({
        content:
          ':warning: `/helpthread` commands must be run within a help thread.',
        ephemeral: true,
      })
    }
  }
}

/**
 * Displays a list of active threads in a rich
 * embed in the designated channel.
 */
export class ActiveThreadListStage extends Stage {
  private threads: Map<Snowflake, ThreadChannel>
  public constructor(client: LunaworkClient) {
    super(client)
  }

  @listener({ event: 'ready' })
  public async onReady() {
    await this.syncActiveThreads()
  }

  @listener({ event: 'threadCreate' })
  public async onCreateThread(thread: ThreadChannel) {
    if (isHelpThread(thread)) {
      await this.syncActiveThreads()
    }
  }

  @listener({ event: 'threadDelete' })
  public async onDeleteThread(thread: ThreadChannel) {
    if (isHelpThread(thread)) {
      await this.syncActiveThreads()
    }
  }

  @listener({ event: 'threadUpdate' })
  public async onThreadUpdate(before: ThreadChannel, after: ThreadChannel) {
    // We only care about archival state here because changing the thread name
    // has no effect on our embed.
    const archiveStateChanged =
      (!before.archived && after.archived) ||
      (before.archived && !after.archived)
    if (isHelpThread(after) && archiveStateChanged) {
      await this.syncActiveThreads()
    }
  }

  /**
   * Fetches the list of active threads in the Help Thread channel
   * and saves it to the `threads` property. Then, attempts to update
   * the embed with the right information.
   */
  private syncActiveThreads = async () => {
    const server = await this.client.guilds.fetch(guild.id)
    const { threads } = await server.channels.fetchActiveThreads()

    for (const [k, v] of threads.entries()) {
      if (!isHelpThread(v)) {
        threads.delete(k)
      }
    }

    this.threads = threads

    const listChannel = await server.channels.fetch(
      guild.channels.activeThreadsChannel,
    )

    if (listChannel?.isText()) {
      const messages = await listChannel.messages.fetch()
      const latest = messages.first()
      if (latest) {
        await latest.edit({ embeds: [activeThreadEmbed(this.threads)] })
      } else {
        await listChannel.send({ embeds: [activeThreadEmbed(this.threads)] })
      }
    }
  }
}

const isHelpThread = (thread: ThreadChannel) => {
  return (
    thread.isThread() && thread.parentId === guild.channels.threadHelpChannel
  )
}
