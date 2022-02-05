// Copyright (c) 2021 Siberian, Inc. All rights reserved.
// Use of this source code is governed by the MIT license that can be
// found in the LICENSE file.

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}

import { Stage } from '@siberianmh/lunawork'
import {
  FiltersStage,
  DocsModule,
  ActiveThreadListStage,
  EtcModule,
  ThreadHelpStage,
  HacktoberfestStage,
  ModLogModule,
  MiscStuffStage,
  ReadmeStage,
  TagsModule,
  UnfurlModule,
} from './modules'
import { client } from './lib/discord'

const stages: Array<typeof Stage | Stage> = [
  FiltersStage,
  MiscStuffStage,
  DocsModule,
  ActiveThreadListStage,
  EtcModule,
  HacktoberfestStage,
  ModLogModule,
  ReadmeStage,
  TagsModule,
  ThreadHelpStage,
  UnfurlModule,
]

client.registerStages(stages)

client.login(process.env.DISCORD_TOKEN)
client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}`)
})
