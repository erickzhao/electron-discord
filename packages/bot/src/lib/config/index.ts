// Copyright (c) 2021 Siberian, Inc. All rights reserved.
// Use of this source code is governed by the MIT license that can be
// found in the LICENSE file.

let config: typeof import('./config.dev')

if (process.env.NODE_ENV === 'development') {
  config = require('./config.dev')
} else {
  config = require('./config.prod')
}

export = config
