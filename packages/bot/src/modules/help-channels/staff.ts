import { LunaworkClient } from '@siberianmh/lunawork'
import { applicationCommand } from '@siberianmh/lunawork'
import {
  Guild,
  Message,
  CommandInteraction,
  GuildMember,
  TextChannel,
  MessageEmbed,
} from 'discord.js'
import { isTrustedMember, noAuthorizedClaim, noDM } from '../../lib/inhibitors'
import { guild } from '../../lib/config'
import * as config from '../../lib/config'
import { HelpChanBase } from './base'
import {
  IGetHelpChanByUserIdResponse,
  IListHelpChannelsRespone,
} from '../../lib/types'
import { availableEmbed } from './embeds/available'
import { helpChannelStatusEmbed } from './embeds/status'
import { Subcommands } from './subcommands'

export class HelpChannelStaff extends HelpChanBase {
  public constructor(client: LunaworkClient) {
    super(client)
  }

  //#region Commands
  @applicationCommand({
    description: 'Claim a someone message into the help channel',
    options: [
      {
        name: 'user',
        description: 'The user itself',
        type: 'USER',
        required: true,
      },
      {
        type: 'NUMBER',
        name: 'limit',
        description:
          'The limit of messages which needed to be claimed (default to 10)',
      },
    ],
    inhibitors: [noAuthorizedClaim, noDM],
  })
  public async claim(
    msg: CommandInteraction,
    member: GuildMember,
    limit?: number,
  ) {
    // Currently it's not possible due to discord limitation
    // ref: https://github.com/discord/discord-api-docs/discussions/3311
    /*
    if (isMessage(msg)) {
      if (msg.reference && msg.reference.messageId) {
        const refMessage = await msg.channel.messages.fetch(
          msg.reference.messageId,
        )
        return this.claimBase({
          msg: refMessage,
          member: refMessage.member!,
          replyClaim: true,
        })
      }
    }
    */

    return await this.claimBase({ msg: msg, member: member, limit })
  }

  @applicationCommand({
    name: 'helpchan',
    description: 'The single command to maintain help channels',
    options: [
      {
        type: 1,
        name: 'status',
        description: 'Get the status of the help channels',
      },
      {
        type: 1,
        name: 'create',
        description: 'Create the help channel',
        options: [
          {
            type: 3,
            name: 'name',
            description: 'The name of the channel, without `help-` prefix',
            required: true,
          },
        ],
      },
      {
        type: 1,
        name: 'update',
        description: 'Update the help channels',
      },
      {
        type: 1,
        name: 'sync',
        description: 'Synchronize the help channels to the current status',
      },
    ],
    inhibitors: [isTrustedMember],
  })
  public async helpchan(
    msg: CommandInteraction,
    baseCommand: Subcommands,
    arg1: string,
  ) {
    switch (baseCommand) {
      case 'status':
        return await this.showStatus(msg)
      case 'create':
        return await this.createChannel(msg, arg1)
      case 'update':
        return await this.updateHelpChannels(msg)
      case 'sync':
        return await this.syncChannels(msg)
      default:
        return msg.reply({ content: 'Uh okay.', ephemeral: true })
    }
  }
  //#endregion

  // List the status of help channels
  private async showStatus(msg: CommandInteraction) {
    const available = msg
      .guild!.channels.cache.filter(
        (channel) => channel.parentId === guild.categories.helpAvailable,
      )
      .filter((channel) => channel.name.startsWith(this.CHANNEL_PREFIX))

    const { data: ongoing } = await this.api.get<IListHelpChannelsRespone>(
      '/helpchan',
    )

    const dormant = msg
      .guild!.channels.cache.filter(
        (channel) => channel.parentId === guild.categories.helpDormant,
      )
      .filter((channel) => channel.name.startsWith(this.CHANNEL_PREFIX))

    return msg.reply({
      embeds: [
        helpChannelStatusEmbed(this.client, msg, available, ongoing, dormant),
      ],
    })
  }

  // Create help channel
  private async createChannel(msg: CommandInteraction, channelName: string) {
    const created = await this.createHelpChannel(msg.guild!, channelName)

    return msg.reply({
      content: `Successfully created <#${created.id}> channel`,
    })
  }

