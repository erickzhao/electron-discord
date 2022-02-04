// Copyright (c) 2021 Siberian, Inc. All rights reserved.
// Use of this source code is governed by the MIT license that can be
// found in the LICENSE file.

import { MessageEmbed, Snowflake, ThreadChannel } from 'discord.js'
import { guild } from '../../lib/config'

export const activeThreadEmbed = (threads: Map<Snowflake, ThreadChannel>) => {
  const embed = new MessageEmbed()
    .setTitle('Active Help Threads')
    .setColor('#C0FFEE')

  const baseDesc = `A list of all active threads in <#${guild.channels.threadHelpChannel}>.\n\n`

  const fields = []

  for (const [id, thread] of threads.entries()) {
    // The createdTimestamp from Discord.js has 13 digits and must be
    // converted to 10 digits to be read by the timestamp embed
    const epochTimestamp = String(thread.createdTimestamp).slice(0, -3)
    fields.push({
      threadLink: `<#${id}>`,
      threadDescription: `opened <t:${epochTimestamp}:R>`,
    })
  }

  const finalDesc = baseDesc.concat(
    ...fields.map((f) => `${f.threadLink} — ${f.threadDescription}\n`),
  )
  return embed.setDescription(finalDesc)
}
