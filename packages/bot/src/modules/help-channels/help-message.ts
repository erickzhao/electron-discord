// Copyright (c) 2021 Siberian, Inc. All rights reserved.
// Use of this source code is governed by the MIT license that can be
// found in the LICENSE file.

import { guild } from '../../lib/config'

export const helpMessage = () => `
**How to Ask For Help**

1. If your question fits into any project in the \`Ecosystem\` or \`Frameworks\` category, post it into them.
2. If not, send a question to <#${guild.channels.threadHelpChannel}>, which will automatically create a help thread for you.
4. Somebody will (hopefully) come along and help you.

When you share your question, include your **current version of Electron** (e.g. 12.0.0) and **operating system** (e.g. macOS Big Sur, Windows 10 20H2).
If you can, try to reproduce the issue in Electron Fiddle: https://www.electronjs.org/fiddle. You can then export your Fiddle code to a gist; include the link to your gist in your question.

**How To Get Answers**

We're very lucky to have members who volunteer their free time to help others. However, not all questions get answered the first time they get asked. There are some things that you can do to increase your chances of getting an answer, like providing enough details and a minimal code example. If you can reproduce your issue in Electron Fiddle, even better!
`