  private async createHelpChannel(guild: Guild, channelName: string) {
    const channel = await guild.channels.create(`help-${channelName}`, {
      type: 'GUILD_TEXT',
      topic:
        'This is a help channel. You can claim own your own help channel in the Help: Available category.',
      reason: 'Maintain help channel goal',
      parent: config.guild.categories.helpAvailable,
    })

    // Channel should already be in ask, but sync permissions
    await this.moveChannel(channel, config.guild.categories.helpAvailable)
    await channel.send({ embeds: [availableEmbed] })

    return channel
  }

  private async claimBase({
    msg,
    member,
    limit = 10,
    replyMsg,
  }: {
    msg: CommandInteraction
    member: GuildMember
    limit?: number
    replyMsg?: Message
  }): Promise<void> {
    if (member?.user.bot) {
      return msg.reply({
        content: `:warning: I cannot open a help channel for ${member.displayName} because he is a turtle.`,
        ephemeral: true,
      })
    }

    try {
      const { data: helpChannel } =
        await this.api.get<IGetHelpChanByUserIdResponse>(
          `/helpchan/user/${member.id}`,
        )

      if (helpChannel) {
        return msg.reply({
          content: `${member.displayName} already has <#${helpChannel.channel_id}>`,
          ephemeral: true,
        })
      }
    } catch {
      // It's fine because it's that what's we search
    }

    const claimedChannel = msg.guild?.channels.cache.find(
      (channel) =>
        channel.type === 'GUILD_TEXT' &&
        channel.parentId === guild.categories.helpAvailable &&
        channel.name.startsWith(this.CHANNEL_PREFIX),
    ) as TextChannel | undefined

    if (!claimedChannel) {
      return msg.reply({
        content:
          ':warning: failed to claim a help channel, no available channels is found.',
        ephemeral: true,
      })
    }

    let msgContent = ''
    if (replyMsg) {
      msgContent = replyMsg.cleanContent
    } else {
      const channelMessage = await (msg.channel as TextChannel).messages.fetch({
        limit: 50,
      })
      const questionMessages = channelMessage.filter(
        (questionMsg) =>
          questionMsg.author.id === member.id && questionMsg.id !== msg.id,
      )

      msgContent = [...questionMessages.values()]
        .slice(0, limit)
        .map((msg) => msg.cleanContent)
        .reverse()
        .join('\n')
        .slice(0, 2000)
    }

    const toPin = await claimedChannel.send({
      embeds: [
        new MessageEmbed()
          .setAuthor(
            member.displayName,
            member.user.displayAvatarURL({ dynamic: false }),
          )
          .setDescription(msgContent),
      ],
    })

    await toPin.pin()
    await this.addCooldown(member)
    await this.moveChannel(claimedChannel, guild.categories.helpOngoing)
    await this.populateHelpChannel(member, claimedChannel, toPin)
    await claimedChannel.send({
      content: `${member.user} this channel has been claimed for your question. Please review <#${guild.channels.askHelpChannel}> for how to get help`,
    })

    await msg.reply({
      content: `🙇‍♂️ Successfully claimed ${claimedChannel}`,
      ephemeral: true,
    })

    await this.ensureAskChannels(msg.guild!)
    await this.syncHowToGetHelp(msg.guild!)

    return
  }

  private async updateHelpChannels(msg: CommandInteraction) {
    const helpChannels = [
      ...msg
        .guild!.channels.cache.filter((channel) =>
          channel.name.startsWith(this.CHANNEL_PREFIX),
        )
        .values(),
    ]

    for (const channel of helpChannels) {
      await channel.edit(
        {
          topic:
            'This is a help channel. You can claim your own help channel in the Help: Available category.',
        },
        'Maintain help channel goal',
      )
    }

    const embed = new MessageEmbed()
      .setTitle('✅ Successfully updated')
      .setDescription('Help Channels topic successfully updated')

    return await msg.reply({ embeds: [embed] })
  }

  private async syncChannels(msg: CommandInteraction) {
    await this.ensureAskChannels(msg.guild!)
    await this.syncHowToGetHelp(msg.guild!)

    const content = 'Help Channel system successfully synced'
    return msg.reply({
      content,
    })
  }
}
