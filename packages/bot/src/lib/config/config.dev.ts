// Copyright (c) 2021 Siberian, Inc. All rights reserved.
// Use of this source code is governed by the MIT license that can be
// found in the LICENSE file.

import { toBigIntLiteral as b } from '../to-bigint-literal'
import { IStyle } from './types'

export const style: IStyle = {
  colors: {
    softRed: 0xcd6d6d,
    softGreen: 0x68c290,
    red: '#FF0000',
    yellow: '#FFB94E',
    greenBright: '#32CD32',
    electronBlue: '#358397',
  },

  emojis: {
    deleteBucket: '🗑',
    statusOffline: '<:status_offline:801990698357489694>',
    statusOnline: '<:status_online:801988207100559360>',

    // pronoun
    zezir: '<:ze:805243043527131196>',
    xexen: '<:xe:805243043132604457>',
    thenthey: '<:they:805243043582181376>',
    sheher: '<:she:805243043531587585>',
    nopronouns: '<:nopronouns:805243043653222450>',
    itits: '<:it:805243043472867358>',
    hehim: '<:he:805243043425943553>',
    faefaer: '<:fae:805243043653484574>',
    anypronouns: '<:anypronouns:805243043183067147>',
  },

  icons: {
    crownGreen: 'https://cdn.discordapp.com/emojis/469964154719961088.png',
    crownRed: 'https://cdn.discordapp.com/emojis/469964154879344640.png',

    hashGreen: 'https://cdn.discordapp.com/emojis/469950144918585344.png',
    hashRed: 'https://cdn.discordapp.com/emojis/469950145413251072.png',

    messageDelete: 'https://cdn.discordapp.com/emojis/472472641320648704.png',

    userJoin: 'https://cdn.discordapp.com/emojis/469952898181234698.png',
    userRemove: 'https://cdn.discordapp.com/emojis/469952898089091082.png',
    userBan: 'https://cdn.discordapp.com/emojis/469952898026045441.png',
  },
}

export const guild = {
  id: b('928801162600255509'),
  invite: 'https://discord.gg/electronjs',

  // these are hard-coded channel ID values
  // change if this changes!
  channels: {
    roles: b('928801163170684960'),
    releases: b('928801163170684961'),
    rules: b('928801163170684962'),
    adminBotInteractions: b('928801163170684967'),
    memberLog: b('928801163548192778'),
    askHelpChannel: b('928801163170684964'),
    activeThreadsChannel: b('938723367622676511'),
    threadHelpChannel: b('928801163170684965'),
    modLog: b('928801163548192779'),
    communityMeta: b('928801163170684967'),
  },

  roles: {
    everyone: b('745037351163527189'),
    admin: b('745038904532402237'),
    maintainer: b('745039155498582067'),
    helpCooldown: b('772835574197256199'),
    regular: b('828009346251227148'),
    helper: b('938207146456252488'),

    //#region etc

    // pronouns
    anyPronouns: b('760191162291191820'),
    faeFaer: b('760191164770287636'),
    heHim: b('760191175293796353'),
    itIts: b('760191175336132608'),
    noPronouns: b('760191176955002922'),
    sheHer: b('760191692510068806'),
    theyThem: b('760191695953723392'),
    xeXim: b('760191852892258305'),
    zeZir: b('760191899997962260'),

    // os
    windows: b('778343819590107218'),
    macOS: b('778343887382773801'),
    linux: b('778343916108906507'),

    //#endregion

    //#region Events
    // Hacktoberfest
    hacktoberfest: '893578484172091432',
    //#endregion
  },
}

export const urls = {
  githubBotURL: 'https://github.com/siberianmh/electron-discord',
}
