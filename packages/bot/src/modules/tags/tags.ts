import { default as CookiecordClient, optional } from 'cookiecord'
import * as fs from 'fs-extra'
import * as path from 'path'
import { Message, MessageEmbed } from 'discord.js'
import { extendedCommand } from '../../lib/extended-command'
import { ExtendedModule } from '../../lib/extended-module'
import { createSelfDestructMessage } from '../../lib/self-destruct-messages'

export class TagsModule extends ExtendedModule {
  // N.B.: Yep here maybe is prefer to use `process.env.RUNFILES`, but since
  // this path is different from the internal path, we choose to use
  // this strange magic path.
  private tagsFolder = path.join(__dirname, '../../resources/tags')

  public constructor(client: CookiecordClient) {
    super(client)
  }

  @extendedCommand({
    aliases: ['t', 'topic'],
  })
  public async tags(msg: Message, @optional tag?: string) {
    if (!tag) {
      return await this.notFoundEmbed(msg, tag)
    }

    const tagData = await this.findTheTag(tag)

    if (!tagData) {
      return await this.notFoundEmbed(msg, tag)
    }

    const embed = new MessageEmbed().setDescription(tagData)

    return createSelfDestructMessage(msg, embed)
  }

  private async findTheTag(tag: string) {
    const tags = await this.listTheTags()

    if (tags.includes(`${tag}.md`)) {
      const content = await fs.readFile(
        path.join(this.tagsFolder, `${tag}.md`),
        { encoding: 'utf-8' },
      )

      return content
    }

    return false
  }

  private async listTheTags() {
    const tags = await fs.readdir(this.tagsFolder)
    return tags
  }

  private async notFoundEmbed(msg: Message, tag?: string) {
    const possibleTags = await this.listTheTags()

    const embed = new MessageEmbed()
      .setTitle(`Unable to find tag ${tag ?? ''}. List of all available tags:`)
      .setDescription(
        possibleTags
          .map((tag) => tag.split('.').slice(0, -1).join('.'))
          .join(', '),
      )
    return createSelfDestructMessage(msg, embed)
  }
}
