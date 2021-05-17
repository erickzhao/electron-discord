import { LunaworkClient, listener } from 'lunawork'
import { Message } from 'discord.js'
import { MailBase } from './base'
import { guild } from '../../lib/config'

export class MailStaff extends MailBase {
  public constructor(client: LunaworkClient) {
    super(client)
  }

  @listener({ event: 'message' })
  public async onNewResponse(msg: Message) {
    if (
      msg.author.bot ||
      !msg.guild ||
      !msg.member ||
      msg.channel.type !== 'text' ||
      !msg.channel.parentID ||
      msg.channel.parentID !== guild.categories.modMail ||
      !msg.channel.name.startsWith(this.CHANNEL_PREFIX)
    ) {
      return
    }
  }
}
