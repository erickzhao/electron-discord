// Copyright (c) 2021 Siberian, Inc. All rights reserved.
// Use of this source code is governed by the MIT license that can be
// found in the LICENSE file.

import { MessageEmbed } from 'discord.js'
import { guild } from '../../lib/config'

export const helpMessage = () =>
  new MessageEmbed()
    .setTitle('Asking for Help')
    .setDescription("What's the best way of getting help in the server?")
    .setColor('#A2ECFB')
    .setThumbnail('https://i.imgur.com/Boe7zGI.gif')
    .addField(
      '#️⃣ Tip 1: Find the right channel',
      'If your question fits into any project in the `Ecosystem` or `Frameworks` category, use those designated channels.',
    )
    .addField(
      '🧶 Tip 2: Use our thread help system',
      `If you have a general Electron question, ask it in <#${guild.channels.threadHelpChannel}>, which will automatically create a help thread for you.`,
    )
    .addField(
      '🎻 Tip 3: Share a minimal repro when possible',
      `When sharing your question, include your **version of Electron** (e.g. v17.0.0) and **operating system** (e.g. macOS Big Sur). Try to reproduce the issue in [Electron Fiddle](https://www.electronjs.org/fiddle). You can then export your Fiddle code to a gist and include the link to your gist in your question.`,
    )
    .addField(
      '⏳ Tip 4: Be patient',
      `We're very lucky to have members who volunteer their free time to help others. However, not all questions get answered right away. There are some things that you can do to increase your chances of getting an answer, like providing a minimal code example.`,
    )
    .addField(
      '💌 Feedback appreciated',
      `This is a new system we're trying out! Please redirect feedback to <#${guild.channels.communityMeta}> channel.`,
    )
